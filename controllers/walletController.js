const mongoose = require('mongoose');
const Wallet = mongoose.model('Wallet');
const Transaction = mongoose.model('Transaction');
const promisify = require('es6-promisify');
const authController = require('./authController');
const transactionController = require('./transactionController');
const { catchErrors } = require('../handlers/errors');

exports.dashboard = async (req, res) => {
    const wallets = await Wallet.find({ owner: req.user._id });
    res.render('dashboard', { title: 'Dashboard', wallets });
};

exports.walletForm = (req, res) => {
    res.render('editWallet', { title: 'Add Wallet' });
};

exports.editWallet = async (req, res) => {
    const wallet = await Wallet.findOne({ _id: req.params.id});
    confirmOwner(wallet, req.user);
    res.render('editWallet', { title: `Edit ${wallet.name}`, wallet })
};

exports.addWallet = async (req, res) => {
    req.body.owner = req.user._id;
    const wallet = await (new Wallet(req.body)).save();
    req.flash('success', `<strong>${req.body.name}</strong> wallet created with success!`);
    res.redirect('/');
};

exports.updateWallet = async (req, res) => {
    req.body.excludeFromTotal = req.body.excludeFromTotal;
    const wallet = await Wallet.findOneAndUpdate({ _id: req.params.id}, req.body, {
        new: true,
        runValidators: true
    }).exec();
    req.flash('success', `Succesfully updated <strong>${wallet.name}</strong>. <a href="/wallet/${wallet._id}">Go to wallet</a>`);
    res.redirect(`/wallet/${wallet._id}/edit`);
};

exports.wallet = async (req, res) => {
    const wallet = await Wallet
        .findOne({ _id: req.params.id, owner: req.user._id });
    const year = req.query.y ? Number(req.query.y) : new Date().getFullYear();
    const month = req.query.m ? Number(req.query.m) : new Date().getMonth() + 1;
    const query = { year, month };
    const transactions = await transactionController.getTransactionsForMonth(req.user._id, wallet._id, year, month);
    const calendar = await transactionController.getTransactionsCalendar(req.user._id, wallet._id);
    res.render('wallet', { title: wallet.name, wallet, transactions, calendar, query });
};

exports.deleteWallet = async (req, res) => {
    await Transaction.remove(
        { wallet: req.params.id }
    );
    await Wallet.remove(
        { _id: req.params.id }
    );
    res.sendStatus(200);
};

const confirmOwner = (wallet, user) => {
    if (!wallet.owner.equals(user._id)) {
        throw Error('You must own a wallet in order to edit it')
    }
}
