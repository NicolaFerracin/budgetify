const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const walletController = require('../controllers/walletController');
const transactionController = require('../controllers/transactionController');
const { catchErrors } = require('../handlers/errors');

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard');
    } else {
        res.render('layout', { title: 'Dashboard' });
    }
});

router.get('/dashboard',
    authController.isLoggedIn,
    catchErrors(walletController.dashboard)
);

// Registration
router.get('/register', userController.registerForm);
router.post('/register',
    userController.validateRegister,
    catchErrors(userController.register),
    authController.login
);

// Login
router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/auth/facebook', authController.facebook);
router.get('/auth/facebook/callback', authController.facebookCallback);
router.get('/auth/google', authController.google);
router.get('/auth/google/callback', authController.googleCallback);

// Logout
router.get('/logout', authController.logout);

// Recover
router.get('/recover', authController.recoverForm);
router.post('/recover', catchErrors(authController.recover));
router.get('/recover/:token', catchErrors(authController.reset));
router.post('/recover/:token',
    authController.validateReset,
    authController.confirmedPasswords,
    catchErrors(authController.update)
);

// Account
router.get('/account', userController.account);
router.post('/account/updateAccount', catchErrors(userController.updateAccount));
router.post('/account/changePassword',
    authController.validateReset,
    authController.confirmedPasswords,
    catchErrors(authController.changePassword)
);

// Wallets
router.get('/wallet', walletController.walletForm);
router.post('/wallet',
    authController.isLoggedIn,
    catchErrors(walletController.addWallet)
);
router.post('/wallet/:id',
    authController.isLoggedIn,
    catchErrors(walletController.updateWallet)
);
router.get('/wallet/:id', catchErrors(walletController.wallet));
router.get('/wallet/:id/edit', catchErrors(walletController.editWallet));

// Transactions
router.post('/transaction',
    authController.isLoggedIn,
    catchErrors(transactionController.addTransaction)
);

// Categories
router.post('/categories',
    authController.isLoggedIn,
    catchErrors(userController.editCategories)
);

router.get('/favicon.ico', (req, res) => res.sendStatus(204));
router.get('/transactions', catchErrors(transactionController.getTransactions));

// API
router.get('/api/v1/transaction/:id', catchErrors(transactionController.getTransaction));
router.post('/api/v1/transaction/:id', catchErrors(transactionController.editTransaction));
router.delete('/api/v1/transaction/:id', catchErrors(transactionController.deleteTransaction));
router.delete('/api/v1/wallet/:id', catchErrors(walletController.deleteWallet));

module.exports = router;