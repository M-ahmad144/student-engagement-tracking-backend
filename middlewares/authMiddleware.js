const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");

exports.authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(
        new ErrorHandler("User not found, authorization denied", 401)
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});

exports.authAdmin = asyncHandler((req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return next(new ErrorHandler("Access denied. Admins only.", 403));
  }
  next();
});
