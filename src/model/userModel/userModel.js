// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   phone_number: {
//     type: String,
//     required: true,
//   },
//   place_of_birth: {
//     type: String,
//     required: true,
//   },
//   date_of_birth: {
//     type: Date,
//     required: true,
//   },
//   time_of_birth: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   astrologer: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Astrologer',
//   },
//   admin: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Admin',
//   },

//   otp: {
//     type: String,
//   },
  
// });

// // Hashing password before saving
// userSchema.pre('save', async function (next) {
//   const user = this;
//   if (user.isModified('password') || user.isNew) {
//     const hash = await bcrypt.hash(user.password, 10);
//     user.password = hash;
//   }
//   next();
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;


const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  place_of_birth: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  time_of_birth: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  astrologer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Astrologer',
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },

  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
  },
  otp: {
    type: String,
  },
  // Add image field
  profile_image: {
    type: String, // You can use String to store the URL of the uploaded image
  },
});

// Hashing password before saving
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password') || user.isNew) {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
