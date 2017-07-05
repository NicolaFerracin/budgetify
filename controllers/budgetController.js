const mongoose = require('mongoose');
const Budget = mongoose.model('Budget');
// const promisify = require('es6-promisify');

exports.budgetForm = (req, res) => {
    res.render('editBudget', { title: 'Create Budget' });
};

exports.addBudget = async (req, res) => {
    if (!req.body.wallets || req.body.wallets.length <= 0) {
        req.flash('error', 'Please, make sure to choose at least one Wallet.');
        return req.redirect('back');
    }
    req.body.owner = req.user._id;
    const budget = await (new Budget(req.body)).save();
    req.flash('success', `<strong>${req.body.name}</strong> budget created with success!`);
    res.redirect('/dashboard');
};

exports.updateBudget = async (req, res) => {
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