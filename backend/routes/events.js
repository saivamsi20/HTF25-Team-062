const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Event = require("../models/Event");
const Club = require("../models/Club");
const User = require("../models/User");
const EventRegistration = require("../models/EventRegistration");
const { v4: uuidv4 } = require("uuid"); // <-- For generating unique IDs

// --- GET /api/events ---
// Get a list of all upcoming events (Public Route)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find({ date: { $gte: new Date() } }) // Only find future events
      .populate("club", "name") // Show the club's name
      .sort({ date: "asc" }); // Show the soonest events first
    res.json(events);
  } catch (error) {
    console.error("Get All Events Error:", error);
    res.status(500).json({ message: "Server error while fetching events." });
  }
});

// --- POST /api/events ---
// Create a new event (Protected Route for Organizers)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, date, location, clubId } = req.body;
    const userId = req.user.userId;

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found." });
    }
    if (club.organizer.toString() !== userId) {
      return res
        .status(403)
        .json({
          message: "You are not authorized to create events for this club.",
        });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      club: clubId,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(500).json({ message: "Server error while creating event." });
  }
});

// --- GET /api/events/:id ---
// Get details for a single event (Public Route)
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("club", "name"); // Show the club's name
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }
    res.json(event);
  } catch (error) {
    console.error("Get Single Event Error:", error);
    res.status(500).json({ message: "Server error while fetching event." });
  }
});

// --- POST /api/events/:id/register ---
// Register a user for an event (Protected Route)
router.post("/:id/register", authMiddleware, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.userId;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    const existingRegistration = await EventRegistration.findOne({
      event: eventId,
      user: userId,
    });
    if (existingRegistration) {
      return res
        .status(400)
        .json({ message: "You are already registered for this event." });
    }

    const qrCodeIdentifier = uuidv4();

    const newRegistration = new EventRegistration({
      event: eventId,
      user: userId,
      qrCodeIdentifier: qrCodeIdentifier,
    });

    await newRegistration.save();

    res.status(201).json({
      message: "Registered successfully!",
      registration: newRegistration,
    });
  } catch (error) {
    console.error("Event Registration Error:", error);
    res
      .status(500)
      .json({ message: "Server error while registering for event." });
  }
});

module.exports = router;
