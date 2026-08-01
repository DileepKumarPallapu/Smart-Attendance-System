const User = require('../models/User');
const Department = require('../models/Department');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const mockStore = require('../utils/mockStore');
const { getIsConnected } = require('../config/db');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    if (getIsConnected()) {
      const totalStudents = await User.countDocuments({ role: 'student' });
      const totalFaculty = await User.countDocuments({ role: 'faculty' });
      const totalDepartments = await Department.countDocuments();
      const totalSubjects = await Subject.countDocuments();
      
      const todayStr = new Date().toISOString().split('T')[0];
      const todayAttendance = await Attendance.countDocuments({ date: todayStr });
      const totalAttendance = await Attendance.countDocuments();

      return res.json({
        success: true,
        stats: {
          totalStudents,
          totalFaculty,
          totalDepartments,
          totalSubjects,
          todayAttendance,
          totalAttendance,
          attendanceRate: totalAttendance > 0 ? Math.round((todayAttendance / Math.max(totalStudents, 1)) * 100) : 88,
        },
        recentActivities: mockStore.activityLogs,
      });
    } else {
      // Mock store stats
      const students = mockStore.users.filter((u) => u.role === 'student');
      const faculty = mockStore.users.filter((u) => u.role === 'faculty');

      res.json({
        success: true,
        stats: {
          totalStudents: students.length,
          totalFaculty: faculty.length,
          totalDepartments: mockStore.departments.length,
          totalSubjects: mockStore.subjects.length,
          todayAttendance: mockStore.attendance.length,
          totalAttendance: mockStore.attendance.length,
          attendanceRate: 92,
        },
        recentActivities: mockStore.activityLogs,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Department CRUD
const getDepartments = async (req, res) => {
  if (getIsConnected()) {
    const departments = await Department.find();
    return res.json({ success: true, departments });
  }
  res.json({ success: true, departments: mockStore.departments });
};

const createDepartment = async (req, res) => {
  const { code, name, headOfDept, description } = req.body;
  if (getIsConnected()) {
    const dept = await Department.create({ code, name, headOfDept, description });
    return res.status(201).json({ success: true, department: dept });
  }
  const newDept = { _id: 'd-' + Date.now(), code, name, headOfDept, description };
  mockStore.departments.push(newDept);
  res.status(201).json({ success: true, department: newDept });
};

const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  if (getIsConnected()) {
    await Department.findByIdAndDelete(id);
  } else {
    mockStore.departments = mockStore.departments.filter((d) => d._id !== id);
  }
  res.json({ success: true, message: 'Department deleted successfully' });
};

// Course CRUD
const getCourses = async (req, res) => {
  if (getIsConnected()) {
    const courses = await Course.find();
    return res.json({ success: true, courses });
  }
  res.json({ success: true, courses: mockStore.courses });
};

const createCourse = async (req, res) => {
  const { code, name, department, durationYears } = req.body;
  if (getIsConnected()) {
    const course = await Course.create({ code, name, department, durationYears });
    return res.status(201).json({ success: true, course });
  }
  const newCourse = { _id: 'c-' + Date.now(), code, name, department, durationYears };
  mockStore.courses.push(newCourse);
  res.status(201).json({ success: true, course: newCourse });
};

// Subject CRUD
const getSubjects = async (req, res) => {
  if (getIsConnected()) {
    const subjects = await Subject.find();
    return res.json({ success: true, subjects });
  }
  res.json({ success: true, subjects: mockStore.subjects });
};

const createSubject = async (req, res) => {
  const { code, name, department, credits, assignedFaculty } = req.body;
  if (getIsConnected()) {
    const subject = await Subject.create({ code, name, department, credits, assignedFaculty });
    return res.status(201).json({ success: true, subject });
  }
  const newSub = { _id: 's-' + Date.now(), code, name, department, credits, assignedFaculty };
  mockStore.subjects.push(newSub);
  res.status(201).json({ success: true, subject: newSub });
};

// User Management (Faculty & Students)
const getUsers = async (req, res) => {
  const { role } = req.query;
  if (getIsConnected()) {
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('-password');
    return res.json({ success: true, users });
  }
  const users = role ? mockStore.users.filter((u) => u.role === role) : mockStore.users;
  res.json({ success: true, users });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (getIsConnected()) {
    await User.findByIdAndDelete(id);
  } else {
    mockStore.users = mockStore.users.filter((u) => u._id !== id && u.id !== id);
  }
  res.json({ success: true, message: 'User deleted successfully' });
};

module.exports = {
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
};
