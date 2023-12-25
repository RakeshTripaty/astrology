const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const otpGen = require("otp-generator");
const dotenv = require('dotenv');
dotenv.config();
const sid = process.env.TWILIO_SID;
const auth_token = process.env.TWILIO_AUTH_TOKEN;
const twilio = require('twilio')(sid, auth_token);
const User = require('../../model/userModel/userModel');

// Joi schema for user registration
const userRegistrationSchema = Joi.object({
  name: Joi.string().required(),
  phone_number: Joi.string().pattern(/^[0-9]{10}$/).required(),
  place_of_birth: Joi.string().required(),
  date_of_birth: Joi.date().iso().required(),
  time_of_birth: Joi.string().required(),
  password: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/).required(),
});

// Controller for user registration
exports.registerUser = async (req, res) => {
  try {
    // Validate the request body
    const { error } = userRegistrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      name,
      phone_number,
      place_of_birth,
      date_of_birth,
      time_of_birth,
      password,
    } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ phone_number });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new User({
      name,
      phone_number,
      place_of_birth,
      date_of_birth,
      time_of_birth,
      password: hashedPassword, // Save the hashed password
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//-------------------------------------------------Get User---------------------------------------------------//

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//-------------------------------------------------user Update--------------------------------------------//
exports.updateUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//-------------------------------------------------Delete User----------------------------------------//

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};



//------------------------- Login controller with OTP sending and JWT token creation--------------------------//
async function saveOTP(user, otp) {
  user.otp = otp;
  await user.save();
}



// exports.loginUserWithOTP = async (req, res) => {
//   const { phone_number } = req.body;

//   try {
//     // Check if the user exists
//     const user = await User.findOne({ phone_number });
//     if (!user) {
//       return res.status(400).json({ message: 'Phone number not found' });
//     }

//     // Ensure the phone number includes the country code
//     const formattedPhoneNumber = `+91${phone_number}`;

//     // Generate and send OTP
//     const otp = otpGen.generate(6, {
//       digits: true,
//       upperCaseAlphabets: false,
//       lowerCaseAlphabets: false,
//       specialChars: false,
//     });

//     twilio.messages
//       .create({
//         from: '+12015811009',
//         to: formattedPhoneNumber,
//         body: `Your OTP for login is: ${otp}`,
//       })
//       .then(function (twilioRes) {
//         console.log('OTP sent successfully!');
//         res.json({ message: 'OTP sent successfully', user_id: user._id, otp });
//       })
//       .catch(function (twilioErr) {
//         console.error('Error sending OTP:', twilioErr);
//         res.status(500).json({ message: 'Failed to send OTP' });
//       });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

//------------------------------------------------loginUserWithOTP---------------------------------------//

// Function to save OTP to the user
async function saveOTP(user, otp) {
  user.otp = otp;
  await user.save();
}

exports.loginUserWithOTP = async (req, res) => {
  const { phone_number } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ phone_number });
    if (!user) {
      return res.status(400).json({ message: 'Phone number not found' });
    }

    // Ensure the phone number includes the country code
    const formattedPhoneNumber = `+91${phone_number}`;

    // Generate OTP
    const otp = otpGen.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Save OTP to user
    await saveOTP(user, otp);

    // Send OTP using Twilio
    twilio.messages
      .create({
        from: '+12015811009',
        to: formattedPhoneNumber,
        body: `Your OTP for login is: ${otp}`,
      })
      .then(async function (twilioRes) {
        console.log('OTP sent successfully!');

        // Create JWT token
        const token = jwt.sign(
          { userId: user._id, phone_number: user.phone_number },
          'your_secret_key',
          { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Send OTP and token in the response
        res.json({ message: 'OTP sent successfully', user_id: user._id, otp, token });
      })
      .catch(function (twilioErr) {
        console.error('Error sending OTP:', twilioErr);
        res.status(500).json({ message: 'Failed to send OTP' });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//--------------------------------------------------Forget Password----------------------------------------------//
exports.changeCurrentPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid old password' });
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};


//ls
exports.logout = (req, res) => {
  try {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to log out' });
      } else {
        res.json({ message: 'Logged out successfully' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


