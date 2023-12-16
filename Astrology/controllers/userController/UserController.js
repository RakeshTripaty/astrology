const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../../models/userModels/userModel');

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

    // Create a new user
    const newUser = new User({
      name,
      phone_number,
      place_of_birth,
      date_of_birth,
      time_of_birth,
      password,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


