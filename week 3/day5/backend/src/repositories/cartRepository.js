const Cart = require('../models/cart.model');

const cartRepository = {
  async getCartByUserId(userId) {
    return await Cart.findOne({ userId }).populate('items.productId');
  },

  async upsertCartItem(userId, item) {
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return await Cart.create({ userId, items: [item] });
    }

    const existingItemIndex = cart.items.findIndex(
      cartItem => cartItem.productId.toString() === item.productId.toString() && 
                  cartItem.variantId.toString() === item.variantId.toString()
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += item.quantity;
      cart.items[existingItemIndex].priceAtAddTime = item.priceAtAddTime;
    } else {
      cart.items.push(item);
    }

    return await cart.save();
  },

  async updateItemQuantity(userId, itemId, qty) {
    return await Cart.findOneAndUpdate(
      { userId, 'items._id': itemId },
      { $set: { 'items.$.quantity': qty } },
      { new: true }
    );
  },

  async removeItem(userId, itemId) {
    return await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    );
  },

  async clearCart(userId) {
    return await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true }
    );
  }
};

module.exports = cartRepository;