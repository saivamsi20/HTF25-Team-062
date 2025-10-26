// backend/utils/generateToken.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  console.warn(
    "[generateToken] WARNING: JWT_SECRET is not set. Tokens will not be secure."
  );
}

/**
 * Generate a signed JWT token.
 * @param {Object} payload - data to include in token (e.g. { userId, role })
 * @param {String} [expiresIn] - optional override for token expiry (e.g. '1h')
 * @returns {String} signed JWT
 */
function generateToken(payload, expiresIn = JWT_EXPIRES_IN) {
  if (!JWT_SECRET)
    throw new Error("JWT_SECRET is not configured in environment");
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify a JWT token and return decoded payload.
 * Throws an error if token is invalid or expired.
 * @param {String} token
 * @returns {Object} decoded payload
 */
function verifyToken(token) {
  if (!JWT_SECRET)
    throw new Error("JWT_SECRET is not configured in environment");
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  generateToken,
  verifyToken,
};
