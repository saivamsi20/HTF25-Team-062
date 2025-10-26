const EventRegistration = require("../models/EventRegistration");
const User = require("../models/User");

// @desc    Get the QR code identifier for a specific registration
// @route   GET /api/qr/:registrationId/qrcode
const getRegistrationQRCode = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const registration = await EventRegistration.findById(registrationId);

    if (!registration) {
      return res.status(404).json({ message: "Registration not found." });
    }

    // Authorization check: Only the registered user or an Admin can fetch the QR code
    if (registration.user.toString() !== userId && userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden. Not authorized to view this QR code." });
    }

    // The frontend will use the identifier to generate the visual QR code
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
  // Logic from the plan: Find registration, verify scanner role, update status to 'attended'
  res.status(501).json({ message: "Check-in logic not yet implemented." });
};

module.exports = {
  getRegistrationQRCode,
  checkInUser,
};
