const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.walletForm = (req, res) => {
    res.render('addWallet', { title: 'Add Wallet' });
};

exports.addWallet = async (req, res) => {
    req.flash('success', `<strong>${req.body.name}</strong> wallet created with success!`);
    res.redirect('back');
};