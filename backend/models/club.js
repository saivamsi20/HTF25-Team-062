// backend/models/Club.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const clubSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: "" },
    logoUrl: { type: String, default: "" }, // store image URL (Cloudinary or S3)
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    coOrganizers: [{ type: Schema.Types.ObjectId, ref: "User" }], // optional
    tags: [{ type: String }],
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Club", clubSchema);
