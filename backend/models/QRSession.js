const mongoose = require('mongoose');

const qrSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    facultyId: { type: String, required: true },
    facultyName: { type: String, required: true },
    subjectCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    className: { type: String, required: true },
    department: { type: String, required: true },
    token: { type: String, required: true },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, required: true },
    validitySeconds: { type: Number, default: 60 },
    status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'CLOSED'], default: 'ACTIVE' },
    scannedStudents: [{ type: String }], // Roll numbers or Student IDs
  },
  { timestamps: true }
);

module.exports = mongoose.models.QRSession || mongoose.model('QRSession', qrSessionSchema);
