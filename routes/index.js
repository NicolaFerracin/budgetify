const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.render('layout', { title: 'Home' });
});

router.get('/flashes', (req,res) => {
    req.flash('error', 'This is an error');
    req.flash('info', 'This is an info');
    req.flash('warning', 'This is an warning');
    res.render('layout');
});

module.exports = router;