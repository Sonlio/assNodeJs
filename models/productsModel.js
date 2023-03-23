const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Products = new Schema({
    nameProduct: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    isbn: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    averageScore: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('products', Products);