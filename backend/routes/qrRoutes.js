const express = require('express');
const router = express.Router();
const { startQRSession, getSessionStatus, scanQRCode, endQRSession } = require('../controllers/qrController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/start-session', authorize('faculty', 'admin'), startQRSession);
router.get('/session/:sessionId', getSessionStatus);
router.post('/scan', authorize('student', 'admin'), scanQRCode);
router.post('/end-session/:sessionId', authorize('faculty', 'admin'), endQRSession);

module.exports = router;
