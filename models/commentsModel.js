const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Comments = new Schema({
    rating: {
        type: Number,
        default: 0
    },
    content: {
        type: String,
        required: true
    },
    dateComment: {
        type: Date,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true
    }
})

module.exports = mongoose.model('comments', Comments);