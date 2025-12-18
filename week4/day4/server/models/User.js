const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  amount: { type: Number, required: true },
  avgPrice: { type: Number, required: true },
  totalCost: { type: Number, required: true }
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  holdings: [holdingSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);