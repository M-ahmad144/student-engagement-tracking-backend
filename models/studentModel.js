const mongoose = require("mongoose");
const resultSchema = new mongoose.Schema({
  rollNo: { type: String, required: true },
  finalEngagementStatus: { type: String, required: true }, // Stores the final result (e.g., "engaged" or "distracted")
  engagementCategory: { type: String, required: true }, // Stores the engagement category (e.g., "High Engagement")
  engagementPercentage: { type: Number, required: true }, // Stores the engagement percentage
  dateTime: { type: Date, required: true, default: Date.now }, // Timestamp of when the result was recorded
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  section: { type: String, required: true },
  session: { type: String, required: true },
  teacher: { type: String, required: true },

  results: [resultSchema], // Array of results for different videos
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
