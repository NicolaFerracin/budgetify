const fs = require('fs');
const currencies = require('./src/currencies')

exports.moment = require('moment');

exports.dump = (obj) => JSON.stringify(obj, null, 2);

// exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);

exports.currentYear = () => new Date().getFullYear();

exports.siteName = {
    text: `Budgetify`,
    html: '<strong>B</strong>udgetify'
};

exports.menu = [
    { slug: '/one', title: 'One', icon: 'one', },
    { slug: '/two', title: 'Two', icon: 'two', },
    { slug: '/three', title: 'Three', icon: 'three', }
];

exports.currencies = currencies.currencies;