const express = require('express');
const router = express.Router();
const { getStudentDashboard } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('student', 'admin'));

router.get('/dashboard', getStudentDashboard);

module.exports = router;
