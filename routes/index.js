const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const walletController = require('../controllers/walletController');
const transactionController = require('../controllers/transactionController');
const { catchErrors } = require('../handlers/errors');

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/home');
    } else {
        res.render('layout', { title: 'Home' });
    }
});

router.get('/home', 
    authController.isLoggedIn,
    catchErrors(walletController.home)
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
router.get('/wallet/:id', catchErrors(walletController.wallet));

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


router.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

module.exports = router;