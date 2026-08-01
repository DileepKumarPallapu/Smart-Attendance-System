const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    durationYears: { type: Number, default: 4 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);
