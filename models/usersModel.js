const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Users = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    address: {
        type: String,
        required: true
    },

    typeUser: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('users', Users);