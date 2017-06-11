const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Failed login!',
    successRedirect: '/',
    successFlash: 'You are now logged in!'
});

exports.changePassword = async (req, res) => {
    const newPassword = req.body.password;
    req.body.password = req.body['old-password'];
    const user = await User.findOne({ email: req.user.email });
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: 'Failed login!',
        successRedirect: '/',
        successFlash: 'You are now logged in!'
    });
    const setPassword = promisify(user.setPassword, user);
    await setPassword(newPassword);
    const updatedUser = await user.save();
    await req.login(updatedUser);
    req.flash('success', 'Your password has been changed');
    res.redirect('/account');
};

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You are now logged out');
    res.redirect('/');
};

exports.recoverForm = (req, res) => {
    res.render('recover', { title: 'Account Recovery' });
};

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
        return;
    } else {
        req.flash('error', 'Oops, you must logged in.');
        res.redirect('/login');
    }
};

exports.recover = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        req.flash('error', 'No account found for this email address');
        return res.redirect('/login');
    }
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    const resetUrl = `http://${req.headers.host}/recover/${user.resetPasswordToken}`;
    await mail.send({
        user,
        subject: 'Password Reset',
        resetUrl,
        filename: 'password-reset'
    });
    req.flash('success', `You have been emailed a reset link`);
    res.redirect('/login');
};

exports.reset = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
        req.flash('error', 'Password reset is invalid or has expired');
        return res.redirect('/login');
    }
    res.render('reset', { title: 'Reset your password' });
};

exports.validateReset = (req, res, next) => {
    req.checkBody('password', 'Password cannot be blank').notEmpty();
    req.assert('password', 'Please user a stronger password, of at least 6 characters').len(6);
    req.checkBody('password-confirm', 'Confirmed Password cannot be blank').notEmpty();
    req.checkBody('password-confirm', 'Your passwords do not match').equals(req.body.password);
    const errors = req.validationErrors();
    if (errors) {
        req.flash('error', errors.map(err => err.msg));
        res.render('reset', { title: 'Register', body: req.body, flashes: req.flash() });
        return;
    }
    next();
}

exports.confirmedPasswords = (req, res, next) => {
    if (req.body.password === req.body['password-confirm']) {
        next();
        return;
    }
    req.flash('error', 'Passwords do not match');
    res.redirect('back');
};

exports.update = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
        req.flash('error', 'Password reset is invalid or has expired');
        return res.redirect('/login');
    }
    const setPassword = promisify(user.setPassword, user);
    await setPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    const updatedUser = await user.save();
    await req.login(updatedUser);
    req.flash('success', 'Your password has been updated');
    res.redirect('/');
};