const mongoose = require("mongoose");
const { Schema } = mongoose;

const clubSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    logoUrl: {
      type: String,
      default: "default_logo_url_here", // Optional: A placeholder image
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User", // This creates a link to the User model
      required: true,
    },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt fields

const Club = mongoose.model("Club", clubSchema);
module.exports = Club;
