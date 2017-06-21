const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    facebook: {
        id: String,
        token: String
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid email address'],
        require: 'Please supply an email address for the registration'
    },
    name: {
        type: String,
        required: 'Please supply a name for the registration',
        trim: true
    },
    categories: {
        type: [String],
        default: [
            'Award',
            'Debt',
            'Debt Collection',
            'Electronics',
            'Entertainment',
            'Family',
            'Fees & Charges',
            'Food & Beverage',
            'Footwear',
            'Friends & Lover',
            'Funeral',
            'Games',
            'Gas',
            'Gifts',
            'Donations',
            'Health & Fitness',
            'Home Improvement',
            'Home Services',
            'Insurances',
            'Interest Money',
            'Internet',
            'Investment',
            'Loan',
            'Lunch',
            'Maintenance',
            'Marriage',
            'Movies',
            'Others',
            'Parking Fees',
            'Pension',
            'Personal Care',
            'Petrol',
            'Pets',
            'Pharmacy',
            'Phone',
            'Rentals',
            'Repayment',
            'Restaurants',
            'Salary',
            'Selling',
            'Shopping',
            'Sports',
            'Taxi',
            'Television',
            'Transportation',
            'Travel',
            'Water',
            'Withdrawal']
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, {
        toJson: { virtuals: true },
        toObject: { virtuals: true }
    });

userSchema.virtual('wallets', {
    ref: 'Wallet',
    localField: '_id',
    foreignField: 'owner'
});

function autopopulate(next) {
    this.populate('wallets');
    next();
};

userSchema.pre('find', autopopulate);
userSchema.pre('findOne', autopopulate);

userSchema.virtual('gravatar').get(function () {
    const hash = md5(this.email);
    return `https://gravatar.com/avatar/${hash}?s=200`;
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);