const TmdbMovie = require('../models/TmdbMovie');
const { sendSuccess, sendError } = require('../utils/response');

// Add TMDb movie to website
const addTmdbMovie = async (req, res) => {
  try {
    const { tmdbId, title, overview, posterPath, backdropPath, releaseDate, voteAverage, genres, mediaType } = req.body;
    
    // Check if movie already exists
    const existingMovie = await TmdbMovie.findOne({ tmdbId });
    if (existingMovie) {
      return sendError(res, 400, 'Movie already added to website');
    }

    const tmdbMovie = new TmdbMovie({
      tmdbId,
      title,
      overview,
      posterPath,
      backdropPath,
      releaseDate,
      voteAverage,
      genres,
      mediaType,
      addedBy: req.user.id
    });

    await tmdbMovie.save();
    sendSuccess(res, 'Movie added to website successfully', tmdbMovie);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// Get all active TMDb movies
const getActiveTmdbMovies = async (req, res) => {
  try {
    const movies = await TmdbMovie.find({ isActive: true }).sort({ createdAt: -1 });
    sendSuccess(res, 'Movies fetched successfully', movies);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// Get all TMDb movies (admin only)
const getAllTmdbMovies = async (req, res) => {
  try {
    const movies = await TmdbMovie.find().populate('addedBy', 'name email').sort({ createdAt: -1 });
    sendSuccess(res, 'All movies fetched successfully', movies);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// Remove TMDb movie from website
const removeTmdbMovie = async (req, res) => {
  try {
    const { id } = req.params;
    
    const movie = await TmdbMovie.findById(id);
    if (!movie) {
      return sendError(res, 404, 'Movie not found');
    }

    await TmdbMovie.findByIdAndDelete(id);
    sendSuccess(res, 'Movie removed from website successfully');
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// Toggle movie status
const toggleTmdbMovieStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const movie = await TmdbMovie.findById(id);
    if (!movie) {
      return sendError(res, 404, 'Movie not found');
    }

    movie.isActive = !movie.isActive;
    await movie.save();
    
    sendSuccess(res, `Movie ${movie.isActive ? 'activated' : 'deactivated'} successfully`, movie);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

module.exports = {
  addTmdbMovie,
  getActiveTmdbMovies,
  getAllTmdbMovies,
  removeTmdbMovie,
  toggleTmdbMovieStatus
};