const User = require("../models/User");
const Club = require("../models/Club");

// NOTE: We don't implement the full logic here yet, just the basic function structure.

// @desc    Get all users
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  // In a real implementation, you would check req.user.role === 'admin' here.
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Admin Get Users Error:", error);
    res.status(500).json({ message: "Server error fetching users." });
  }
};

// @desc    Delete a club
// @route   DELETE /api/admin/clubs/:id
const deleteClub = async (req, res) => {
  // In a real implementation, you would perform the delete operation here.
  res
    .status(501)
    .json({
      message: `Admin: Delete club ${req.params.id} (logic not implemented yet)`,
    });
};

module.exports = {
  getAllUsers,
  deleteClub,
};
