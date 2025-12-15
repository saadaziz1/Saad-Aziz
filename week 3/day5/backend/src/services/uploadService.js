// services/uploadService.js
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log('📋 Cloudinary config in uploadService:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
  api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING'
});

class UploadService {
  // Single image upload for product featured image
  async processProductImages(buffer) {
    try {
      console.log('📤 Processing single product image...');
      const result = await this.uploadToCloudinary(buffer);
      console.log('✅ Image uploaded successfully:', result.secure_url);
      return result;
    } catch (error) {
      console.error('❌ Image upload failed:', error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  // Upload to Cloudinary (direct method)
  async uploadToCloudinary(buffer) {
    return new Promise((resolve, reject) => {
      console.log('📤 Uploading to Cloudinary via service...');
      
      cloudinary.uploader.upload_stream(
        {
          folder: 'saffron-products',
          transformation: [{ width: 800, height: 800, crop: 'limit' }]
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('✅ Cloudinary upload success:', result.secure_url);
            resolve(result);
          }
        }
      ).end(buffer);
    });
  }

  // Delete image from Cloudinary
  async deleteFromCloudinary(imageUrl) {
    try {
      if (!imageUrl || imageUrl.includes('unsplash.com') || imageUrl.includes('placeholder')) {
        return false;
      }

      const publicId = this.getPublicIdFromUrl(imageUrl);
      if (publicId) {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('🗑️ Image deleted from Cloudinary:', publicId);
        return result.result === 'ok';
      }
      return false;
    } catch (error) {
      console.error('❌ Error deleting image:', error);
      throw error;
    }
  }

  // Extract public ID from Cloudinary URL
  getPublicIdFromUrl(url) {
    try {
      if (!url || typeof url !== 'string') return null;
      
      // Extract public ID from Cloudinary URL
      const matches = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)$/i);
      return matches ? matches[1] : null;
    } catch (error) {
      console.error('Error extracting public ID:', error);
      return null;
    }
  }

  generateSKU(productName, variantName) {
    const productCode = productName.substring(0, 3).toUpperCase().replace(/\s/g, '');
    const variantCode = variantName.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `${productCode}-${variantCode}-${timestamp}`;
  }
}

module.exports = new UploadService();