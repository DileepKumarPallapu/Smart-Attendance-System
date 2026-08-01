const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getDepartments,
  createDepartment,
  deleteDepartment,
  getCourses,
  createCourse,
  getSubjects,
  createSubject,
  getUsers,
  deleteUser,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);

router.get('/departments', getDepartments);
router.post('/departments', createDepartment);
router.delete('/departments/:id', deleteDepartment);

router.get('/courses', getCourses);
router.post('/courses', createCourse);

router.get('/subjects', getSubjects);
router.post('/subjects', createSubject);

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
