// src/middlewares/upload.js - UPDATED VERSION
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

console.log('=== UPLOAD MIDDLEWARE LOADING ===');
console.log('CLOUDINARY_CLOUD_NAME from env:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY from env:', process.env.CLOUDINARY_API_KEY ? 'SET (hidden)' : 'MISSING');
console.log('CLOUDINARY_API_SECRET from env:', process.env.CLOUDINARY_API_SECRET ? 'SET (hidden)' : 'MISSING');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Verify configuration
const config = cloudinary.config();
console.log('Cloudinary actual config:');
console.log('- cloud_name:', config.cloud_name);
console.log('- api_key configured:', !!config.api_key);
console.log('- api_secret configured:', !!config.api_secret);
console.log('=============================');

// Memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only image files allowed'), false);
    }
    cb(null, true);
  }
});

// Simple upload function
const uploadToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    console.log('Uploading to Cloudinary...');
    console.log('Cloud config check:', {
      cloud: cloudinary.config().cloud_name,
      hasKey: !!cloudinary.config().api_key,
      hasSecret: !!cloudinary.config().api_secret
    });

    cloudinary.uploader.upload_stream(
      {
        folder: 'saffron-products',
        transformation: [{ width: 800, height: 800, crop: 'limit' }]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('✅ Cloudinary upload success!');
          console.log('URL:', result.secure_url);
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

// Helper functions for Cloudinary operations
const cloudinaryHelpers = {
  uploadImage: uploadToCloudinary,
  
  deleteImage: async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log('Image deleted:', publicId, result.result);
      return result;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  },
  
  getPublicIdFromUrl: (url) => {
    try {
      if (!url || typeof url !== 'string') return null;
      const matches = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)$/i);
      return matches ? matches[1] : null;
    } catch (error) {
      return null;
    }
  }
};

// Single image upload middleware
const uploadSingleImage = upload.single('image');

module.exports = {
  upload,
  uploadSingleImage,
  uploadToCloudinary,
  cloudinaryHelpers
};