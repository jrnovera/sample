const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course");

const auth = require("../auth");
const {verify, verifyAdmin} = auth;

// Add course
router.post("/", verify, verifyAdmin, courseController.addCourse);

// Get all courses
router.get("/all" , verify, verifyAdmin, courseController.getAllCourses);

// Get all active courses
router.get("/" , courseController.getAllActive);

router.get("/:courseId" , courseController.getCourse);

// put - if we want to update the whole document
// patch - if we want to update a specific field/s

router.patch("/:courseId", verify, verifyAdmin, courseController.updateCourse);


//[SECTION] Route to archiving a course (Admin)
router.patch("/:courseId/archive", verify, verifyAdmin, courseController.archiveCourse);

//[SECTION] Route to activating a course (Admin)
router.patch("/:courseId/activate", verify, verifyAdmin, courseController.activateCourse);


router.post('/searchByPrice', courseController.searchCoursesByPrice);





module.exports = router;



