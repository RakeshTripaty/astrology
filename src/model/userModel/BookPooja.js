const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Replace 'User' with the actual model name for your user
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  pinCode: {
    type: String,
  },
  acharya: {
    type: String,
    required: true,
  },
  pooja: {
    type: String,
    required: true,
  },
  bookingType: {
    type: String,
    enum: ['Online', 'Offline'],
    required: true,
  },
}, {
  timestamps: true,
}); 

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
