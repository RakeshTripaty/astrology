// callModel.js
const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other'],
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  timeOfBirth: {
    type: String,
    required: true,
  },
  placeOfBirth: {
    type: String,
    required: true,
  },
  selectedDate: {
    type: String,
    required: true,
  },
  selectedSlot: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Call = mongoose.model('Call', callSchema);

module.exports = Call;
