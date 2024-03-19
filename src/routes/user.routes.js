const express = require('express');
const router = express.Router();
const userController = require('../controller/userControllers/userController');
const blogController = require('../controller/userControllers/Blog');
const bookingsController = require('../controller/userControllers/BookPuja');
const callController = require('../controller/userControllers/CallIntakeForm');
const { createKundliBoysGirls } = require('../controller/userControllers/kundalimatch');
const { getMonthlyHoroscope } = require('../controller/userControllers/monthlyHoroscope');
const { dailyHoroscope } = require('../controller/userControllers/dailyhoroscope');
const { getDailyPanchang } = require('../controller/userControllers/dailypanchang'); 
const { generateKundli } = require('../controller/userControllers/free kundali'); 
const paymentsController = require('../controller/userControllers/pujapayment');
const walletController = require('../controller/userControllers/wallet');
const consoulting= require('../controller/userControllers/consoulting acharya')

const { check } = require('express-validator');
const  authenticateToken = require('../middleware/auth');

// User registration route
router.post('/registerUser', userController.registerUser); 

router.get('/getusers', userController.getAllUsers);

router.get('/users/:id', userController.getUserById);
// Update a user by ID
router.put('/users/:id', userController.updateUser);

// Delete a user by ID
router.delete('/users/:id', userController.deleteUser);
// User login route
router.post('/login', userController.loginUserWithOTP);

//router.post('/reset-password-request', userController.resetPasswordRequest);

//router.post('/reset-password/:token',  userController.resetPassword);


//-----------------------------------------------BLOG-----------------------------------------------------//

// Get all blog posts
router.get('/blog-posts', blogController.getAllBlogPosts);

// Get a specific blog post by ID
router.get('/blog-posts/:id', blogController.getBlogPostById);

// Add a new blog post
router.post('/blog-posts', blogController.addBlogPost);

// Update a specific blog post by ID
router.put('/blog-posts/:id', blogController.updateBlogPost);
// Search blog posts by title
//router.get('/blogs/:searchByTitle', blogController.getBlogPostByTitle);


//-----------------------------------------------Book Puja-----------------------------------------------//
// Route to get all bookings
router.get('/bookings', bookingsController.getAllBookings);

// Route to get bookings for a specific month
router.get('/bookings/:month', bookingsController.getBookingsByMonth);

// Route to search bookings by puja
router.get('/bookings/search/:pujaname', bookingsController.searchBookingsByPuja);

// Route to search bookings by acharya name
router.get('/bookings/searchByAcharya/:Name', bookingsController.searchBookingsByAcharya);

// Route to book a new puja
router.post('/bookings', bookingsController.bookNewPuja);

// Route to create a new payment
router.post('/payments', paymentsController.createPayment );

//---------------------------------------------Callintake--------------------------------------------------//
// Route to get call intake data by user ID
//router.get('/call/:userId', callController.getCallIntakeByUserId);
// Route to create call intake data
router.post('/call', callController.createCall );

//-------------------------------------------Kundalimatch--------------------------------------------------//
// Define your routes
router.post('/create-kundli', createKundliBoysGirls);

//----------------------------------------------------Daily Horoscope-------------------------------------//
router.get('/dailyHoroscope', dailyHoroscope);
// Define the route for fetching monthly horoscope
router.get('/horoscope', getMonthlyHoroscope);

router.get('/getDailyPanchang', getDailyPanchang);


// Define the route for generating Kundli
router.post('/generate-kundli', generateKundli);



// -------------------------------------Wallet------------------------------------------------------//
// Middleware to check if the user's wallet balance is greater than 0
const checkWalletBalance = async (req, res, next) => {
    try {
      const wallet = await Wallet.findOne({ userId: req.params.userId });
  
      // Check if the wallet balance is greater than 0
      if (wallet.balance > 0) {
        next(); // Allow access to the route
      } else {
        res.status(403).json({ message: 'Wallet balance is 0. Recharge to access this feature.' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
router.get('/:userId', walletController.getWalletBalance);
router.post('/recharge/:userId', walletController.rechargeAndProcessPayment);
router.post('/update-balance/:userId', walletController.updateWalletBalance);
// Route to access a feature, requires sufficient wallet balance
router.get('/user/:userId/access-feature', walletController.accessFeature);



// Route to get all astrologers for users
router.get('/astrologers', consoulting.getAllAstrologers);

module.exports = router;