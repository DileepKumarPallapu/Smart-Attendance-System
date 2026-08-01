const QRCode = require('qrcode');
const crypto = require('crypto');
const QRSession = require('../models/QRSession');
const Attendance = require('../models/Attendance');
const Notification = require('../models/Notification');
const mockStore = require('../utils/mockStore');
const { getIsConnected } = require('../config/db');

// @desc    Start/Generate QR Session
// @route   POST /api/qr/start-session
// @access  Private (Faculty)
const startQRSession = async (req, res) => {
  try {
    const { subjectCode, subjectName, className, department, validitySeconds } = req.body;
    const validity = parseInt(validitySeconds) || 60; // Default 60 seconds

    const sessionId = 'SESS-' + Date.now();
    const token = crypto.randomBytes(16).toString('hex');
    const validFrom = new Date();
    const validUntil = new Date(Date.now() + validity * 1000);

    const payload = JSON.stringify({
      sessionId,
      token,
      subjectCode,
      className,
      validUntil: validUntil.toISOString(),
    });

    // Generate Base64 Data URL QR Code
    const qrDataUrl = await QRCode.toDataURL(payload);

    const sessionObj = {
      sessionId,
      facultyId: req.user._id || req.user.id,
      facultyName: req.user.name,
      subjectCode: subjectCode || 'CS401',
      subjectName: subjectName || 'Data Structures & Algorithms',
      className: className || 'CSE-4A',
      department: department || req.user.department || 'Computer Science & Engineering',
      token,
      validFrom,
      validUntil,
      validitySeconds: validity,
      status: 'ACTIVE',
      scannedStudents: [],
      qrDataUrl,
      payload,
    };

    if (getIsConnected()) {
      await QRSession.create(sessionObj);
    } else {
      mockStore.qrSessions.unshift(sessionObj);
    }

    // Add activity log
    mockStore.activityLogs.unshift({
      _id: 'act-' + Date.now(),
      userName: req.user.name,
      userRole: 'faculty',
      action: 'Created QR Session',
      details: `${subjectCode} (${className}) valid for ${validity}s`,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: 'QR Session started successfully',
      session: sessionObj,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Active QR Session Status (Polling for live faculty monitor)
// @route   GET /api/qr/session/:sessionId
// @access  Private (Faculty)
const getSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    let session;

    if (getIsConnected()) {
      session = await QRSession.findOne({ sessionId });
    } else {
      session = mockStore.qrSessions.find((s) => s.sessionId === sessionId);
    }

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const isExpired = new Date() > new Date(session.validUntil);
    if (isExpired && session.status === 'ACTIVE') {
      session.status = 'EXPIRED';
    }

    res.json({
      success: true,
      session,
      isExpired,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Scan QR Token and Mark Attendance
// @route   POST /api/qr/scan
// @access  Private (Student)
const scanQRCode = async (req, res) => {
  try {
    const { qrPayload } = req.body;
    let parsed;

    try {
      parsed = typeof qrPayload === 'string' ? JSON.parse(qrPayload) : qrPayload;
    } catch (e) {
      return res.status(400).json({ success: false, message: 'Invalid QR Code format' });
    }

    const { sessionId, token } = parsed;

    if (!sessionId || !token) {
      return res.status(400).json({ success: false, message: 'Invalid QR Code payload structure' });
    }

    let session;
    if (getIsConnected()) {
      session = await QRSession.findOne({ sessionId });
    } else {
      session = mockStore.qrSessions.find((s) => s.sessionId === sessionId);
    }

    if (!session) {
      return res.status(404).json({ success: false, message: 'QR Code session not found or closed' });
    }

    // Check expiration
    if (new Date() > new Date(session.validUntil) || session.status === 'EXPIRED') {
      return res.status(400).json({ success: false, message: 'QR Code has expired! Please ask faculty to refresh.' });
    }

    // Check token match
    if (session.token !== token) {
      return res.status(400).json({ success: false, message: 'Invalid security token for this QR session' });
    }

    const studentRoll = req.user.rollNumber || '2026-CSE-001';
    const studentName = req.user.name;
    const studentId = req.user._id || req.user.id;

    // Check duplicate scan
    if (session.scannedStudents.includes(studentRoll)) {
      return res.status(400).json({
        success: false,
        message: `Attendance already marked for student ${studentName} (${studentRoll}) in this session.`,
      });
    }

    // Mark as scanned
    session.scannedStudents.push(studentRoll);

    // Save attendance log
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const attendanceRecord = {
      _id: 'att-' + Date.now(),
      studentId,
      studentName,
      rollNumber: studentRoll,
      facultyId: session.facultyId,
      facultyName: session.facultyName,
      subjectCode: session.subjectCode,
      subjectName: session.subjectName,
      className: session.className,
      department: session.department,
      date: dateStr,
      time: timeStr,
      status: 'Present',
      markedVia: 'QR',
      sessionId: session.sessionId,
      createdAt: now.toISOString(),
    };

    if (getIsConnected()) {
      await Attendance.create(attendanceRecord);
      await session.save();
    } else {
      mockStore.attendance.unshift(attendanceRecord);
    }

    // Push notification to student
    mockStore.notifications.unshift({
      _id: 'n-' + Date.now(),
      recipientId: studentId,
      recipientRole: 'student',
      title: 'Attendance Confirmed ✓',
      message: `Your attendance for ${session.subjectCode} (${session.subjectName}) has been recorded.`,
      type: 'success',
      isRead: false,
      createdAt: now.toISOString(),
    });

    res.json({
      success: true,
      message: `Success! Attendance marked for ${session.subjectName}`,
      attendance: attendanceRecord,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    End QR Session manually
// @route   POST /api/qr/end-session/:sessionId
// @access  Private (Faculty)
const endQRSession = async (req, res) => {
  const { sessionId } = req.params;
  let session;

  if (getIsConnected()) {
    session = await QRSession.findOneAndUpdate({ sessionId }, { status: 'CLOSED' }, { new: true });
  } else {
    session = mockStore.qrSessions.find((s) => s.sessionId === sessionId);
    if (session) session.status = 'CLOSED';
  }

  res.json({ success: true, message: 'QR Session closed successfully', session });
};

module.exports = { startQRSession, getSessionStatus, scanQRCode, endQRSession };
