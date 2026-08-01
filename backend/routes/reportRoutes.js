const express = require('express');
const router = express.Router();
const { getReportAnalytics, exportCSV } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/analytics', getReportAnalytics);
router.get('/export-csv', exportCSV);

module.exports = router;
