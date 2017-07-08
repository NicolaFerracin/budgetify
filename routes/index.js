const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const walletController = require('../controllers/walletController');
const transactionController = require('../controllers/transactionController');
const budgetController = require('../controllers/budgetController');
const { catchErrors } = require('../handlers/errors');

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
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

// Activation
router.get('/activate/:token', catchErrors(userController.activateAccount));
router.post('/activate/resend', catchErrors(userController.resendActivation));

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

// Budgets
router.get('/budget', budgetController.budgetForm);
router.post('/budget',
    authController.isLoggedIn,
    catchErrors(budgetController.addBudget)
);
router.get('/budget/:id', catchErrors(budgetController.budget));
router.post('/budget/:id',
    authController.isLoggedIn,
    catchErrors(budgetController.updateBudget)
);
router.get('/budget/:id/edit', catchErrors(budgetController.editBudget));

router.get('/favicon.ico', (req, res) => res.sendStatus(204));

// API
router.get('/api/v1/transaction/:id', catchErrors(transactionController.getTransaction));
router.post('/api/v1/transaction/:id', catchErrors(transactionController.editTransaction));
router.delete('/api/v1/transaction/:id', catchErrors(transactionController.deleteTransaction));
router.delete('/api/v1/wallet/:id', catchErrors(walletController.deleteWallet));
router.delete('/api/v1/budget/:id', catchErrors(budgetController.deleteBudget));

module.exports = router;