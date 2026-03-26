const express = require("express");
const router = express.Router();

const { getInsights } = require("../controllers/mlController");

// GET ML INSIGHTS
router.get("/:userId", getInsights);

module.exports = router;