const { validationResult } = require("express-validator");

// @desc    Middleware to check for and handle validation errors
const validateRequest = (req, res, next) => {
  // Finds the validation errors in this request and wraps them up with handy functions
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If there are errors, send a 400 response with the error details
    return res.status(400).json({
      message: "Validation failed.",
      errors: errors.array(),
    });
  }

  // If validation passes, move on to the next function (the controller)
  next();
};

module.exports = validateRequest;
