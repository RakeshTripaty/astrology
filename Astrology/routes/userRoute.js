const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController/UserController');
//const authMiddleware = require('../middleware/authMiddleware');

// User registration route
router.post('/register', userController.registerUser);

// User login route
//router.post('/login', userController.loginUser);

// User profile route (protected with authentication middleware)
//router.get('/profile', authMiddleware, userController.getUserProfile);

module.exports = router;
