const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. CSE-4A, ECE-3B
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    academicYear: { type: String, default: '2026' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Class || mongoose.model('Class', classSchema);
