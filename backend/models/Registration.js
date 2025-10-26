// backend/models/Registration.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const registrationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    attended: { type: Boolean, default: false },
    qrCodeId: { type: String, required: true, unique: true },
    checkedInAt: { type: Date, default: null },
  },
  { timestamps: true }
);

registrationSchema.index({ event: 1, user: 1 }, { unique: true }); // prevents duplicate registrations

module.exports = mongoose.model("Registration", registrationSchema);
