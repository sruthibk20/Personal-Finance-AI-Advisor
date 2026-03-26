const express = require("express");
const router = express.Router();

const budgetController = require("../controllers/budgetController");

// SAVE BUDGET
router.post("/", budgetController.addBudget);

// GET BUDGET
router.get("/:userId", budgetController.getBudget);

module.exports = router;