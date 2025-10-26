const Club = require("../models/Club");
const User = require("../models/User");
const Event = require("../models/Event");
// Note: Assuming EventRegistration is the correct name for the Registration model
const EventRegistration = require("../models/Registration");

// @desc    Create a new club
// @route   POST /api/clubs
const createClub = async (req, res) => {
  try {
    const { name, description } = req.body;
    const organizerId = req.user.userId;

    const user = await User.findById(organizerId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Invalid token payload." });
    }

    if (user.role !== "club_organizer" && user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only club organizers or admins can create clubs." });
    }

    const existingClub = await Club.findOne({ name });
    if (existingClub) {
      return res
        .status(400)
        .json({ message: "A club with this name already exists." });
    }

    const newClub = new Club({
      name,
      description,
      organizer: organizerId,
    });

    const savedClub = await newClub.save();
    res.status(201).json(savedClub);
  } catch (error) {
    console.error("Create Club Error:", error);
    res.status(500).json({ message: "Server error while creating club." });
  }
};

// @desc    Get all clubs
// @route   GET /api/clubs
const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find().populate("organizer", "name");
    res.json(clubs);
  } catch (error) {
    console.error("Get All Clubs Error:", error);
    res.status(500).json({ message: "Server error while fetching clubs." });
  }
};

// @desc    Get a single club by its ID (and its events)
// @route   GET /api/clubs/:id
const getClubById = async (req, res) => {
  try {
    const clubId = req.params.id;
    const club = await Club.findById(clubId).populate(
      "organizer",
      "name email"
    );

    if (!club) {
      return res.status(404).json({ message: "Club not found." });
    }

    // Use EventRegistration for the count since that model tracks registrations
    const events = await Event.find({ club: clubId }).sort({ date: "asc" });

    res.json({ club, events });
  } catch (error) {
    console.error("Get Single Club Error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching club details." });
  }
};

// @desc    Subscribe the logged-in user to a club
// @route   POST /api/clubs/:id/subscribe
const subscribeToClub = async (req, res) => {
  try {
    const clubId = req.params.id;
    const userId = req.user.userId;

    await User.findByIdAndUpdate(userId, {
      $addToSet: { subscribedClubs: clubId },
    });

    res.json({ message: "Successfully subscribed to the club!" });
  } catch (error) {
    console.error("Subscribe to Club Error:", error);
    res.status(500).json({ message: "Server error while subscribing." });
  }
};

// V--- CRITICAL FIX: Standardize Export to a single object ---V
module.exports = {
  createClub,
  getAllClubs,
  getClubById,
  subscribeToClub,
};
