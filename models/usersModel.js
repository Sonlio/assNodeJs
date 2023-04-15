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
    address: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    typeUser: {
        type: Number,
    },
    codeResetPassword: {
        type: Number,
        default: null
    }
})

module.exports = mongoose.model('users', Users);