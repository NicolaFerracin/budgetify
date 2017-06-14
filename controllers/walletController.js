const mongoose = require('mongoose');
const Wallet = mongoose.model('Wallet');
const promisify = require('es6-promisify');
const authController = require('./authController');

exports.home = async (req, res) => {
    const wallets = await Wallet.find({ owner: req.user._id });
    res.render('dashboard', { title: 'Home', wallets });
};

exports.walletForm = (req, res) => {
    res.render('addWallet', { title: 'Add Wallet' });
};

exports.addWallet = async (req, res) => {
    req.body.owner = req.user._id;
    const wallet = await (new Wallet(req.body)).save();
    req.flash('success', `<strong>${req.body.name}</strong> wallet created with success!`);
    res.redirect('/');
};

exports.wallet = async (req, res) => {
    const wallet = await Wallet.findOne({ _id: req.params.id, owner: req.user._id });
    res.render('wallet', { title: wallet.name, wallet });
}