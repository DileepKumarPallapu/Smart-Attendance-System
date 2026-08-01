const Attendance = require('../models/Attendance');
const mockStore = require('../utils/mockStore');
const { getIsConnected } = require('../config/db');

// @desc    Get Attendance Logs with Search & Filters
// @route   GET /api/attendance/logs
// @access  Private
const getAttendanceLogs = async (req, res) => {
  try {
    const { studentName, rollNumber, department, subjectCode, className, status, startDate, endDate } = req.query;

    if (getIsConnected()) {
      let query = {};

      if (studentName) query.studentName = { $regex: studentName, $options: 'i' };
      if (rollNumber) query.rollNumber = { $regex: rollNumber, $options: 'i' };
      if (department) query.department = department;
      if (subjectCode) query.subjectCode = subjectCode;
      if (className) query.className = className;
      if (status) query.status = status;
      if (startDate && endDate) query.date = { $gte: startDate, $lte: endDate };

      const logs = await Attendance.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: logs.length, logs });
    } else {
      let logs = [...mockStore.attendance];

      if (studentName) {
        logs = logs.filter((l) => l.studentName.toLowerCase().includes(studentName.toLowerCase()));
      }
      if (rollNumber) {
        logs = logs.filter((l) => l.rollNumber.toLowerCase().includes(rollNumber.toLowerCase()));
      }
      if (department) {
        logs = logs.filter((l) => l.department === department);
      }
      if (subjectCode) {
        logs = logs.filter((l) => l.subjectCode === subjectCode);
      }
      if (className) {
        logs = logs.filter((l) => l.className === className);
      }
      if (status) {
        logs = logs.filter((l) => l.status === status);
      }
      if (startDate && endDate) {
        logs = logs.filter((l) => l.date >= startDate && l.date <= endDate);
      }

      return res.json({ success: true, count: logs.length, logs });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Manual Attendance Override (Faculty/Admin update status)
// @route   PUT /api/attendance/override/:id
// @access  Private (Faculty/Admin)
const overrideAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Present', 'Absent', 'Late'

    if (!['Present', 'Absent', 'Late'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    if (getIsConnected()) {
      const record = await Attendance.findByIdAndUpdate(id, { status, markedVia: 'Manual' }, { new: true });
      if (!record) return res.status(404).json({ success: false, message: 'Attendance record not found' });
      return res.json({ success: true, record });
    } else {
      const record = mockStore.attendance.find((a) => a._id === id);
      if (!record) return res.status(404).json({ success: false, message: 'Attendance record not found' });
      record.status = status;
      record.markedVia = 'Manual';
      return res.json({ success: true, record });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark Manual Attendance Batch (Faculty marks entire class present/absent)
// @route   POST /api/attendance/mark-batch
// @access  Private (Faculty)
const markBatchAttendance = async (req, res) => {
  try {
    const { className, subjectCode, subjectName, studentRecords } = req.body; // [{ studentId, studentName, rollNumber, status }]
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const createdRecords = [];

    for (const item of studentRecords) {
      const record = {
        _id: 'att-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        studentId: item.studentId,
        studentName: item.studentName,
        rollNumber: item.rollNumber,
        facultyId: req.user._id || req.user.id,
        facultyName: req.user.name,
        subjectCode: subjectCode || 'CS401',
        subjectName: subjectName || 'Data Structures',
        className: className || 'CSE-4A',
        department: req.user.department || 'Computer Science & Engineering',
        date: dateStr,
        time: timeStr,
        status: item.status || 'Present',
        markedVia: 'Manual',
        createdAt: now.toISOString(),
      };

      if (getIsConnected()) {
        await Attendance.create(record);
      } else {
        mockStore.attendance.unshift(record);
      }
      createdRecords.push(record);
    }

    res.status(201).json({
      success: true,
      message: `Successfully recorded attendance for ${createdRecords.length} students.`,
      records: createdRecords,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAttendanceLogs, overrideAttendance, markBatchAttendance };
