const express = require('express');
const router = express.Router();
const astrologerController = require('../controller/astrologerControllers/astrologer');
const {
    createWalletTransaction,
    getAllWalletTransactions,
    getDailyIncomeForAstrologer
} = require('../controller/astrologerControllers/wallet');
const loginHoursController = require('../controller/astrologerControllers/loginhour');

// Routes for Astrologer
router.post('/create', astrologerController.createOrLoginAstrologer);

// Get all astrologers with follower details
router.get('/getastrologers',astrologerController.getAllAstrologers );

// Get astrologer by name
router.get('/astrologers/:name', astrologerController.getAstrologerByName);
// Route for users to follow an astrologer
router.post('/astrologers/:astrologerId', astrologerController.followAstrologer);

// Connect a user to an astrologer using the request body
router.post('/connect',astrologerController.connectUserToAstrologer);

// User login
router.post('/log', astrologerController.login);

router.post('/logout',astrologerController.logout);


//----------------------------------------------------Wallet---------------------------------------------------//
// Route to create a new wallet transaction
router.post('/wallet_transactions', createWalletTransaction);

// Route to get all wallet transactions
router.get('/wallet_transaction/:id', getAllWalletTransactions);

// Route to get daily income for an astrologer
router.get('/astrologers/:astrologerId/income/:date', getDailyIncomeForAstrologer);





// POST route to insert login hours
router.post('/insert', loginHoursController.insertLoginHours);

// GET route to get total active hours for each astrologer
router.get('/totalActiveHours', loginHoursController.getTotalActiveHours);

// GET route to get summary of login hours for each astrologer
router.get('/summary', loginHoursController.getSummaryLoginHours);

module.exports = router;



module.exports = router;
