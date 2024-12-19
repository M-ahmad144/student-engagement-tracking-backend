const Student = require("../models/studentModel");

// Add a new student
const addStudent = async (req, res) => {
  try {
    const { name, rollNo, subject, section, session, teacher } = req.body;

    // Check if all required fields are provided
    if (!name || !rollNo || !subject || !section || !session || !teacher) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the rollNo already exists
    const existingStudent = await Student.findOne({ rollNo });
    if (existingStudent) {
      return res.status(400).json({ error: "Roll number must be unique" });
    }

    const newStudent = new Student({
      name,
      rollNo,
      subject,
      section,
      session,
      teacher,
    });

    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    console.error(error);
    // Catch validation error and send appropriate response
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: `Validation error: ${error.message}` });
    }
    res.status(500).json({ error: "Failed to add student" });
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
