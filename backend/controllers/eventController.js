const mongoose = require("mongoose");
const { Schema } = mongoose;
const Event = require("../models/Event");
const EventRegistration = require("../models/EventRegistration");

const EventRegistrationSchema = new Schema(
  {
    // Link to the User who registered
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Link to the Event being registered for
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    // Unique identifier used for the QR code image data
    qrCodeIdentifier: {
      type: String,
      required: true,
      unique: true, // Ensure no two registrations generate the same QR code
    },

    // Status of the attendance
    status: {
      type: String,
      enum: ["registered", "attended", "cancelled"],
      default: "registered",
    },
  },
  {
    timestamps: true,
    // Prevents a single user from registering for the same event multiple times
    // This creates a compound unique index on user and event
    index: { user: 1, event: 1, unique: true },
  }
);

// @desc    Get all registrations for the logged-in user
// @route   GET /api/events/my-registrations
const getMyRegistrations = async (req, res) => {
  try {
    // 1. Get the userId from the authenticated request object
    const userId = req.user.userId;

    // 2. Find all registrations matching that userId
    const registrations = await EventRegistration.find({ user: userId })
      // 3. Populate (embed) the event details for the frontend display
      .populate("event", "title date location club")
      // 4. Sort by newest registration first
      .sort({ createdAt: -1 });

    res.json({ registrations });
  } catch (error) {
    console.error("Get My Registrations Error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching registrations." });
  }
};

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("club", "name")
      .sort({ date: 1 });
    res.json({ success: true, data: events });
  } catch (error) {
    console.error("Get All Events Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching events." });
  }
};

// Get single event
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("club", "name")
      .populate("organizer", "name");

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    console.error("Get Event Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching event." });
  }
};

// Create new event
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, clubId } = req.body;

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      club: clubId,
      organizer: req.user.userId,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json({ success: true, data: savedEvent });
  } catch (error) {
    console.error("Create Event Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while creating event." });
  }
};

// Register for an event
const registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.userId;

    const event = await Event.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    const existingRegistration = await EventRegistration.findOne({
      event: eventId,
      user: userId,
    });

    if (existingRegistration) {
      return res
        .status(400)
        .json({ success: false, message: "Already registered for this event" });
    }

    const registration = new EventRegistration({
      event: eventId,
      user: userId,
      status: "registered",
    });

    await registration.save();
    res.status(201).json({ success: true, data: registration });
  } catch (error) {
    console.error("Register Event Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while registering for event.",
    });
  }
};

module.exports = {
  EventRegistration,
  getMyRegistrations,
  getAllEvents,
  getEventById,
  createEvent,
  registerForEvent,
};
