const Expense = require("../models/Expense");
const { SimpleLinearRegression } = require("ml-regression");

exports.getInsights = async (req, res) => {
  try {

    const userId = req.params.userId;

    const expenses = await Expense.find({ userId });

    if (expenses.length === 0) {
      return res.json({
        predictedExpense: 0,
        analysis: "No expenses recorded yet.",
        suggestion: "Start adding expenses to get insights."
      });
    }

    // -------------------------
    // GROUP EXPENSES BY MONTH
    // -------------------------

    const monthlyTotals = {};

    expenses.forEach(exp => {

      const month = new Date(exp.date).getMonth() + 1;

      if (!monthlyTotals[month]) {
        monthlyTotals[month] = 0;
      }

      monthlyTotals[month] += exp.amount;

    });

    const months = Object.keys(monthlyTotals).map(Number);
    const values = Object.values(monthlyTotals);

    let predictedExpense = 0;

    if (months.length >= 2) {

      const regression = new SimpleLinearRegression(months, values);

      const nextMonth = Math.max(...months) + 1;

      predictedExpense = Math.round(regression.predict(nextMonth));

    } else {

      predictedExpense = values[0];

    }

    // -------------------------
    // CATEGORY ANALYSIS
    // -------------------------

    const categoryTotals = {};

    expenses.forEach(exp => {

      if (!categoryTotals[exp.category]) {
        categoryTotals[exp.category] = 0;
      }

      categoryTotals[exp.category] += exp.amount;

    });

    let topCategory = "";
    let maxAmount = 0;

    for (const cat in categoryTotals) {

      if (categoryTotals[cat] > maxAmount) {
        maxAmount = categoryTotals[cat];
        topCategory = cat;
      }

    }

    const analysis = `Your highest spending category is ${topCategory}.`;

    // -------------------------
    // SUGGESTIONS
    // -------------------------

    let suggestion = "";

    if (maxAmount > 5000) {
      suggestion = `You are spending a lot on ${topCategory}. Try reducing it to improve savings.`;
    } else if (maxAmount > 2000) {
      suggestion = `Your ${topCategory} expenses are moderate. Consider monitoring them.`;
    } else {
      suggestion = "Your spending pattern looks healthy.";
    }

    res.json({
      predictedExpense,
      analysis,
      suggestion
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error generating insights"
    });

  }
};