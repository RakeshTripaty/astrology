
const { Wallet, Coupon } = require('../../model/userModel/wallet'); 
const User = require('../../model/userModel/userModel');

// Controller to get user's wallet balance
exports.getWalletBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.params.userId }).populate('userRef');
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller to update user's wallet balance
exports.updateWalletBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.params.userId }).populate('userRef');
    wallet.balance += req.body.amount;
    const updatedWallet = await wallet.save();
    res.json(updatedWallet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Function to generate a random alphanumeric string as a coupon code
function generateCouponCode() {
  const length = 8;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let couponCode = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    couponCode += characters.charAt(randomIndex);
  }

  return couponCode;
}

// Function to validate the coupon code (replace this with your actual coupon validation logic)
async function validateCouponCode(couponCode) {
  // Example: Check if the coupon code is valid
  const coupon = await Coupon.findOne({ code: couponCode });
  return !!coupon;
}

// Controller to recharge user's wallet and process payment
exports.rechargeAndProcessPayment = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found.');
      return res.status(404).json({ message: 'User not found.' });
    }

    // Validate the recharge amount
    const rechargeAmount = req.body.amount;
    if (!rechargeAmount || isNaN(rechargeAmount) || rechargeAmount <= 0) {
      console.log('Invalid recharge amount.');
      return res.status(400).json({ message: 'Invalid recharge amount. Please provide a positive number.' });
    }

    // Calculate GST dynamically based on the recharge amount
    const gstPercentage = 18;
    const gstAmount = (rechargeAmount * gstPercentage) / 100;

    // Calculate total amount including GST
    let totalAmount = rechargeAmount + gstAmount;

    // Generate a coupon code
    const couponCode = generateCouponCode();

    // Save the coupon code for later verification
    const coupon = new Coupon({ code: couponCode, userId: userId }); // Provide userId when creating a coupon
    await coupon.save();

    // If a coupon code is provided, validate it
    let couponDiscountAmount = 0; // Initialize the variable

    if (couponCode) {
      // Apply coupon code logic (replace this with your actual coupon code validation logic)
      const isValidCoupon = await validateCouponCode(couponCode);

      if (isValidCoupon) {
        // Assuming the coupon provides a 10% discount
        const couponDiscountPercentage = 10;
        couponDiscountAmount = (totalAmount * couponDiscountPercentage) / 100;
        totalAmount -= couponDiscountAmount;
      } else {
        console.log('Invalid coupon code.');
        return res.status(400).json({ message: 'Invalid coupon code. Please provide a valid coupon.' });
      }
    }

    // Find the wallet for the user
    let wallet = await Wallet.findOne({ userId });

    // If the wallet doesn't exist, create a new one
    if (!wallet) {
      wallet = new Wallet({ userId });
    }

    // Deduct the total amount from the user's payment source (you may use a payment gateway for this)
    // For demonstration purposes, let's assume the payment is successful.

    // Update the wallet balance with the total amount
    wallet.balance = (wallet.balance || 0) + totalAmount;

    // Create a transaction record for the recharge
    wallet.transactions.push({
      amount: totalAmount,
      description: `Recharge Amount (including GST ₹${gstAmount.toFixed(2)})`,
    });

    // Create a transaction record for the coupon discount (if applied)
    if (couponCode) {
      wallet.transactions.push({
        amount: -couponDiscountAmount,
        description: `Coupon Discount (₹${couponDiscountAmount.toFixed(2)})`,
      });
    }

    // Save the wallet
    const updatedWallet = await wallet.save();

    console.log(`Recharge successful. Your new balance is ₹ ${updatedWallet.balance}`);
    res.json({
      message: `Recharge successful. Your new balance is ₹ ${updatedWallet.balance}`,
    });
  } catch (err) {
    console.error(err);
    console.log('Internal Server Error.');
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ------------------------Controller to access a feature, requires sufficient wallet balance-------------------//
// Controller to access a feature, requires sufficient wallet balance
exports.accessFeature = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user's wallet
    const wallet = await Wallet.findOne({ userId });

    // Check if the user's wallet exists
    if (!wallet) {
      console.log('Wallet not found for the user.');
      return res.status(404).json({ message: 'Wallet not found for the user.' });
    }

    // Specify the minimum balance required to access the feature
    const minimumBalanceForFeature = 50; // Set your minimum balance required for the feature

    // Check if the user has sufficient balance
    if (wallet.balance >= minimumBalanceForFeature) {
      console.log('User has sufficient balance. Accessing the feature. 😊');
      // Implement your feature logic here
      return res.json({ message: 'Congratulations! Feature accessed successfully. 😊' });
    } else {
      console.log('Insufficient balance. You cannot access the feature. ☹️');
      return res.status(403).json({
        message: `Insufficient balance. Please recharge your wallet to access the feature. Your current balance is ₹${wallet.balance} ☹️`,
      });
    }
  } catch (err) {
    console.error(err);
    console.log('Internal Server Error.');
    res.status(500).json({ message: 'Internal Server Error' });
  }
};




