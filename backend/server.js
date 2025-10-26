require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db"); // 1. Imports DB connection setup

// --- Import All Routes ---
const authRoutes = require("./routes/auth");
const clubRoutes = require("./routes/clubs");
const eventRoutes = require("./routes/events");
const qrRoutes = require("./routes/qr"); // From the refactoring plan
const adminRoutes = require("./routes/admin"); // From the refactoring plan

// --- Database Connection ---
// Execute the function to connect to MongoDB Atlas.
connectDB();

const app = express();

// --- Middleware ---
app.use(morgan("dev")); // HTTP request logger
app.use(express.json()); // Body parser for JSON data
app.use(cors()); // CORS enabled for frontend connection

// --- Mount All Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/admin", adminRoutes);

// --- Basic Health Check ---
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// NOTE: You would typically mount your error handlers here:
// app.use(notFound);
// app.use(errorHandler);

// --- Server Start ---
const PORT = process.env.PORT || 5000;
// Server starts immediately. DB connection success is logged in config/db.js.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
