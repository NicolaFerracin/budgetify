const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('landing-page');
});

router.get('/about', (req, res) => {
    res.render('landing-page-about');
});

router.get('/favicon.ico', (req, res) => res.sendStatus(204));

module.exports = router;