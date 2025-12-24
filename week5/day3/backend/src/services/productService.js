// services/productService.js
const productRepository = require('../repositories/productRepository');
const uploadService = require('./uploadService');
const ApiError = require('../utils/apiError');

const productService = {
  async createProduct(payload, file, adminUser) {
    try {
      console.log('=== PRODUCT CREATION START ===');
      console.log('Payload received:', {
        name: payload.name,
        hasFile: !!file,
        fileSize: file?.buffer?.length || 0
      });

      // Generate slug
      if (!payload.slug && payload.name) {
        payload.slug = payload.name
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '');
      }

      // Set created by
      payload.createdBy = adminUser._id;

      // Parse variants if it's a string
      if (payload.variants && typeof payload.variants === 'string') {
        try {
          payload.variants = JSON.parse(payload.variants);
        } catch (e) {
          throw new ApiError(400, 'Invalid variants JSON: ' + e.message);
        }
      }

      // Image processing debug
      console.log('🔍 Image processing check:');
      console.log('  file exists:', !!file);
      console.log('  file.buffer exists:', !!(file && file.buffer));
      if (file) {
        console.log('  file details:', {
          fieldname: file.fieldname,
          originalname: file.originalname,
          size: file.size,
          bufferLength: file.buffer ? file.buffer.length : 0
        });
      }
      
      if (file && file.buffer) {
        console.log('📤 Uploading to Cloudinary...');
        try {
          const uploadResult = await uploadService.processProductImages(file.buffer);
          payload.featuredImage = uploadResult.secure_url;
          console.log('✅ Upload success:', payload.featuredImage);
        } catch (uploadError) {
          console.error('❌ Upload failed:', uploadError.message);
          payload.featuredImage = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=800&fit=crop';
        }
      } else {
        console.log('⚠️ No file/buffer, using default');
        payload.featuredImage = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=800&fit=crop';
      }

      // Handle variants - set to empty array if no variants
      if (payload.variants && Array.isArray(payload.variants) && payload.variants.length > 0) {
        const usedSKUs = new Set();
        
        payload.variants = payload.variants
          .filter(v => v && v.name && v.name.trim() !== '')
          .map((variant, index) => {
            let sku = variant.sku;
            if (!sku || sku.trim() === '') {
              // Generate unique SKU
              const productCode = (payload.name || 'PRO').substring(0, 3).toUpperCase().replace(/\s/g, '');
              const variantCode = (variant.name || 'VAR').substring(0, 3).toUpperCase().replace(/\s/g, '');
              const timestamp = Date.now().toString().slice(-6);
              sku = `${productCode}-${variantCode}-${timestamp}${index}`;
              
              // Ensure uniqueness
              let counter = 0;
              while (usedSKUs.has(sku) && counter < 100) {
                sku = `${productCode}-${variantCode}-${timestamp}${index}-${counter}`;
                counter++;
              }
              usedSKUs.add(sku);
            }
            
            return {
              ...variant,
              name: variant.name.trim(),
              sku: sku.trim(),
              priceDiff: parseFloat(variant.priceDiff) || 0,
              stock: Math.max(0, parseInt(variant.stock) || 0),
              isActive: variant.isActive !== undefined ? variant.isActive : true
            };
          });
      } else {
        // No variants, set to empty array
        payload.variants = [];
      }

      console.log('Final product data:', {
        name: payload.name,
        slug: payload.slug,
        hasImage: !!payload.featuredImage,
        variantsCount: payload.variants?.length || 0
      });

      const product = await productRepository.createProduct(payload);
      console.log('=== PRODUCT CREATION COMPLETE ===');
      console.log('✅ Product ID:', product._id);
      
      return product;
    } catch (error) {
      console.error('❌ PRODUCT CREATION FAILED:', error);
      throw new ApiError(400, `Failed to create product: ${error.message}`);
    }
  },

  async updateProduct(id, payload, file) {
    try {
      console.log('=== PRODUCT UPDATE START ===');
      console.log('Update payload:', {
        id,
        name: payload.name,
        hasFile: !!file,
        fileSize: file?.buffer?.length || 0
      });

      const existingProduct = await productRepository.findById(id);
      if (!existingProduct) {
        throw new ApiError(404, 'Product not found');
      }

      // Parse variants if it's a string
      if (payload.variants && typeof payload.variants === 'string') {
        try {
          payload.variants = JSON.parse(payload.variants);
        } catch (e) {
          throw new ApiError(400, 'Invalid variants JSON: ' + e.message);
        }
      }

      // Handle file upload if provided
      if (file && file.buffer) {
        console.log('📤 New image file provided, uploading...');
        
        try {
          // Delete old image if exists and not default
          if (existingProduct.featuredImage && 
              !existingProduct.featuredImage.includes('unsplash.com')) {
            try {
              await uploadService.deleteFromCloudinary(existingProduct.featuredImage);
              console.log('🗑️ Deleted old image from storage');
            } catch (deleteError) {
              console.warn('⚠️ Could not delete old image:', deleteError.message);
            }
          }
          
          // Upload new image
          const uploadResult = await uploadService.processProductImages(file.buffer);
          payload.featuredImage = uploadResult.secure_url;
          console.log('✅ New image uploaded:', payload.featuredImage);
          
        } catch (uploadError) {
          console.error('❌ Image upload failed:', uploadError.message);
          // Don't throw error, just use existing image
          console.log('⚠️ Keeping existing image due to upload failure');
          payload.featuredImage = existingProduct.featuredImage;
        }
      } else if (payload.removeImage === 'true' || payload.removeImage === true) {
        // Handle image removal if requested
        console.log('🗑️ Removing product image as requested');
        payload.featuredImage = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=800&fit=crop';
        
        // Delete from storage if not default
        if (existingProduct.featuredImage && 
            !existingProduct.featuredImage.includes('unsplash.com')) {
          try {
            await uploadService.deleteFromCloudinary(existingProduct.featuredImage);
          } catch (deleteError) {
            console.warn('⚠️ Could not delete old image:', deleteError.message);
          }
        }
      } else {
        // Keep existing image if no new file and no removal request
        console.log('📭 No new image provided, keeping existing image');
        payload.featuredImage = existingProduct.featuredImage;
      }

      // Handle tags parsing if it's a string
      if (payload.tags && typeof payload.tags === 'string') {
        try {
          payload.tags = JSON.parse(payload.tags);
        } catch (e) {
          // If parsing fails, treat as comma-separated string
          payload.tags = payload.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
      }

      // Handle variants
      if (payload.variants !== undefined) {
        if (Array.isArray(payload.variants) && payload.variants.length > 0) {
          const usedSKUs = new Set();
          
          payload.variants = payload.variants
            .filter(v => v && v.name && v.name.trim() !== '')
            .map((variant, index) => {
              let sku = variant.sku;
              if (!sku || sku.trim() === '') {
                // Generate unique SKU
                const productCode = (payload.name || existingProduct.name || 'PRO').substring(0, 3).toUpperCase().replace(/\s/g, '');
                const variantCode = (variant.name || 'VAR').substring(0, 3).toUpperCase().replace(/\s/g, '');
                const timestamp = Date.now().toString().slice(-6);
                sku = `${productCode}-${variantCode}-${timestamp}${index}`;
                
                // Ensure uniqueness
                let counter = 0;
                while (usedSKUs.has(sku) && counter < 100) {
                  sku = `${productCode}-${variantCode}-${timestamp}${index}-${counter}`;
                  counter++;
                }
                usedSKUs.add(sku);
              }
              
              return {
                ...variant,
                name: variant.name.trim(),
                sku: sku.trim(),
                priceDiff: parseFloat(variant.priceDiff) || 0,
                stock: Math.max(0, parseInt(variant.stock) || 0),
                isActive: variant.isActive !== undefined ? variant.isActive : true
              };
            });
        } else {
          // Empty array or falsy
          payload.variants = [];
        }
      } else {
        // variants is undefined - don't change the existing variants
        delete payload.variants;
      }

      console.log('Final update payload:', {
        name: payload.name,
        hasImage: !!payload.featuredImage,
        variantsCount: payload.variants?.length || 0
      });

      const updatedProduct = await productRepository.updateById(id, payload);
      console.log('=== PRODUCT UPDATE COMPLETE ===');
      
      return updatedProduct;
    } catch (error) {
      console.error('❌ PRODUCT UPDATE FAILED:', error);
      // Handle duplicate key error specifically
      if (error.code === 11000 || error.message.includes('duplicate key')) {
        throw new ApiError(400, 'Duplicate SKU detected. SKUs must be unique across all variants.');
      }
      throw new ApiError(400, `Failed to update product: ${error.message}`);
    }
  },

  async deleteProduct(id) {
    try {
      console.log('=== PRODUCT DELETE START ===');
      
      const product = await productRepository.findById(id);
      if (!product) {
        throw new ApiError(404, 'Product not found');
      }

      // Delete image from storage if not default
      if (product.featuredImage && !product.featuredImage.includes('unsplash.com')) {
        try {
          await uploadService.deleteFromCloudinary(product.featuredImage);
          console.log('🗑️ Deleted product image from storage');
        } catch (deleteError) {
          console.warn('⚠️ Could not delete product image:', deleteError.message);
        }
      }

      const result = await productRepository.deleteById(id);
      console.log('=== PRODUCT DELETE COMPLETE ===');
      
      return result;
    } catch (error) {
      console.error('❌ PRODUCT DELETE FAILED:', error);
      throw new ApiError(400, `Failed to delete product: ${error.message}`);
    }
  },

  async getProductDetails(id) {
    try {
      const product = await productRepository.findById(id);
      if (!product) throw new ApiError(404, 'Product not found');
      return product;
    } catch (error) {
      console.error('❌ GET PRODUCT DETAILS FAILED:', error);
      throw new ApiError(400, `Failed to get product details: ${error.message}`);
    }
  },

  async searchProducts(queryParams) {
    try {
      console.log('🔍 Search products called with params:', queryParams);
      const { 
        page = 1, 
        limit = 12, 
        category, 
        minPrice, 
        maxPrice, 
        sort = 'createdAt', 
        search,
        tags,
        minRating,
        organic
      } = queryParams;
      
      const filterObj = {};
      
      // Category filter (collections)
      if (category) {
        console.log('📂 Category filter:', category);
        if (Array.isArray(category)) {
          filterObj.category = { $in: category };
        } else {
          filterObj.category = category;
        }
        console.log('📂 Category filterObj:', filterObj.category);
      }
      
      // Tags filter (flavors, qualities, allergens, etc.)
      if (tags) {
        console.log('🏷️ Tags filter:', tags);
        const tagArray = Array.isArray(tags) ? tags : [tags];
        filterObj.tags = { $in: tagArray };
        console.log('🏷️ Tags filterObj:', filterObj.tags);
      }
      
      // Price range filter
      if (minPrice || maxPrice) {
        filterObj.basePrice = {};
        if (minPrice) filterObj.basePrice.$gte = Number(minPrice);
        if (maxPrice) filterObj.basePrice.$lte = Number(maxPrice);
      }
      
      // Rating filter
      if (minRating) {
        filterObj.rating = { $gte: Number(minRating) };
      }
      
      // Organic filter (check if 'organic' tag exists)
      if (organic === 'true' || organic === true) {
        if (filterObj.tags && filterObj.tags.$in) {
          filterObj.tags.$in.push('organic');
        } else if (filterObj.tags) {
          const existingTags = Array.isArray(filterObj.tags) ? filterObj.tags : [filterObj.tags];
          filterObj.tags = { $in: [...existingTags, 'organic'] };
        } else {
          filterObj.tags = { $in: ['organic'] };
        }
      }
      
      // Search filter
      if (search) {
        filterObj.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }

      // Sort options
      const sortObj = {};
      switch (sort) {
        case 'price_asc': 
        case 'price-low':
          sortObj.basePrice = 1; 
          break;
        case 'price_desc': 
        case 'price-high':
          sortObj.basePrice = -1; 
          break;
        case 'rating': 
          sortObj.rating = -1; 
          break;
        case 'name':
          sortObj.name = 1;
          break;
        default: 
          sortObj.createdAt = -1;
      }

      console.log('🔍 Final filterObj:', filterObj);
      console.log('📊 Final sortObj:', sortObj);
      
      const skip = (page - 1) * limit;
      const { products, totalCount } = await productRepository.searchAndFilter(filterObj, sortObj, skip, Number(limit));
      
      console.log('📦 Found products:', products.length, 'Total:', totalCount);
      
      const totalPages = Math.ceil(totalCount / limit);
      
      return {
        products,
        totalProducts: totalCount,
        totalPages,
        currentPage: Number(page)
      };
    } catch (error) {
      console.error('❌ SEARCH PRODUCTS FAILED:', error);
      throw new ApiError(400, `Failed to search products: ${error.message}`);
    }
  }
};

module.exports = productService;