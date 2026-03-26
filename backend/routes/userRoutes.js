const express = require("express");
const {
  createUser,
  loginUser,
  getUserProfile,
  updateUserProfile
} = require("../controllers/userController");

const router = express.Router();

router.post("/", createUser);        // Register
router.post("/login", loginUser);    // Login
router.get("/:id", getUserProfile);
router.put("/:id/profile", updateUserProfile);

module.exports = router;
