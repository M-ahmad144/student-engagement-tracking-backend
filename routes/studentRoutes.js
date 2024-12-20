const express = require("express");
const {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
  saveEngagementResult,
  EngagementResults,
} = require("../controllers/studentController");

const router = express.Router();
router.get("/engagement-results", EngagementResults);

// Student CRUD Routes
router.route("/").get(getAllStudents).post(addStudent);

router
  .route("/:id")
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);
// Save engagement results for a student based on video label
router.route("/engagement").post(saveEngagementResult);

console.log("Registering student engagement results route");

module.exports = router;
