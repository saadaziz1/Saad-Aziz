const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 2, maxlength: 50 },
  description: { type: String, required: true, maxlength: 500 },
  techStack: { type: [String], required: true },
  status: { type: String, enum: ['active','completed'], default: 'active' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
