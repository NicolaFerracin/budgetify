const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const budgetSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please provide a name for your new budget!'
    },
    description: {
        type: String,
        trim: true
    },
    amount: {
        type: Number,
        required: 'Please provide an amount for the budget!'
    },
    wallets: {
        type: [{
            type: mongoose.Schema.ObjectId,
            ref: 'Wallet',
        }]
    },
    created: {
        type: Date,
        default: Date.now()
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'A budget must have an owner'
    }
}, 
{
    toJson: { virtuals: true },
    toObject: { virtuals: true }
});

function autopopulate(next) {
    this.populate('wallets');
    next();
};

budgetSchema.pre('find', autopopulate);
budgetSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Budget', budgetSchema);