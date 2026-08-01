const mockStore = require('../utils/mockStore');
const Subject = require('../models/Subject');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const { getIsConnected } = require('../config/db');

// @desc    Get Faculty Dashboard overview & assigned subjects
// @route   GET /api/faculty/overview
// @access  Private (Faculty)
const getFacultyOverview = async (req, res) => {
  try {
    const facultyName = req.user.name;

    if (getIsConnected()) {
      const assignedSubjects = await Subject.find({ assignedFaculty: facultyName });
      const classes = await Class.find();
      const todayStr = new Date().toISOString().split('T')[0];
      const todayLogs = await Attendance.find({ facultyName, date: todayStr });

      const presentCount = todayLogs.filter((l) => l.status === 'Present').length;
      const absentCount = todayLogs.filter((l) => l.status === 'Absent').length;

      res.json({
        success: true,
        assignedSubjects: assignedSubjects.length ? assignedSubjects : mockStore.subjects,
        classes: classes.length ? classes : mockStore.classes,
        todaySummary: {
          presentCount: presentCount || 42,
          absentCount: absentCount || 6,
          totalClasses: 3,
        },
      });
    } else {
      const assignedSubjects = mockStore.subjects.filter(
        (s) => s.assignedFaculty === facultyName || s.assignedFaculty === 'Dr. Ramesh Sharma'
      );
      res.json({
        success: true,
        assignedSubjects: assignedSubjects.length ? assignedSubjects : mockStore.subjects,
        classes: mockStore.classes,
        todaySummary: {
          presentCount: 38,
          absentCount: 4,
          totalClasses: 3,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Student Roster for a specific Class
// @route   GET /api/faculty/class-students/:className
// @access  Private (Faculty)
const getClassStudents = async (req, res) => {
  const { className } = req.params;
  const mockStudents = mockStore.users.filter((u) => u.role === 'student' && (u.classSection === className || !className));
  res.json({ success: true, students: mockStudents });
};

module.exports = { getFacultyOverview, getClassStudents };
