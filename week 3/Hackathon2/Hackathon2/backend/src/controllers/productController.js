import { productService } from '../services/productService.js';
import { successResponse, paginatedResponse } from '../utils/response.js';

export const productController = {
  async getProducts(req, res, next) {
    try {
      const { products, pagination } = await productService.getProducts(req.query);
      paginatedResponse(res, products, pagination, 'Products retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getProduct(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id);
      successResponse(res, product, 'Product retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async createProduct(req, res, next) {
    try {
      const product = await productService.createProduct(req.body);
      successResponse(res, product, 'Product created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateProduct(req, res, next) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      successResponse(res, product, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteProduct(req, res, next) {
    try {
      await productService.deleteProduct(req.params.id);
      successResponse(res, null, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  async checkStock(req, res, next) {
    try {
      const { productId, variantId, quantity } = req.body;
      const isAvailable = await productService.checkStock(productId, variantId, quantity);
      successResponse(res, { available: isAvailable }, 'Stock checked successfully');
    } catch (error) {
      next(error);
    }
  }
};