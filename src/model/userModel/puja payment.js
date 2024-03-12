// // models/Payment.js
// const mongoose = require('mongoose');

// const paymentSchema = new mongoose.Schema({
//   acharya: {
//     type: String,
//     required: true,
//   },
//   amount: {
//     type: Number,
//     required: true,
//   },
//   poojaDetails: {
//     type: String,
//     required: true,
//   },
//   paymentMethod: {
//     type: String,
//     enum: ['UPI', 'CREDIT/DEBIT CARD', 'NET BANKING', 'PAYTM', 'OTHER WALLETS'],
//     required: true,
//   },
//   booking: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Booking',
//     required: true,
//   },
//   gstAmount: {
//     type: Number,
//     required: true,
//   },
//   totalPayableAmount: {
//     type: Number,
//     required: true,
//   },
// }, {
//   timestamps: true,
// });

// const Payment = mongoose.model('Payment', paymentSchema);

// module.exports = Payment;

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  acharya: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  poojaDetails: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'CREDIT/DEBIT CARD', 'NET BANKING', 'PAYTM', 'OTHER WALLETS'],
    required: true,
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  gstAmount: {
    type: Number,
    required: true,
  },
  totalPayableAmount: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
  },
}, {
  timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
