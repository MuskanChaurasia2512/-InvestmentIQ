const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  stockSymbol: { type: String, required: true },
  sector: { type: String, required: true },
  quantity: { type: Number, required: true },
  buyPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  transactionDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
