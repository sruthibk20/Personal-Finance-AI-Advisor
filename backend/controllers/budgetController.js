const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const mongoose = require("mongoose");

// SAVE BUDGET
exports.addBudget = async (req, res) => {
  try {

    const { userId, month, limit } = req.body;

    if (!userId || !month || limit === undefined) {
      return res.status(400).json({ message: "userId, month and limit are required" });
    }

    const savedBudget = await Budget.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(userId),
        month
      },
      {
        userId: new mongoose.Types.ObjectId(userId),
        month,
        limit: Number(limit)
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.json(savedBudget);

  } catch (error) {
    console.error("Budget save error:", error);
    res.status(500).json({ message: "Error saving budget" });
  }
};


// GET BUDGET
exports.getBudget = async (req, res) => {
  try {

    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const month = req.query.month;

    if (!month) {
      return res.status(400).json({ message: "month query is required" });
    }

    const budget = await Budget.findOne({ userId, month });

    if (!budget) {
      return res.json(null);
    }

    const startDate = new Date(`${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setUTCMonth(endDate.getUTCMonth() + 1);

    const expenses = await Expense.find({
      userId,
      date: {
        $gte: startDate,
        $lt: endDate
      }
    });

    const totalExpense = expenses.reduce(
      (sum, e) => sum + e.amount,
      0
    );

    const remainingBudget = budget.limit - totalExpense;

    let alertMessage = "You are within your budget.";

    if (totalExpense > budget.limit) {
      alertMessage = `Budget exceeded by ₹${totalExpense - budget.limit}`;
    }

    res.json({
      month: budget.month,
      limit: budget.limit,
      totalExpense,
      remainingBudget,
      alertMessage
    });

  } catch (error) {
    console.error("Budget fetch error:", error);
    res.status(500).json({ message: "Error fetching budget" });
  }
};
