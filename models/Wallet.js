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
        trim: true,
        default: ''
    },
    created: {
        type: Date,
        default: Date.now()
    },
    shouldCount: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'A wallet must have an owner'
    }
}, {
    toJson: { virtuals: true },
    toObject: { virtuals: true }
});

walletSchema.virtual('transactions', {
    ref: 'Transaction',
    localField: '_id',
    foreignField: 'wallet'
});

function autopopulate(next) {
    this.populate('transactions');
    next();
};

walletSchema.pre('find', autopopulate);
walletSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Wallet', walletSchema);