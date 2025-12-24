const { z } = require('zod');

const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().min(1, 'Variant ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1')
});

const updateCartItemSchema = z.object({
  quantity: z.number().min(0, 'Quantity cannot be negative')
});

module.exports = { addToCartSchema, updateCartItemSchema };