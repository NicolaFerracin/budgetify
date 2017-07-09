const mongoose = require('mongoose');
const Budget = mongoose.model('Budget');
const transactionController = require('./transactionController');

exports.budgetForm = (req, res) => {
    res.render('editBudget', { title: 'Create Budget' });
};

exports.budget = async (req, res) => {
    const budget = await Budget
        .findOne({ _id: req.params.id, owner: req.user._id });
    const year = req.query.y ? Number(req.query.y) : new Date().getFullYear();
    const budgetYear = await getBudgetYear(req.user._id, budget._id, year);
    const walletIds = budget.wallets.map(w => mongoose.Types.ObjectId(w.id));
    const transactionYear = await transactionController.getTransactionsForYear(req.user._id, walletIds, year);
    const calendar = await getBudgetCalendar(req.user._id, budget._id);
    res.render('budget', { title: budget.name, budget, calendar, budgetYear, query: year, transactionYear: transactionYear[0] });
};

exports.addBudget = async (req, res) => {
    if (!req.body.wallets || req.body.wallets.length <= 0) {
        req.flash('error', 'Please, make sure to choose at least one Wallet.');
        return req.redirect('back');
    }
    const budget = prepareBudgetForDb(req.body, req.user._id);
    await (new Budget(budget)).save();
    req.flash('success', `<strong>${req.body.name}</strong> budget created with success!`);
    res.redirect('/dashboard');
};

exports.updateBudget = async (req, res) => {
    req.body.wallets = req.body.wallets;
    if (!req.body.wallets || req.body.wallets.length <= 0) {
        req.flash('error', 'Please, make sure to choose at least one Wallet.');
        return res.redirect('back');
    }
    const updatedBudget = prepareBudgetForDb(req.body, req.user._id);
    const budget = await Budget.findOneAndUpdate({ _id: req.params.id}, updatedBudget, {
        new: true,
        runValidators: true
    }).exec();
    req.flash('success', `Succesfully updated <strong>${budget.name}</strong>.`);
    res.redirect(`/budget/${budget._id}/edit`);
};

exports.editBudget = async (req, res) => {
    const budget = await Budget.findOne({ _id: req.params.id});
    confirmOwner(budget, req.user);
    res.render('editBudget', { title: `Edit ${budget.name}`, budget })
};

exports.deleteBudget = async (req, res) => {
    await Budget.remove(
        { _id: req.params.id }
    );
    res.sendStatus(200);
};

exports.updateMonth = async (req, res) => {
    const budget = await Budget
        .update({ 
            _id: req.params.id, 
            owner: req.user._id,
            'months._id': req.body.id
        }, { $set: { 'months.$.amount': req.body.amount }});
    res.send(budget);
};

const confirmOwner = (budget, user) => {
    if (!budget.owner.equals(user._id)) {
        throw Error('You must own a budget in order to edit it')
    }
}

function generateBudgetMonths(budget) {
    /**
     * set start and end date range. Logic:
     * - if start is not set, use now
     * - if end is before now, then use it as a final date
     * - else use now as a final date for the range
     */ 
    const now = new Date();
    const start = budget.start ? new Date(budget.start) : new Date();
    const end = budget.end ? (new Date(budget.end).getTime() < now.getTime() ? new Date(budget.end) : now) : now;
    budget.months = budget.months ? budget.months : [];
    const existingMonths = budget.months.reduce((res, m) => {
        res.push(`${m.month}-${m.year}`)
        return res;
    }, []);
    while (start.getMonth() <= end.getMonth() || start.getFullYear() < end.getFullYear()) {
        const monthYear = `${start.getMonth()}-${start.getFullYear()}`;
        if (existingMonths.indexOf(monthYear) >= 0) {
            continue;
        }
        const entry = { month: start.getMonth() + 1, year: start.getFullYear(), amount: budget.amount };
        budget.months.push(entry);
        start.setMonth(start.getMonth() + 1);
    }
    return budget.months;
}

function prepareBudgetForDb(raw, userId) {
    const budget = raw;
    if (!budget.start || budget.start === '') {
        budget.start = new Date();
    }
    budget.owner = userId;
    budget.months = generateBudgetMonths(raw);
    return budget;
}


async function getBudgetCalendar(userId, budgetId) {
    const calendar = await Budget.aggregate([
        {
            $match: {
                owner: userId,
                _id: budgetId
            }
        },
        { $unwind: '$months' },
        {
            $group: {
                _id: {
                    year: '$months.year'
                }
            }
        },
        { $sort: { '_id.year': -1 }},
        {
            $project: {
                year: '$_id.year',
                _id: 0
            }
        }
    ]);
    return calendar;
};

async function getBudgetYear(userId, budgetId, year) {
    const result = await Budget.aggregate([
        {
            $match: {
                owner: userId,
                _id: budgetId
            }
        },
        { $unwind: '$months' },
        {
            $group: {
                _id: {
                    year: '$months.year',
                    months: '$months.month',
                    amount: '$months.amount',
                    id: '$months._id'
                },
                
            }
        },
        { $sort: { '_id.year': -1, '_id.months': -1 }},
        {
            $project: {
                year: '$_id.year',
                month: '$_id.months',
                amount: '$_id.amount',
                id: '$_id.id',
                _id: 0
            }
        },
        {
            $match: {
                year: year
            }
        },
    ]);
    return result;
};
