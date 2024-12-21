const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");

exports.authMiddleware = asyncHandler(async (req, res, next) => {
  // Get the token from the Authorization header (Bearer token)
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return next(new ErrorHandler("No token, authorization denied", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the decoded userId
    const user = await User.findById(decoded.userId);

    // If no user found with the decoded userId
    if (!user) {
      return next(
        new ErrorHandler("User not found, authorization denied", 401)
      );
    }

    // Attach the user to the request object for later use
    req.user = user;
    next();
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    // Handle different types of JWT errors (e.g., expired, invalid)
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Token expired. Please log in again.", 401));
    }

    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});
