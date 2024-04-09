const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'fullName is Required']
    },
    stack: {
        type: String,
        required: [true, 'stack is Required']
    },
    cohort: {
        type: String,
        required: [true, 'cohort is Required']
    },
    email: {
        type: String,
        required: [true, 'Email is Required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is Required']
    },
    token: {
        type: String
    },
    profilePicture:{
        type:String,
        required: [true, 'Picture is Required']
    },
    publicId: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    islogin: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
}, {timestamps: true});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel