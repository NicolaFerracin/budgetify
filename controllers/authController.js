const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');

exports.login = passport.authenticate('local', {
    failureRedirect: '/app/login',
    failureFlash: 'Failed login!',
    successRedirect: '/app'
});

exports.changePassword = async (req, res) => {
    const newPassword = req.body.password;
    req.body.password = req.body['old-password'];
    const user = await User.findOne({ email: req.user.email });
    passport.authenticate('local', {
        failureRedirect: '/app/account',
        failureFlash: 'The current password you entered doesn\'t seem to be right',
        successRedirect: '/app'
    });
    const setPassword = promisify(user.setPassword, user);
    await setPassword(newPassword);
    const updatedUser = await user.save();
    await req.login(updatedUser);
    req.flash('success', 'Your password has been changed');
    res.redirect('/app/account');
};

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/app/login');
};

exports.recoverForm = (req, res) => {
    res.render('recover', { title: 'Account Recovery' });
};

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
        return;
    } else {
        req.flash('error', 'Oops, you must login first.');
        res.redirect('/app/login');
    }
};

exports.recover = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        req.flash('error', 'No account found for this email address');
        return res.redirect('/app/login');
    }
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    const resetUrl = `https://${req.headers.host}/app/recover/${user.resetPasswordToken}`;
    await mail.send({
        user,
        subject: 'Password Reset',
        resetUrl,
        filename: 'password-reset'
    });
    req.flash('success', `You have been emailed a reset link`);
    res.redirect('/app/login');
};

exports.reset = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
        req.flash('error', 'Password reset is invalid or has expired');
        return res.redirect('/app/login');
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
        return res.redirect('/app/login');
    }
    const setPassword = promisify(user.setPassword, user);
    await setPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    const updatedUser = await user.save();
    await req.login(updatedUser);
    req.flash('success', 'Your password has been updated');
    res.redirect('/app');
};

exports.facebook = passport.authenticate('facebook', { scope: [ 'email' ] });

exports.facebookCallback = passport.authenticate('facebook', {
    failureRedirect: '/app/login',
    failureFlash: 'Failed login!',
    successRedirect: '/app'
});

exports.google = passport.authenticate('google', { scope : ['profile', 'email'] });

exports.googleCallback = passport.authenticate('google', {
    failureRedirect: '/app/login',
    failureFlash: 'Failed login!',
    successRedirect: '/app'
});