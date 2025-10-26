const jwt = require("jsonwebtoken");

/**
 * @desc Middleware to check for a valid JSON Web Token (JWT) in the request header.
 * If valid, it attaches the user's ID and role to the request object (req.user).
 */
const authMiddleware = (req, res, next) => {
  // 1. Get token from header
  // The token is expected in the format: "Bearer <token>"
  const authHeader = req.header("authorization");

  // 2. Check if token header exists at all
  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Split the header and check if it follows the "Bearer <token>" format
  const parts = authHeader.split(" ");
  const token = parts.length === 2 && parts[0] === "Bearer" ? parts[1] : null;

  // 3. Check if the token part is present
  if (!token) {
    return res
      .status(401)
      .json({
        message:
          "Malformed token or missing Bearer prefix, authorization denied",
      });
  }

  // 4. Verify token
  try {
    // jwt.verify decodes the token using your JWT_SECRET from the .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user's payload (userId, role) to the request object
    // This makes the user data available to the controller function (e.g., getCurrentUser)
    req.user = decoded;

    // Move on to the next function in the route chain (the controller)
    next();
  } catch (err) {
    // If verification fails (e.g., token is expired or tampered with)
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
