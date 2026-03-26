const Income = require("../models/Income");
const mongoose = require("mongoose");

exports.addIncome = async (req, res) => {
  try {

    const income = new Income({
      userId: new mongoose.Types.ObjectId(req.body.userId),
      source: req.body.source,
      amount: Number(req.body.amount)
    });

    await income.save();

    res.status(201).json(income);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding income" });
  }
};