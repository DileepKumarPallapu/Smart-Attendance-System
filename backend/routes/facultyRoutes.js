const express = require('express');
const router = express.Router();
const { getFacultyOverview, getClassStudents } = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('faculty', 'admin'));

router.get('/overview', getFacultyOverview);
router.get('/class-students/:className', getClassStudents);

module.exports = router;
