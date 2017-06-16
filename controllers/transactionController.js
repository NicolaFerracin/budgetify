const mongoose = require('mongoose');
const Transaction = mongoose.model('Transaction');
const promisify = require('es6-promisify');

exports.addTransaction = async (req, res) => {
    const date = new Date(req.body.date);
    [hours, minutes] = req.body.time.split(':');
    date.setHours(hours);
    date.setMinutes(minutes);
    const transaction = {
        amount: Number(req.body.amount).toFixed(2),
        category: req.body.category,
        description: req.body.description,
        recurrent: req.body.recurrent,
        shouldCount: req.body.shouldCount,
        timestamp: date,
        location: req.body.location,
        wallet: req.body.wallet
    };
    await (new Transaction(transaction)).save();
    res.redirect('back');
};