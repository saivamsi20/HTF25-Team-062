const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  createEvent,
  getAllEvents,
  getEventById,
  getMyRegistrations,
  registerForEvent,
} = require("../controllers/eventController");

// Import middleware
const authMiddleware = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");

// Get all events
router.get("/", getAllEvents);

// Get single event
router.get("/:id", getEventById);

// Get my registrations
router.get("/my-registrations", authMiddleware, getMyRegistrations);

// Create event
router.post(
  "/",
  authMiddleware,
  [
    body("title").notEmpty().trim().withMessage("Title is required"),
    body("description")
      .notEmpty()
      .trim()
      .withMessage("Description is required"),
    body("date").isISO8601().withMessage("Valid date is required"),
    body("location").notEmpty().trim().withMessage("Location is required"),
  ],
  validateRequest,
  createEvent
);

// Register for event
router.post("/:id/register", authMiddleware, validateRequest, registerForEvent);

module.exports = router;
