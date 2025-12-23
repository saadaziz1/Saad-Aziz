const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const tmdbController = require('../controllers/tmdbController');

// Public routes
router.get('/active', tmdbController.getActiveTmdbMovies);

// Admin routes
router.post('/add', authMiddleware, adminMiddleware, tmdbController.addTmdbMovie);
router.get('/all', authMiddleware, adminMiddleware, tmdbController.getAllTmdbMovies);
router.delete('/:id', authMiddleware, adminMiddleware, tmdbController.removeTmdbMovie);
router.patch('/:id/toggle', authMiddleware, adminMiddleware, tmdbController.toggleTmdbMovieStatus);

module.exports = router;