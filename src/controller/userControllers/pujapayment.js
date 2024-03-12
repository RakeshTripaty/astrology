// controllers/paymentsController.js
// const mongoose = require('mongoose');
// const Payment = require('../../model/userModel/puja payment');
// const Booking = require('../../model/userModel/BookPooja');

// // Create a new payment and reference the corresponding booking
// exports.createPayment = async (req, res) => {
//   try {
//     const { acharya, amount, poojaDetails, paymentMethod, bookingId } = req.body;

//     // Ensure that the provided bookingId is a valid ObjectId
//     if (!mongoose.isValidObjectId(bookingId)) {
//       return res.status(400).json({ error: 'Invalid bookingId' });
//     }

//     // Check if the booking exists
//     const existingBooking = await Booking.findById(bookingId);
//     if (!existingBooking) {
//       return res.status(404).json({ error: 'Booking not found' });
//     }

//     // Calculate GST
//     const gstPercentage = 18;
//     const gstAmount = (amount * gstPercentage) / 100;

//     // Calculate total payable amount
//     const totalPayableAmount = amount + gstAmount;

//     const newPayment = new Payment({
//       acharya,
//       amount,
//       poojaDetails,
//       paymentMethod,
//       booking: bookingId,
//       gstAmount,
//       totalPayableAmount,
//     });

//     await newPayment.save();
//     res.status(201).json(newPayment);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };



const Payment = require('../../model/userModel/puja payment');
const Wallet = require('../../model/userModel//wallet');

// Create a new payment
exports.createPayment = async (req, res) => {
  const { user, wallet, amount, totalPayableAmount } = req.body;

  try {
    // Check if the user has enough balance in their wallet
    const userWallet = await Wallet.findOne({ userRef: user });
    if (userWallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance in wallet' });
    }

    // Deduct the payment amount from the user's wallet
    userWallet.balance -= amount;
    await userWallet.save();

    // Create a new payment
    const payment = new Payment(req.body);
    await payment.save();

    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};