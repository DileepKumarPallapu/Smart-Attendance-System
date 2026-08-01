const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    rollNumber: { type: String, required: true },
    facultyId: { type: String, required: true },
    facultyName: { type: String, required: true },
    subjectCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    className: { type: String, required: true },
    department: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // HH:MM AM/PM
    status: { type: String, enum: ['Present', 'Absent', 'Late'], default: 'Present' },
    markedVia: { type: String, enum: ['QR', 'Manual'], default: 'QR' },
    sessionId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
