const express = require("express");
const router = express.Router();

// --- Import Middleware and Controllers ---
const authMiddleware = require("../middleware/auth");
const {
  createClub,
  getAllClubs,
  getClubById,
  subscribeToClub,
} = require("../controllers/clubController"); // <--- Ensure these names match the exports!

// --- Routes Definition ---

// @route   POST /api/clubs
// @desc    Create a new club
// @access  Private (Organizer/Admin)
router.post("/", authMiddleware, createClub);

// @route   GET /api/clubs
// @desc    Get all clubs
// @access  Public
router.get("/", getAllClubs); // <--- This line must now find the function correctly

// @route   GET /api/clubs/:id
// @desc    Get a single club and its events
// @access  Public
router.get("/:id", getClubById);

// @route   POST /api/clubs/:id/subscribe
// @desc    Subscribe to a club
// @access  Private (Logged-in users)
router.post("/:id/subscribe", authMiddleware, subscribeToClub);

module.exports = router;
