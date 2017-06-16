const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const walletSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please provide a name for your new wallet!'
    },
    description: {
        type: String,
        trim: true
    },
    currency: {
        type: String,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now()
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'A wallet must have an owner'
    }
});

module.exports = mongoose.model('Wallet', walletSchema);