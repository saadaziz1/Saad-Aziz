const cartRepository = require('../repositories/cartRepository');
const productRepository = require('../repositories/productRepository');
const variantService = require('./variantService');
const ApiError = require('../utils/apiError');

const cartService = {
  async addToCart(userId, productId, variantId, qty) {
    await variantService.validateVariantSelection(productId, variantId, qty);
    
    const product = await productRepository.findById(productId);
    const variant = product.variants.id(variantId);
    const priceAtAddTime = product.basePrice + variant.priceDiff;

    const item = {
      productId,
      variantId,
      quantity: qty,
      priceAtAddTime
    };

    return await cartRepository.upsertCartItem(userId, item);
  },

  async updateCartItem(userId, itemId, qty) {
    if (qty <= 0) {
      return await cartRepository.removeItem(userId, itemId);
    }
    
    // Validate stock before updating
    const cart = await cartRepository.getCartByUserId(userId);
    if (!cart) throw new ApiError(404, 'Cart not found');
    
    const item = cart.items.id(itemId);
    if (!item) throw new ApiError(404, 'Cart item not found');
    
    await variantService.validateVariantSelection(item.productId, item.variantId, qty);
    
    return await cartRepository.updateItemQuantity(userId, itemId, qty);
  },

  async removeCartItem(userId, itemId) {
    return await cartRepository.removeItem(userId, itemId);
  },

  async getCart(userId) {
    const cart = await cartRepository.getCartByUserId(userId);
    if (!cart) return { items: [], subTotal: 0, totalItems: 0 };

    const subTotal = cart.items.reduce((sum, item) => sum + (item.priceAtAddTime * item.quantity), 0);
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items: cart.items,
      subTotal,
      totalItems
    };
  }
};

module.exports = cartService;