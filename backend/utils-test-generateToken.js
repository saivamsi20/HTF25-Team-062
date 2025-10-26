require("dotenv").config();
const { generateToken, verifyToken } = require("./utils/generateToken");

const token = generateToken({ userId: "abc123", role: "student" }, "1h");
console.log("Token:", token);

const decoded = verifyToken(token);
console.log("Decoded:", decoded);
