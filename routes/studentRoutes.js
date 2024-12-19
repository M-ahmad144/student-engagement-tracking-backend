const express = require("express");
const {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
  saveEngagementResult,
} = require("../controllers/studentController");

const router = express.Router();

// Student CRUD Routes
router
  .route("/")
  .get(getAllStudents) // Get all students
  .post(addStudent); // Add a new student

router
  .route("/:id")
  .get(getStudentById) // Get a single student by ID
  .put(updateStudent) // Update a student by ID
  .delete(deleteStudent); // Delete a student by ID

// Save engagement results for a student based on video label
router.route("/engagement").post(saveEngagementResult);

module.exports = router;
