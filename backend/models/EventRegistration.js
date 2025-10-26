const mongoose = require("mongoose");
const { Schema } = mongoose;

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
      unique: true,
      // You can safely remove the custom validator, as 'unique: true' handles this
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
    index: { user: 1, event: 1, unique: true },
  }
);

// V--- CRITICAL FIX: Check if the model already exists before compiling ---V
const EventRegistration =
  mongoose.models.EventRegistration ||
  mongoose.model("EventRegistration", EventRegistrationSchema);

module.exports = EventRegistration;
