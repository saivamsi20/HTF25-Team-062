// backend/utils/logger.js
const path = require("path");
const fs = require("fs");
const { createLogger, format, transports } = require("winston");

const logsDir = path.join(process.cwd(), "logs");

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  try {
    fs.mkdirSync(logsDir);
  } catch (err) {
    // If creation fails, we'll still use console-only logging
    console.warn("[logger] Failed to create logs directory:", err.message);
  }
}

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.simple()
  ),
  transports: [
    new transports.Console({
      handleExceptions: true,
      format: format.combine(format.colorize(), format.simple()),
    }),
    new transports.File({
      filename: path.join(logsDir, "app.log"),
      handleExceptions: true,
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
    }),
  ],
  exitOnError: false,
});

module.exports = logger;
