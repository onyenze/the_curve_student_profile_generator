const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    cohort: {
        type: String,
        required: [true, 'Cohort is Required']
    },
    email: [{
        type: String,
        required: [true, 'Email is Required'],
        unique: true
    }],
}, {timestamps: true});

const emailModel = mongoose.model('Email', emailSchema);
module.exports = emailModel