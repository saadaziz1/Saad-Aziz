const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  skills: { type: [String], required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Member', MemberSchema);
