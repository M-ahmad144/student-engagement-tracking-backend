const User = require("../models/userModel");
const asyncHandler = require("../middlewares/asyncHandler");
const generateToken = require("../utils/token");
const ErrorHandler = require("../utils/errorHandler");

// sign-up
exports.signupUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return next(new ErrorHandler("Please fill all the inputs.", 400));
  }
  const existUser = await User.findOne({ email });
  if (existUser) {
    return next(new ErrorHandler("User already exists", 400));
  }
  const newUser = await User.create({ username, email, password });
  // Generate token and set it as a cookie
  const token = generateToken(res, newUser._id);
  res.status(201).json({
    success: true,
    data: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token,
    },
  });
});

// login-user
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }
  const token = generateToken(res, user._id);
  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    },
  });
});

// logout-user
exports.logoutCurrentUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// get all users
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    success: true,
    users,
  });
});

// current user profile
exports.getCurrentUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

exports.updateCurrentUserProfile = asyncHandler(async (req, res, next) => {
  const { username, email } = req.body;

  // Validate if userId is provided
  if (!email) {
    return next(new ErrorHandler("User ID is required", 400));
  }

  // Find the user by the given userId
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User doesn't exist", 404));
  }

  // Update user information
  if (username) user.username = username;
  if (email) user.email = email;

  // Save the updated user information
  await user.save({ validateBeforeSave: true });

  // Send response with updated user details
  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
    message: "Profile updated successfully", // No password involved here
  });
});

//delete user
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (user && user.isAdmin) {
    return next(new ErrorHandler("Cannot delete admin user", 401));
  }
  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

//get user by id
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});
