const Expense = require("../models/Expense");
const mongoose = require("mongoose");

// CREATE EXPENSE
exports.addExpense = async (req, res) => {
  try {

    const { userId, category, amount, description, date } = req.body;
    console.log("Incoming expense:", req.body);
    const expense = new Expense({
      userId: new mongoose.Types.ObjectId(userId),
      category,
      amount: Number(amount),
      description,
      date
    });

    const savedExpense = await expense.save();

    res.status(201).json(savedExpense);

  } catch (error) {
    console.error("Expense save error:", error);
    res.status(500).json({ message: "Error adding expense" });
  }
};


// GET EXPENSES BY USER
exports.getExpensesByUser = async (req, res) => {
  try {

    const userId = new mongoose.Types.ObjectId(req.params.userId);

    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    res.json(expenses);

  } catch (error) {
    console.error("Fetch expense error:", error);
    res.status(500).json({ message: "Error fetching expenses" });
  }
};


// UPDATE EXPENSE
exports.updateExpense = async (req, res) => {
  try {

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedExpense);

  } catch (error) {
    console.error("Update expense error:", error);
    res.status(500).json({ message: "Error updating expense" });
  }
};

exports.getExpenseById = async (req, res) => {
  try {

    const expense = await Expense.findById(req.params.id);

    res.json(expense);

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Error fetching expense" });

  }
};
// DELETE EXPENSE
exports.deleteExpense = async (req, res) => {
  try {

    await Expense.findByIdAndDelete(req.params.id);

    res.json({ message: "Expense deleted successfully" });

  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({ message: "Error deleting expense" });
  }
};