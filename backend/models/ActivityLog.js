const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    userRole: { type: String, required: true },
    action: { type: String, required: true },
    details: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);
