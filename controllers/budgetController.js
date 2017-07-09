const mongoose = require('mongoose');
const Budget = mongoose.model('Budget');

exports.budgetForm = (req, res) => {
    res.render('editBudget', { title: 'Create Budget' });
};

exports.budget = async (req, res) => {
    const budget = await Budget
        .findOne({ _id: req.params.id, owner: req.user._id });
    res.render('budget', { title: budget.name, budget });
};

exports.addBudget = async (req, res) => {
    if (!req.body.wallets || req.body.wallets.length <= 0) {
        req.flash('error', 'Please, make sure to choose at least one Wallet.');
        return req.redirect('back');
    }
    req.body.owner = req.user._id;
    req.body.months = generateBudgetMonths(req.body);
    const budget = await (new Budget(req.body)).save();
    req.flash('success', `<strong>${req.body.name}</strong> budget created with success!`);
    res.redirect('/dashboard');
};

exports.updateBudget = async (req, res) => {
    console.log(req.body)
    req.body.wallets = req.body.wallets;
    if (!req.body.wallets || req.body.wallets.length <= 0) {
        req.flash('error', 'Please, make sure to choose at least one Wallet.');
        return res.redirect('back');
    }
    const budget = await Budget.findOneAndUpdate({ _id: req.params.id}, req.body, {
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
    while (`${start.getMonth()}-${start.getFullYear()}` <= `${end.getMonth()}-${end.getFullYear()}`) {
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