const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    credits: { type: Number, default: 3 },
    assignedFaculty: { type: String, default: 'Unassigned' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Subject || mongoose.model('Subject', subjectSchema);
