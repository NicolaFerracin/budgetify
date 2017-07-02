const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

exports.registerForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'You must supply a name for the registration').notEmpty();
    req.checkBody('email', 'The provided email is not valid').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        gmail_remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Password cannot be blank').notEmpty();
    req.assert('password', 'Please user a stronger password, of at least 6 characters').len(6);
    req.checkBody('password-confirm', 'Confirmed Password cannot be blank').notEmpty();
    req.checkBody('password-confirm', 'Your passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();
    if (errors) {
        req.flash('error', errors.map(err => err.msg));
        res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
        return;
    }
    next();
};

exports.register = async (req, res, next) => {
    const user = new User({ email: req.body.email, name: req.body.name });
    const register = promisify(User.register, User);
    await register(user, req.body.password);
    next();
};

exports.account = (req, res) => {
    if (req.user.google || req.user.facebook) {
        res.redirect('back');
    } else {
        res.render('account', { title: 'Edit your account' });
    }
};

exports.updateAccount = async (req, res) => {
    if (req.user.google || req.user.facebook) {
        req.flash('error', 'It seems you are logged in with either Facebook or Google, therefore you cannot update your email and/or password.');
        res.redirect('/dashboard');
    } else {
        const updates = {
            name: req.body.name,
            email: req.body.email
        };
        const user = await User.findOneAndUpdate(
            { _id: req.user._id },
            { $set: updates },
            { new: true, runValidators: true, context: 'query'}
        );
        req.flash('success', 'Your account has been updated!');
        res.redirect('back');
    }
};

exports.changePassword = (req, res) => {
    const newPassword = req.body.password;
    req.body.password = req.body['old-password'];
    req.body.email = req.user.email;
    delete req.body['old-password'];
    delete req.body['password-confirm'];
}

exports.editCategories = async (req, res) => {
    const newCategories = req.body.categories;
    const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { 'categories': newCategories }}
    );
    req.flash('success', 'Categories update with success!');
    res.redirect('back');
}