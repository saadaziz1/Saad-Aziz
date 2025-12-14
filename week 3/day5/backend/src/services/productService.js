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

    // Parse variants
    if (payload.variants && typeof payload.variants === 'string') {
      try {
        payload.variants = JSON.parse(payload.variants);
      } catch (e) {
        throw new ApiError(400, 'Invalid variants JSON: ' + e.message);
      }
    }

    // ========== CLOUDINARY UPLOAD ==========
    if (file && file.buffer) {
      console.log('📤 Image file detected, uploading to Cloudinary...');
      
      try {
        const { uploadToCloudinary } = require('../middlewares/upload');
        const result = await uploadToCloudinary(file.buffer);
        
        payload.featuredImage = result.secure_url;
        console.log('✅ Cloudinary URL set:', payload.featuredImage);
        
      } catch (uploadError) {
        console.error('❌ Cloudinary upload failed:', uploadError.message);
        
        // Fallback to Unsplash placeholder
        payload.featuredImage = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=800&fit=crop';
        console.log('⚠️ Using fallback image');
      }
    } else {
      console.log('📭 No image file provided');
      payload.featuredImage = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=800&fit=crop';
    }
    // ========== END CLOUDINARY UPLOAD ==========

    // Generate SKUs for variants
    if (payload.variants && Array.isArray(payload.variants)) {
      payload.variants = payload.variants.map((variant, index) => ({
        ...variant,
        sku: variant.sku || this.generateSKU(payload.name, variant.name, index)
      }));
    }

    console.log('Final product data:', {
      name: payload.name,
      slug: payload.slug,
      image: payload.featuredImage.substring(0, 100) + '...'
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

  // Helper function
  generateSKU(productName, variantName, index) {
    const productCode = (productName || 'PRO').substring(0, 3).toUpperCase().replace(/\s/g, '');
    const variantCode = (variantName || 'VAR').replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const unique = Date.now().toString().slice(-3) + index;
    return `${productCode}-${variantCode}-${unique}`;
  },


  async updateProduct(id, payload, file) {
    try {
      const existingProduct = await productRepository.findById(id);
      if (!existingProduct) {
        throw new ApiError(404, 'Product not found');
      }

      return await productRepository.updateById(id, payload);
    } catch (error) {
      throw new ApiError(400, `Failed to update product: ${error.message}`);
    }
  },

  async deleteProduct(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    return await productRepository.deleteById(id);
  },

  async getProductDetails(id) {
    const product = await productRepository.findById(id);
    if (!product) throw new ApiError(404, 'Product not found');
    return product;
  },

  
  async searchProducts(queryParams) {
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
      if (Array.isArray(category)) {
        filterObj.category = { $in: category };
      } else {
        filterObj.category = category;
      }
    }
    
    // Tags filter (flavors, qualities, allergens, etc.)
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filterObj.tags = { $in: tagArray };
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
        // If tags is already set as a single value, convert to array
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

    const skip = (page - 1) * limit;
    const { products, totalCount } = await productRepository.searchAndFilter(filterObj, sortObj, skip, Number(limit));
    
    const totalPages = Math.ceil(totalCount / limit);
    
    return {
      products,
      totalProducts: totalCount,
      totalPages,
      currentPage: Number(page)
    };
  }
};

module.exports = productService;