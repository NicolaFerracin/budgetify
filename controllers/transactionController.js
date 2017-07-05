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

exports.getTransactionsCalendar = async (userId, walletId) => {
    const calendar = await Transaction.aggregate([
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
                    month: { $month: '$timestamp' }
                }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        {
            $group: {
                _id: {
                    year: "$_id.year"
                },
                months: {
                    $push: {
                        month: "$_id.month"
                    }
                }
            }
        },
        {
            $project: {
                year: '$_id.year',
                months: '$months',
                _id: 0
            }
        }
    ]);
    return calendar;
};

exports.getTransactionsForMonth = async (userId, walletId, year, month) => {
    const transactions = await Transaction.aggregate([
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
                date: { $first: '$timestamp' },
                transactions: { $push: '$$ROOT' },
                amountDay: {
                    '$sum': {
                        $cond : { if: { $eq: ['$excludeFromTotal', true]}, then: 0, else: '$amount'}
                    }
                }
            }
        },
        { $sort: { '_id.day': -1 } },
        {
            $group: {
                _id: {
                    year: '$_id.year',
                    month: '$_id.month',
                },
                amountMonth: { $sum: '$amountDay' },
                days: {
                    $push: {
                        date: '$date',
                        transactions: '$transactions',
                        amountDay: '$amountDay'
                    }
                }
            }
        },
        {
            $project: {
                year: '$_id.year',
                month: '$_id.month',
                days: '$days',
                amountMonth: true,
                _id: 0
            }
        },
        {
            $match: {
                year: year,
                month: month
            }
        },
    ]);
    return transactions;
};

function prepareTransactionForDb(raw, userId) {
    const date = new Date(raw.date);
    [hours, minutes] = raw.time.split(':');
    date.setHours(hours);
    date.setMinutes(minutes);
    return {
        amount: Number(raw.amount).toFixed(2),
        category: raw.category,
        description: raw.description,
        excludeFromTotal: raw.excludeFromTotal,
        excludeFromBudget: raw.excludeFromBudget,
        timestamp: date,
        location: raw.location,
        wallet: raw.wallet,
        owner: userId
    };
}