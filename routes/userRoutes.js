const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  logoutCurrentUser,
  getCurrentUserProfile,
  updateCurrentUserProfile,
} = require("../controllers/userController");

// Middleware imports
const { authMiddleware } = require("../middlewares/authMiddleware");

// Public authentication routes
router.post("/register", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutCurrentUser);
router.patch("/profile", updateCurrentUserProfile);

// Protected routes
router.use(authMiddleware);

// Profile routes (user-protected routes)
router.get("/profile", getCurrentUserProfile);

module.exports = router;
