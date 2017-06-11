const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errors');

router.get('/', (req, res) => {
    res.render('layout', { title: 'Home' });
});

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

module.exports = router;