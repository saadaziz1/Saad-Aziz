const Video = require('../models/Video');
const { sendError, sendSuccess } = require('../utils/response');
const { validationResult } = require('express-validator');

const getAllVideos = async (req, res) => {
  try {
    const { genre, search } = req.query;
    let query = { isVisible: true };

    if (genre) {
      query.genre = genre;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const videos = await Video.find(query).populate('uploadedBy', 'name');
    sendSuccess(res, 'Videos retrieved successfully', videos);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id).populate('uploadedBy', 'name');
    
    if (!video || !video.isVisible) {
      return sendError(res, 404, 'Video not found');
    }

    // Check if user has access to premium content
    if (video.isPremium && (!req.user.subscription.isActive || new Date() > req.user.subscription.endDate)) {
      return sendError(res, 403, 'Premium subscription required');
    }

    sendSuccess(res, 'Video retrieved successfully', video);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const uploadVideo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, errors.array()[0].msg);
    }

    if (!req.files || !req.files.video || !req.files.thumbnail) {
      return sendError(res, 400, 'Video and thumbnail files are required');
    }

    const { title, description, genre, releaseYear, duration, isPremium } = req.body;

    const video = new Video({
      title,
      description,
      genre,
      releaseYear: parseInt(releaseYear),
      duration: parseInt(duration),
      thumbnail: `/uploads/thumbnails/${req.files.thumbnail[0].filename}`,
      videoUrl: `/uploads/videos/${req.files.video[0].filename}`,
      isPremium: isPremium === 'true',
      uploadedBy: req.user.id
    });

    await video.save();
    sendSuccess(res, 'Video uploaded successfully', video);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!video) {
      return sendError(res, 404, 'Video not found');
    }

    sendSuccess(res, 'Video updated successfully', video);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    
    if (!video) {
      return sendError(res, 404, 'Video not found');
    }

    // Soft delete - just hide the video
    video.isVisible = false;
    await video.save();

    sendSuccess(res, 'Video deleted successfully');
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const getGenres = async (req, res) => {
  try {
    const genres = await Video.distinct('genre', { isVisible: true });
    sendSuccess(res, 'Genres retrieved successfully', genres);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

module.exports = { 
  getAllVideos, 
  getVideoById, 
  uploadVideo, 
  updateVideo, 
  deleteVideo, 
  getGenres 
};