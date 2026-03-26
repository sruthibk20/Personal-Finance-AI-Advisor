const express = require("express");
const { getMonthlyExpenses } = require("../controllers/chartController");

const router = express.Router();

router.get("/monthly/:userId", getMonthlyExpenses);

module.exports = router;
