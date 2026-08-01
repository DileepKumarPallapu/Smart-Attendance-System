const express = require('express');
const router = express.Router();
const { getAttendanceLogs, overrideAttendance, markBatchAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/logs', getAttendanceLogs);
router.put('/override/:id', authorize('faculty', 'admin'), overrideAttendance);
router.post('/mark-batch', authorize('faculty', 'admin'), markBatchAttendance);

module.exports = router;
