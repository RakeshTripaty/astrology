const express = require('express');
const router = express.Router();
const userController = require('../controller/userControllers/userController');
const { check } = require('express-validator');
const  authenticateToken = require('../middleware/auth');

// User registration route
router.post('/register', userController.registerUser); 

router.get('/getusers', userController.getAllUsers);

router.get('/users/:id', userController.getUserById);
// Update a user by ID
router.put('/users/:id', userController.updateUser);

// Delete a user by ID
router.delete('/users/:id', userController.deleteUser);
// User login route
router.post('/login', userController.loginUserWithOTP);

router.post('/reset-password-request', userController.resetPasswordRequest);

router.post('/reset-password/:token',  userController.resetPassword);
module.exports = router;