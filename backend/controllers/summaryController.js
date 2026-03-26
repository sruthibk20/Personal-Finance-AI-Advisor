const Expense = require("../models/Expense");
const Income = require("../models/Income");

const getSummary = async (req, res) => {
  try {

    const { userId } = req.params;

    const expenses = await Expense.find({ userId });
    const incomes = await Income.find({ userId });

    // TOTALS
    const totalExpense = expenses.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    );

    const totalIncome = incomes.reduce(
      (sum, i) => sum + Number(i.amount),
      0
    );

    const balance = totalIncome - totalExpense;

    // CATEGORY BREAKDOWN
    const categoryMap = {};

    expenses.forEach((e) => {

      const category = e.category
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());

      categoryMap[category] =
        (categoryMap[category] || 0) + Number(e.amount);

    });

    const categoryBreakdown = Object.keys(categoryMap).map(cat => ({
      category: cat,
      amount: categoryMap[cat]
    }));


    // MONTHLY EXPENSE TREND

    const monthlyMap = {};

    expenses.forEach((e) => {

      const date = new Date(e.date);

      const month = date.toLocaleString(
        "default",
        { month: "short" }
      );

      const monthIndex = date.getMonth();

      if (!monthlyMap[month]) {

        monthlyMap[month] = {
          month,
          amount: 0,
          index: monthIndex
        };

      }

      monthlyMap[month].amount += Number(e.amount);

    });


    const monthlyExpenses = Object.values(monthlyMap)
      .sort((a, b) => a.index - b.index)
      .map(({ month, amount }) => ({
        month,
        amount
      }));


    // SAVINGS RATE

    let savingsRate = 0;

    if (totalIncome > 0) {

      savingsRate = Math.round(
        (balance / totalIncome) * 100
      );

    }


    // FINANCIAL HEALTH SCORE

    let financialHealthScore = 100;

    if (savingsRate < 10) financialHealthScore -= 30;

    else if (savingsRate < 30) financialHealthScore -= 10;

    if (totalExpense > totalIncome)
      financialHealthScore -= 40;

    if (financialHealthScore < 0)
      financialHealthScore = 0;


    res.json({

      totalIncome,
      totalExpense,
      balance,
      savingsRate,
      financialHealthScore,
      categoryBreakdown,
      monthlyExpenses

    });

  }

  catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to fetch summary"
    });

  }
};

module.exports = { getSummary };