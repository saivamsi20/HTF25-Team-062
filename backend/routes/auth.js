const express = require("express");
const router = express.Router();
const { body } = require("express-validator"); // For input validation

// --- Import Controller and Middleware ---
const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");

// --- Routes Definition ---

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  [
    // Validation Rules
    body("name", "Name is required").not().isEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  validateRequest, // Stop request if validation fails
  registerUser // Run controller logic
);

// @route   POST /api/auth/login
// @desc    Login a user and get token
// @access  Public
router.post(
  "/login",
  [
    // Validation Rules
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  validateRequest, // Stop request if validation fails
  loginUser // Run controller logic
);

// @route   GET /api/auth/me
// @desc    Get the current logged-in user's details
// @access  Private
// Uses authMiddleware as the gatekeeper
router.get("/me", authMiddleware, getCurrentUser);
// Temporary route to fetch all users (for dashboard stats)
const User = require("../models/User");
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;
