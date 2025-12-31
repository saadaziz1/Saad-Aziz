const productRepository = require('../repositories/productRepository');
const ApiError = require('../utils/apiError');

const variantService = {
  async addVariant(productId, variantPayload) {
    const product = await productRepository.findById(productId);
    if (!product) throw new ApiError(404, 'Product not found');

    product.variants.push(variantPayload);
    return await product.save();
  },

  async updateVariant(productId, variantId, payload) {
    const product = await productRepository.findById(productId);
    if (!product) throw new ApiError(404, 'Product not found');

    const variant = product.variants.id(variantId);
    if (!variant) throw new ApiError(404, 'Variant not found');

    Object.assign(variant, payload);
    return await product.save();
  },

  async validateVariantSelection(productId, variantId, qty) {
    const product = await productRepository.findById(productId);
    if (!product) throw new ApiError(404, 'Product not found');

    const variant = product.variants.id(variantId);
    if (!variant) throw new ApiError(404, 'Variant not found');
    if (!variant.isActive) throw new ApiError(400, 'Variant is not active');
    if (variant.stock < qty) throw new ApiError(400, 'Insufficient stock');

    return true;
  }
};

module.exports = variantService;