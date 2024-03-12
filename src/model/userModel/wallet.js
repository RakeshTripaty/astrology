// const mongoose = require('mongoose');

// const transactionSchema = new mongoose.Schema({
//   amount: { type: Number, required: true },
//   description: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const walletSchema = new mongoose.Schema({
//   userId: { type: String, required: true, unique: true },
//   balance: { type: Number, default: 0 },
//   userRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assuming you have a 'User' model
//   transactions: [transactionSchema],
// });


const mongoose = require('mongoose');

// Transaction schema
const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Wallet schema
const walletSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  userRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  transactions: [transactionSchema],
});

// Coupon schema
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
});

// Models
const Wallet = mongoose.model('Wallet', walletSchema);
const Coupon = mongoose.model('Coupon', couponSchema);



module.exports = { Wallet, Coupon };



