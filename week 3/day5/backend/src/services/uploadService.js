// services/uploadService.js
const { cloudinaryHelpers } = require('../middlewares/upload');

class UploadService {
  async processProductImages(files, existingProduct = null) {
    const images = {
      featuredImage: existingProduct?.featuredImage || '',
      images: existingProduct?.images || [],
      variantImages: {}
    };

    try {
      // Handle featured image
      if (files.featuredImage && files.featuredImage[0] && files.featuredImage[0].buffer) {
        console.log('Processing featured image...');
        
        // Delete old featured image if exists
        if (existingProduct?.featuredImage) {
          try {
            const oldPublicId = cloudinaryHelpers.getPublicIdFromUrl(existingProduct.featuredImage);
            if (oldPublicId) {
              await cloudinaryHelpers.deleteImage(oldPublicId);
            }
          } catch (deleteError) {
            console.warn('Could not delete old featured image:', deleteError.message);
          }
        }
        
        // Upload new featured image
        try {
          const result = await cloudinaryHelpers.uploadImage(files.featuredImage[0].buffer);
          images.featuredImage = result.secure_url;
          console.log('Featured image uploaded:', images.featuredImage);
        } catch (uploadError) {
          console.error('Featured image upload failed:', uploadError.message);
          // Use placeholder if upload fails
          images.featuredImage = 'https://via.placeholder.com/600x400';
        }
      } else if (!images.featuredImage) {
        // Default placeholder if no image
        images.featuredImage = 'https://via.placeholder.com/600x400';
      }

      // Handle gallery images
      if (files.images && files.images.length > 0) {
        console.log(`Processing ${files.images.length} gallery images...`);
        
        for (const file of files.images) {
          if (file.buffer) {
            try {
              const result = await cloudinaryHelpers.uploadImage(file.buffer);
              images.images.push(result.secure_url);
            } catch (uploadError) {
              console.error('Gallery image upload failed:', uploadError.message);
              images.images.push('https://via.placeholder.com/400x300');
            }
          }
        }
        
        // Keep existing images
        if (existingProduct?.images) {
          images.images = [...existingProduct.images, ...images.images];
        }
      } else if (images.images.length === 0) {
        // Default gallery image
        images.images = ['https://via.placeholder.com/400x300'];
      }

      // Handle variant images
      if (files.variantImages) {
        const variantKeys = Object.keys(files.variantImages);
        console.log(`Processing ${variantKeys.length} variant images...`);
        
        for (const variantKey of variantKeys) {
          const fileArray = files.variantImages[variantKey];
          if (fileArray && fileArray[0] && fileArray[0].buffer) {
            try {
              const result = await cloudinaryHelpers.uploadImage(fileArray[0].buffer);
              images.variantImages[variantKey] = result.secure_url;
            } catch (uploadError) {
              console.error(`Variant image ${variantKey} upload failed:`, uploadError.message);
              images.variantImages[variantKey] = 'https://via.placeholder.com/300x200';
            }
          }
        }
      }

      return images;
    } catch (error) {
      console.error('Image processing error:', error);
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }

  async deleteProductImages(product) {
    try {
      // Delete featured image
      if (product.featuredImage) {
        const publicId = cloudinaryHelpers.getPublicIdFromUrl(product.featuredImage);
        if (publicId) {
          await cloudinaryHelpers.deleteImage(publicId);
        }
      }

      // Delete gallery images
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          const publicId = cloudinaryHelpers.getPublicIdFromUrl(imageUrl);
          if (publicId) {
            await cloudinaryHelpers.deleteImage(publicId);
          }
        }
      }

      // Delete variant images
      if (product.variants && product.variants.length > 0) {
        for (const variant of product.variants) {
          if (variant.image) {
            const publicId = cloudinaryHelpers.getPublicIdFromUrl(variant.image);
            if (publicId) {
              await cloudinaryHelpers.deleteImage(publicId);
            }
          }
          if (variant.additionalImages && variant.additionalImages.length > 0) {
            for (const imageUrl of variant.additionalImages) {
              const publicId = cloudinaryHelpers.getPublicIdFromUrl(imageUrl);
              if (publicId) {
                await cloudinaryHelpers.deleteImage(publicId);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error deleting product images:', error);
      throw error;
    }
  }

  async deleteImageFromCloudinary(imageUrl) {
    try {
      const publicId = cloudinaryHelpers.getPublicIdFromUrl(imageUrl);
      if (publicId) {
        await cloudinaryHelpers.deleteImage(publicId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
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