const mongoose = require("mongoose");

// DOTENV
require("dotenv").config();
//get the password
const password = process.env.DATABASE_PASSWORD;

const DB = `mongodb+srv://muhammadahmadmughal0987:${password}@engagement-tracking.p95kr.mongodb.net/?retryWrites=true&w=majority`;

// Connect to MongoDB
const connectDB = async () => {
  try {
    // No need for useNewUrlParser or useUnifiedTopology anymore
    await mongoose.connect(DB);
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err.message);
    process.exit(1);
  }
};

// Export the connectDB function
module.exports = connectDB;
