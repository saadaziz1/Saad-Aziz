const Product = require('../models/product.model');

const productRepository = {
  async createProduct(payload) {
    return await Product.create(payload);
  },

  async findById(id) {
    return await Product.findById(id);
  },

  async findBySlug(slug) {
    return await Product.findOne({ slug });
  },

  async updateById(id, payload) {
    return await Product.findByIdAndUpdate(id, payload, { new: true });
  },

  async deleteById(id) {
    return await Product.findByIdAndDelete(id);
  },

  async searchAndFilter(filterObj, sortObj = {}, skip = 0, limit = 12) {
    const products = await Product.find(filterObj)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);
    
    const totalCount = await Product.countDocuments(filterObj);
    
    return { products, totalCount };
  }
};

module.exports = productRepository;