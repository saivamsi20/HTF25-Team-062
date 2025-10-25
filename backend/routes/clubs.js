const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Club = require("../models/Club");
const User = require("../models/User");
const Event = require("../models/Event");
// --- POST /api/clubs --- (You already have this)
router.post("/", authMiddleware, async (req, res) => {
  // ... your existing code to create a club
});

// --- GET /api/clubs
// Get details for a single club AND its events (Public Route)
router.get("/", async (req, res) => {
  try {
    const clubs = await Club.find().populate("organizer", "name");
    res.json(clubs);
  } catch (error) {
    console.error("Get All Clubs Error:", error);
    res.status(500).json({ message: "Server error while fetching clubs." });
  }
});

// Subscribe a user to a club (Protected Route for Students)
router.post("/:id/subscribe", authMiddleware, async (req, res) => {
  try {
    const clubId = req.params.id;
    const userId = req.user.userId;

    // Add the clubId to the user's subscribedClubs array
    // Using $addToSet prevents duplicate entries
    await User.findByIdAndUpdate(userId, {
      $addToSet: { subscribedClubs: clubId },
    });

    res.json({ message: "Successfully subscribed to the club!" });
  } catch (error) {
    console.error("Subscribe to Club Error:", error);
    res.status(500).json({ message: "Server error while subscribing." });
  }
});

module.exports = router;
