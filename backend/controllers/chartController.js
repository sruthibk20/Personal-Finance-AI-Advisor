const Expense = require("../models/Expense");

const getMonthlyExpenses = async (req, res) => {
  try {
    const { userId } = req.params;

    const expenses = await Expense.find({ userId });

    const monthMap = {};

    expenses.forEach((e) => {
      const month = e.date.toISOString().slice(0, 7); // YYYY-MM
      monthMap[month] = (monthMap[month] || 0) + e.amount;
    });

    const result = Object.keys(monthMap).map((m) => ({
      month: m,
      amount: monthMap[m]
    }));

    res.json(result);
  } catch {
    res.status(500).json({ message: "Failed to fetch chart data" });
  }
};

module.exports = { getMonthlyExpenses };
