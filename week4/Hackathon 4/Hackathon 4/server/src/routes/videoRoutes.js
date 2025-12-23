const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { 
  getAllVideos, 
  getVideoById, 
  uploadVideo, 
  updateVideo, 
  deleteVideo, 
  getGenres 
} = require('../controllers/videoController');
const { validateVideo } = require('../utils/validations');
const authMiddleware = require('../middlewares/authMiddleware');
const { adminMiddleware } = require('../middlewares/adminMiddleware');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = file.fieldname === 'video' ? 'uploads/videos/' : 'uploads/thumbnails/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'video') {
      if (file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(new Error('Only video files allowed'), false);
      }
    } else if (file.fieldname === 'thumbnail') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files allowed'), false);
      }
    }
  },
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB limit
});

router.get('/', authMiddleware, getAllVideos);
router.get('/genres', authMiddleware, getGenres);
router.get('/:id', authMiddleware, getVideoById);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), validateVideo, uploadVideo);
router.put('/:id', authMiddleware, adminMiddleware, updateVideo);
router.delete('/:id', authMiddleware, adminMiddleware, deleteVideo);

module.exports = router;