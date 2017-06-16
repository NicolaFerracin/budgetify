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
    recurrent: {
        type: Boolean,
        default: false
    },
    shouldCount: {
        type: Boolean,
        default: true
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
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);