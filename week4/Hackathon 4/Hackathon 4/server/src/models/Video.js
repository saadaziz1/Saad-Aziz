const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  duration: { type: Number, required: true }, // in minutes
  thumbnail: { type: String, required: true },
  videoUrl: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  isVisible: { type: Boolean, default: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);