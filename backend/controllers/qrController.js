const EventRegistration = require("../models/EventRegistration");
const User = require("../models/User");
// @desc    Get the QR code identifier for a specific registration
// @route   GET /api/qr/:registrationId/qrcode
const getRegistrationQRCode = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Find the registration by ID
    const registration = await EventRegistration.findById(registrationId);

    if (!registration) {
      return res.status(404).json({ message: "Registration not found." });
    }

    // Authorization check: Only the registered user (owner) or an Admin can fetch the QR code
    if (registration.user.toString() !== userId && userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden. Not authorized to view this QR code." });
    }

    // Send the unique identifier (the frontend uses this string to generate the visual code)
    res.json({
      qrCodeIdentifier: registration.qrCodeIdentifier,
      eventId: registration.event,
      status: registration.status,
    });
  } catch (error) {
    console.error("Get QR Code Error:", error);
    res.status(500).json({ message: "Server error fetching QR code." });
  }
};

// @desc    Check-in a user by verifying a QR code
// @route   POST /api/qr/checkin
const checkInUser = async (req, res) => {
  try {
    const { qrCodeIdentifier } = req.body;
    const organizerId = req.user.userId; // The user scanning the code

    // Find the registration using the identifier
    const registration = await EventRegistration.findOne({
      qrCodeIdentifier,
    }).populate("event", "club organizer"); // Need event and its club/organizer data

    if (!registration) {
      return res.status(404).json({ message: "Invalid QR Code." });
    }

    const club = registration.event.club;
    // NOTE: In a real app, you would need to check if the organizerId
    // matches the organizer of the club hosting this event.

    // Simplified authorization check: Requires Admin role for now
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden. Only admins/organizers can check in." });
    }

    if (registration.status === "attended") {
      return res.status(400).json({ message: "User already checked in." });
    }

    // Mark as attended
    registration.status = "attended";
    await registration.save();

    res.json({
      message: "Check-in successful!",
      user: registration.user,
      event: registration.event.title,
    });
  } catch (error) {
    console.error("Check-in Error:", error);
    res.status(500).json({ message: "Server error during check-in." });
  }
};

module.exports = {
  getRegistrationQRCode,
  checkInUser,
};
