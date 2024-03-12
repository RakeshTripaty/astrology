const Astrologer = require('..//astrologerControllers/astrologer');

// Controller for users to get all astrologers
exports.getAllAstrologers = async (req, res) => {
    try {
        const astrologers = await Astrologer.find();
        res.status(200).json(astrologers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};