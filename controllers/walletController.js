const mongoose = require('mongoose');
const Wallet = mongoose.model('Wallet');
const promisify = require('es6-promisify');

exports.walletForm = (req, res) => {
    res.render('addWallet', { title: 'Add Wallet' });
};

exports.addWallet = async (req, res) => {
    req.body.owner = req.user._id;
    const wallet = await (new Wallet(req.body)).save();
    req.flash('success', `<strong>${req.body.name}</strong> wallet created with success!`);
    res.redirect('/');
};