const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    headOfDept: { type: String, default: 'Unassigned' },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Department || mongoose.model('Department', departmentSchema);
