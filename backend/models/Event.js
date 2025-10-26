// backend/models/Event.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    club: { type: Schema.Types.ObjectId, ref: "Club", required: true },
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    capacity: { type: Number, default: null }, // optional capacity limit
    tags: [{ type: String }],
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
