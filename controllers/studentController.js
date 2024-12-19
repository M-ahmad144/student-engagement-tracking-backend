const Student = require("../models/studentModel");

// Add a new student
const addStudent = async (req, res) => {
  try {
    // Destructure fields from request body
    const { name, rollNo, subject, section, session, teacher } = req.body;

    const newStudent = new Student({
      name,
      rollNo,
      subject,
      section,
      session,
      teacher,
    });

    // Save the student to the database
    await newStudent.save();

    // Return the newly created student
    res.status(201).json(newStudent);
  } catch (error) {
    // Log the error for debugging
    console.error(error);

    // Send a generic error response
    res.status(500).json({
      error: "Failed to add student",
      message: error.message, // Include the actual error message for debugging
    });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch student" });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: "Failed to update student" });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete student" });
  }
};

const saveEngagementResult = async (req, res) => {
  try {
    const { videoName, engagementResults } = req.body;

    // Extract roll number from videoName (e.g., "122.mp4")
    const rollNo = videoName.split(".")[0];

    const student = await Student.findOne({ rollNo });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Save engagement result to student
    student.results.push({ videoName, engagementResults });
    await student.save();

    res.json({ message: "Engagement result saved successfully", student });
  } catch (error) {
    res.status(500).json({ error: "Failed to save engagement result" });
  }
};

module.exports = {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  saveEngagementResult,
};
