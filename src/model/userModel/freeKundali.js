// models/Kundli.js

const mongoose = require('mongoose');

const kundliSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  birthPlace: {
    type: String,
    required: true,
  },
  astroDetails: {
    planetPositions: {
      // You can define the structure based on Prokerala's response
    },
    // Add more astrological details if needed
  },
});

const Kundli = mongoose.model('Kundli', kundliSchema);

module.exports = Kundli;
