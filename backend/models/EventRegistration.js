const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventRegistrationSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["registered", "attended"],
      default: "registered",
    },
    qrCodeIdentifier: {
      // The unique string we'll put in the QR code
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const EventRegistration = mongoose.model(
  "EventRegistration",
  eventRegistrationSchema
);
module.exports = EventRegistration;
