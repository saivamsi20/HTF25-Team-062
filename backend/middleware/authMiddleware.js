const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from the header
  const token = req.header("authorization")?.split(" ")[1];

  // Check if not token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user payload to the request object
    next(); // Move on to the next function (the actual route)
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
