const jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
  // Generate the JWT token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token validity
  });

  // Set the JWT token in an HTTP-only cookie
  res.cookie("jwt", token, {
    httpOnly: true, // Protects against XSS
    secure: process.env.NODE_ENV === "production", // Ensures secure cookies in production
    sameSite: "strict", // Prevents CSRF
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  });

  return token;
};

module.exports = generateToken;
