const mongoose = require('mongoose');

const tmdbMovieSchema = new mongoose.Schema({
  tmdbId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  overview: String,
  posterPath: String,
  backdropPath: String,
  releaseDate: String,
  voteAverage: Number,
  genres: [String],
  mediaType: {
    type: String,
    enum: ['movie', 'tv'],
    required: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TmdbMovie', tmdbMovieSchema);