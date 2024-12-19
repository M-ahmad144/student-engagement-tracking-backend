const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  videoName: { type: String, required: true },
  engagementResults: [
    {
      frame: { type: String, required: true },
      engagementStatus: { type: String, required: true },
    },
  ],
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  section: { type: String, required: true },
  session: { type: String, required: true },
  teacher: { type: String, required: true },

  results: [resultSchema],
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
