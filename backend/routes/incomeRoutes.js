const express = require("express");
const { addIncome } = require("../controllers/incomeController");

const router = express.Router();

router.post("/", addIncome);

module.exports = router;
