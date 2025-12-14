import Product from '../models/Product.js';
import { getPagination, getPaginationData } from '../utils/pagination.js';

export const productService = {
  async getProducts(query) {
    const { page, limit, category, minPrice, maxPrice, rating, flavor, sort, order, search } = query;
    const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

    // Build filter object
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (rating) filter.rating = { $gte: parseFloat(rating) };
    if (flavor) filter.flavor = new RegExp(flavor, 'i');
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sortObj = {};
    if (sort) {
      const sortOrder = order === 'desc' ? -1 : 1;
      sortObj[sort] = sortOrder;
    } else {
      sortObj.createdAt = -1;
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .populate('variants'),
      Product.countDocuments(filter)
    ]);

    const pagination = getPaginationData(total, pageNum, limitNum);
    
    return { products, pagination };
  },

  async getProductById(id) {
    const product = await Product.findById(id).populate('variants');
    if (!product || !product.isActive) {
      throw new Error('Product not found');
    }
    return product;
  },

  async createProduct(productData) {
    return await Product.create(productData);
  },

  async updateProduct(id, updateData) {
    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },

  async deleteProduct(id) {
    const product = await Product.findByIdAndUpdate(id, { isActive: false });
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },

  async checkStock(productId, variantId, quantity) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    let availableStock;
    if (variantId) {
      const variant = product.variants.id(variantId);
      if (!variant) {
        throw new Error('Variant not found');
      }
      availableStock = variant.stock;
    } else {
      availableStock = product.stock;
    }

    return availableStock >= quantity;
  }
};