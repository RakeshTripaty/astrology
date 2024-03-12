
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const astrologerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    astrologerType: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true,
    },
    bio: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
        required: true,
    },
    online: {
        type: Boolean,
        default: false,
    },
    connectedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
});

// Pre-save middleware to hash the password before saving
astrologerSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        // Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// Define virtual property outside the schema definition
astrologerSchema.virtual('followersCount', {
    ref: 'User', // Assuming 'User' is the name of your user model
    localField: '_id',
    foreignField: 'followers',
    count: true
});

//const Astrologer = mongoose.model('Astro', astrologerSchema);
const Astrologer = mongoose.model('Astrologer', astrologerSchema, 'astros');

module.exports = Astrologer;




