const express = require('express');
const router = express.Router();
const { loginUser, getMe, registerUser, forgotPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/forgot-password', forgotPassword);
router.get('/me', protect, getMe);

module.exports = router;
