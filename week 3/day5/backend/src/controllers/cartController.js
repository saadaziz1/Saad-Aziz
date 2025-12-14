const asyncHandler = require('express-async-handler');
const cartService = require('../services/cartService');

const cartController = {
  addToCart: asyncHandler(async (req, res) => {
    const { productId, variantId, quantity } = req.body;
    await cartService.addToCart(req.user.id, productId, variantId, quantity);
    const cart = await cartService.getCart(req.user.id);
    res.status(200).json({ success: true, cart });
  }),

  getCart: asyncHandler(async (req, res) => {
    const cart = await cartService.getCart(req.user.id);
    res.status(200).json({ success: true, cart });
  }),

  updateItem: asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    await cartService.updateCartItem(req.user.id, req.params.itemId, quantity);
    const cart = await cartService.getCart(req.user.id);
    res.status(200).json({ success: true, cart });
  }),

  removeItem: asyncHandler(async (req, res) => {
    await cartService.removeCartItem(req.user.id, req.params.itemId);
    const cart = await cartService.getCart(req.user.id);
    res.status(200).json({ success: true, cart });
  })
};

module.exports = cartController;