const mongoose = require('mongoose');
const Transaction = mongoose.model('Transaction');
const promisify = require('es6-promisify');

exports.addTransaction = async (req, res) => {
    const transaction = prepareTransactionForDb(req.body, req.user._id);
    await (new Transaction(transaction)).save();
    res.redirect('back');
};

exports.getTransaction = async (req, res) => {
    const transaction = await Transaction
        .findOne({ _id: req.params.id, owner: req.user._id });
    res.json(transaction);
};

exports.editTransaction = async (req, res) => {
    const transaction = prepareTransactionForDb(req.body, req.user._id);
    await Transaction.findOneAndUpdate(
        { _id: req.params.id },
        { $set: transaction }
    );
    res.redirect('back');
};

exports.deleteTransaction = async (req, res) => {
    await Transaction.remove(
        { _id: req.params.id }
    );
    res.sendStatus(200);
};

exports.getTotalPerMonth = async (userId, walletId) => {
    const total = await Transaction.aggregate([
        { 
            $match: {
                owner: userId,
                wallet: walletId
            }
        }, 
        {
            $group: {
                _id: {
                    year: { $year: '$timestamp' },
                    month: { $month: '$timestamp' },
                    day: { $dayOfMonth: '$timestamp' }  
                },
                transactions: { $push: '$$ROOT' },
                amountDay: { $sum: '$amount' } 
            }
        },
        {
            $group: {
                _id: {
                    year : '$_id.year',
                    month : '$_id.month',
                },
                amount : {
                    $sum : '$amountDay'
                }
            }
        },
        {
            $project: {
                date: {
                    year: '$_id.year',
                    month:'$_id.month',
                },
                amount: true,
                _id: 0
            }
        },
        {
            $sort: { date: -1 }
        }
    ]);
    return total;
}

function prepareTransactionForDb(raw, userId) {
    const date = new Date(raw.date);
    [hours, minutes] = raw.time.split(':');
    date.setHours(hours);
    date.setMinutes(minutes);
    return {
        amount: Number(raw.amount).toFixed(2),
        category: raw.category,
        description: raw.description,
        shouldCount: raw.shouldCount,
        timestamp: date,
        location: raw.location,
        wallet: raw.wallet,
        owner: userId
    };
}