const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cardNumber: { type: String, required: true }, // encrypted
  expiryDate: { type: String, required: true }, // encrypted
  cvv: { type: String, required: true }, // encrypted
  cardHolderName: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);