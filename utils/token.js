const jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
  // Generate the JWT token
  const token = jwt.sign({ userId }, "my-secret-key", {
    expiresIn: "30d",
  });

  // Set the JWT token in an HTTP-only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  });

  return token;
};

module.exports = generateToken;
