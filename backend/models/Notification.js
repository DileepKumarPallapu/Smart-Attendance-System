const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientId: { type: String, required: true }, // User ID or 'ALL'
    recipientRole: { type: String, enum: ['admin', 'faculty', 'student', 'all'], default: 'all' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'warning', 'success'], default: 'info' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
