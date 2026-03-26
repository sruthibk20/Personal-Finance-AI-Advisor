const express = require("express");
const router = express.Router();

const {
  addExpense,
  getExpensesByUser,
  updateExpense,
  deleteExpense,
  getExpenseById
} = require("../controllers/expenseController");

router.post("/", addExpense);

// IMPORTANT
router.get("/user/:userId", getExpensesByUser);

router.get("/single/:id", getExpenseById);

router.put("/:id", updateExpense);

router.delete("/:id", deleteExpense);

module.exports = router;