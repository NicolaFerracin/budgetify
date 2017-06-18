const mongoose = require('mongoose');
const Wallet = mongoose.model('Wallet');
const promisify = require('es6-promisify');
const authController = require('./authController');

exports.home = async (req, res) => {
    const wallets = await Wallet.find({ owner: req.user._id });
    res.render('dashboard', { title: 'Home', wallets });
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
    const wallet = await Wallet.findOneAndUpdate({ _id: req.params.id}, req.body, {
        new: true,
        runValidators: true
    }).exec();
    req.flash('success', `Succesfully updated <strong>${wallet.name}</strong>. <a href="/wallet/${wallet._id}">Go to wallet</a>`);
    res.redirect(`/wallet/${wallet._id}/edit`);
};

exports.wallet = async (req, res) => {
    const wallet = await Wallet
        .findOne({ _id: req.params.id, owner: req.user._id })
        .populate('transactions');
    res.render('wallet', { title: wallet.name, wallet });
}

const confirmOwner = (wallet, user) => {
    if (!wallet.owner.equals(user._id)) {
        throw Error('You must own a wallet in order to edit it')
    }
}
