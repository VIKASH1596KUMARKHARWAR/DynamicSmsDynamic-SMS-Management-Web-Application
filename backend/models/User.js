const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensures no two users have the same username
    },
    password: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true, // Ensures no two users have the same mobile number
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no two users have the same email
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
