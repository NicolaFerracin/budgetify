const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const { catchErrors } = require('../handlers/errors')

router.get('/', (req, res) => {
    res.render('layout', { title: 'Home' });
});

// Registration
router.get('/register', userController.registerForm);
router.post('/register', 
    userController.validateRegister,
    catchErrors(userController.register)
    // authController.login
);

// Login
router.get('/login', userController.loginForm);
router.post('/login', authController.login);


module.exports = router;