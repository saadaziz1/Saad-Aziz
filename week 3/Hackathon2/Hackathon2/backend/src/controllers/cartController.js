import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate('items.product', 'name price images variants')
      .populate('items.variant');
    
    if (!cart) {
      return res.json({ items: [], totalPrice: 0 });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    let price = product.price;
    let variant = null;
    
    if (variantId) {
      variant = product.variants.id(variantId);
      if (!variant) {
        return res.status(404).json({ message: 'Variant not found' });
      }
      if (variant.stock < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      price = product.price + variant.priceDiff;
    } else if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }
    
    const existingItemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId && 
      (!variantId || item.variant?.toString() === variantId)
    );
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        variant: variantId || null,
        quantity,
        price
      });
    }
    
    cart.calculateTotal();
    await cart.save();
    
    await cart.populate('items.product', 'name price images variants');
    await cart.populate('items.variant');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
    
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    const product = await Product.findById(item.product);
    const availableStock = item.variant ? 
      product.variants.id(item.variant).stock : 
      product.stock;
    
    if (quantity > availableStock) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    item.quantity = quantity;
    cart.calculateTotal();
    await cart.save();
    
    await cart.populate('items.product', 'name price images variants');
    await cart.populate('items.variant');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items.pull(itemId);
    cart.calculateTotal();
    await cart.save();
    
    await cart.populate('items.product', 'name price images variants');
    await cart.populate('items.variant');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.json({ items: [], totalPrice: 0 });
    }
    
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};