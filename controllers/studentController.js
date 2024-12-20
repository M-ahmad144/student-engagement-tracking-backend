const Student = require("../models/studentModel");

// Add a new student
const addStudent = async (req, res) => {
  try {
    console.log("Received data:", req.body); // Log the received request body

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
    console.log("Received data:", req.body); // Log the received request body
    const { id } = req.params;
    const { name, rollNo, subject, section, session, teacher } = req.body;

    // Check if all required fields are provided
    if (!name || !rollNo || !subject || !section || !session || !teacher) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the rollNo already exists (except for the current student)
    const existingStudent = await Student.findOne({ rollNo, _id: { $ne: id } });
    if (existingStudent) {
      return res.status(400).json({ error: "Roll number must be unique" });
    }

    // Update the student data
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, rollNo, subject, section, session, teacher }, // Ensure section is included here
      { new: true, runValidators: true } // Ensures that the updated document is returned
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(updatedStudent); // Return the updated student
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: `Validation error: ${error.message}` });
    }
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
  console.log("Received data:", req.body); // Log the received request body
  try {
    const {
      rollNo,
      finalEngagementStatus,
      engagementCategory,
      engagementPercentage,
    } = req.body;

    // Validate input
    if (
      !rollNo ||
      !finalEngagementStatus ||
      !engagementCategory ||
      !engagementPercentage
    ) {
      return res.status(400).json({
        error:
          "rollNo, finalEngagementStatus, engagementCategory, and engagementPercentage are required",
      });
    }

    // Find student by rollNo
    const student = await Student.findOne({ rollNo });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Create the engagement result object
    const engagementResult = {
      rollNo,
      finalEngagementStatus,
      engagementCategory,
      engagementPercentage: parseFloat(engagementPercentage),
      dateTime: new Date(),
    };

    // Save the engagement result to the student's results array
    student.results.push(engagementResult);

    // Save the student with the updated results array
    await student.save();

    // Send success response
    res.json({ message: "Engagement result saved successfully", student });
  } catch (error) {
    console.error("Error saving engagement result:", error);
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
