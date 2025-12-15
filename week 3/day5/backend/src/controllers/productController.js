// controllers/productController.js
const asyncHandler = require('express-async-handler');
const productService = require('../services/productService');

const productController = {
  list: asyncHandler(async (req, res) => {
    const result = await productService.searchProducts(req.query);
    res.status(200).json({ success: true, ...result });
  }),

  get: asyncHandler(async (req, res) => {
    const product = await productService.getProductDetails(req.params.id);
    res.status(200).json({ success: true, product });
  }),

  create: asyncHandler(async (req, res) => {
    console.log('\n=== CREATE PRODUCT REQUEST ===');
    console.log('📄 req.file:', req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      hasBuffer: !!req.file.buffer
    } : 'NO FILE');
    console.log('📋 req.body:', req.body);
    console.log('🔑 req.headers.authorization:', req.headers.authorization ? 'EXISTS' : 'MISSING');
    console.log('🌐 req.headers.content-type:', req.headers['content-type']);
    console.log('==============================\n');
    
    const product = await productService.createProduct(req.body, req.file, req.user);
    res.status(201).json({ success: true, product });
  }),

  update: asyncHandler(async (req, res) => {
    console.log('\n=== UPDATE PRODUCT REQUEST ===');
    console.log('📄 req.file:', req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      hasBuffer: !!req.file.buffer
    } : 'NO FILE');
    console.log('📋 req.body:', req.body);
    console.log('==============================\n');
    
    const product = await productService.updateProduct(req.params.id, req.body, req.file);
    res.status(200).json({ success: true, product });
  }),

  delete: asyncHandler(async (req, res) => {
    await productService.deleteProduct(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted' });
  }),

  // Simple image upload endpoint
  uploadImage: asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }
    
    const { cloudinaryHelpers } = require('../middlewares/upload');
    const result = await cloudinaryHelpers.uploadImage(req.file.buffer);
    
    res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
      message: 'Image uploaded successfully'
    });
  })
};

module.exports = productController;