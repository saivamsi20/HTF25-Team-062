const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// Import middleware
const authMiddleware = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");

// Import controllers
const {
  checkInUser,
  getRegistrationQRCode,
} = require("../controllers/qrController");

// --- Routes Definition ---

// @route   GET /api/qr/:registrationId/qrcode
// @desc    Gets the unique identifier for a registered user's QR code
// @access  Private (Logged-in user who owns the registration)
router.get(
  "/:registrationId/qrcode",
  authMiddleware,
  validateRequest,
  getRegistrationQRCode
);

// @route   POST /api/qr/checkin
// @desc    Verifies the QR code and marks user attendance
// @access  Private (Organizer/Admin)
router.post(
  "/checkin",
  authMiddleware,
  [
    // Validation rules for check-in
    body("qrCodeIdentifier")
      .notEmpty()
      .withMessage("QR code identifier is required"),
  ],
  validateRequest,
  checkInUser
);

module.exports = router;
