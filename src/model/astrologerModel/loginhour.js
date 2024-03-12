const mongoose = require('mongoose');

// Define Schema
const loginHoursSchema = new mongoose.Schema({
  astrologer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Astrologer', // Reference to the Astrologer model
    required: true
  },
  fromDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
});

// Create Model
const LoginHours = mongoose.model('LoginHours', loginHoursSchema);

// Function to calculate total active hours for each astrologer
const calculateTotalActiveHours = () => {
  LoginHours.aggregate([
    {
      $group: {
        _id: '$astrologer',
        totalHours: { $sum: { $subtract: ['$endDate', '$fromDate'] } }
      }
    }
  ])
  .then(result => {
    // Process the result to associate astrologer ID with total hours
    console.log('Total Active Hours:', result);
  })
  .catch(error => {
    console.error('Error calculating total active hours:', error);
  });
};

module.exports = { LoginHours, calculateTotalActiveHours };
