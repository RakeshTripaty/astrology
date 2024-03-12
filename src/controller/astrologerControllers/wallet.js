const mongoose = require('mongoose');
const WalletTransaction = require('../../model/astrologerModel/astrowallet');



// Controller function to create a new wallet transaction
const createWalletTransaction = async (req, res) => {
    try {
        // Extract required fields from the request body
        const { astrologerId, amount } = req.body;

        // Create a new wallet transaction document
        const newTransaction = new WalletTransaction({
            astrologerId: astrologerId,
            amount: amount
        });

        // Save the new transaction to the database
        const savedTransaction = await newTransaction.save();

        // Send a success response
        res.status(201).json(savedTransaction);
    } catch (error) {
        // Handle errors
        console.error('Error creating wallet transaction:', error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
};

// Controller function to get all wallet transactions
const getAllWalletTransactions = async (req, res) => {
    const astrologerId = req.params.astrologerId; 
    try {
        // Retrieve wallet transactions for the specified astrologer ID
        const transactions = await WalletTransaction.find({ astrologerId });

        // Send the transactions as a response
        res.json(transactions);
    } catch (error) {
        // Handle errors
        console.error('Error fetching wallet transactions:', error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
};

const getDailyIncomeForAstrologer = async (req, res) => {
    try {
        const astrologerId = req.params.astrologerId;
        const date = new Date(req.params.date);

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const transactions = await WalletTransaction.find({
            astrologerId: astrologerId,
            timestamp: { $gte: startOfDay, $lte: endOfDay }
        });

        let totalIncome = 0;
        transactions.forEach(transaction => {
            totalIncome += transaction.amount;
        });

        res.json({ astrologerId: astrologerId, date: date.toISOString().split('T')[0], income: totalIncome });
    } catch (error) {
        console.error('Error fetching daily income:', error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
};



// Export the controller functions for use in routes or other modules
module.exports = {
    createWalletTransaction,
    getAllWalletTransactions,
    getDailyIncomeForAstrologer
};
