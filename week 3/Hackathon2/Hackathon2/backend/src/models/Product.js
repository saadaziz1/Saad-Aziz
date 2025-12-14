import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  priceDiff: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['green-tea', 'black-tea', 'herbal-tea', 'oolong-tea', 'white-tea']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  flavor: {
    type: String,
    required: [true, 'Flavor is required'],
    trim: true
  },
  variants: [variantSchema],
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: 0
  },
  images: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text', flavor: 'text' });
productSchema.index({ category: 1, price: 1, rating: -1 });

export default mongoose.model('Product', productSchema);