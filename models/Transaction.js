const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: 'Please provide an amount for the transaction!'
    },
    category: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    shouldCount: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [{
            type: Number,
        }],
        address: {
            type: String,
        }
    },
    wallet: {
        type: mongoose.Schema.ObjectId,
        ref: 'Wallet',
        required: 'A transaction must be linked to a wallet'
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'A transaction must be linked to a user'
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);