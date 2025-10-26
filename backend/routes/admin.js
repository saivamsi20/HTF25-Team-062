const express = require("express");
const router = express.Router();
const { getAllUsers, deleteClub } = require("../controllers/adminController");
const authMiddleware = require("../middleware/auth");

// This is a simple role check middleware.
// For a real app, you'd add this to your auth.js middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get("/users", authMiddleware, adminOnly, getAllUsers);

// @route   DELETE /api/admin/clubs/:id
// @desc    Delete a club
// @access  Private (Admin)
router.delete("/clubs/:id", authMiddleware, adminOnly, deleteClub);

module.exports = router;
