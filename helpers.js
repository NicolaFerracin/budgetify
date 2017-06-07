const fs = require('fs');

exports.moment = require('moment');

exports.dump = (obj) => JSON.stringify(obj, null, 2);

// exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);

exports.siteName = `Budgetify`;

exports.menu = [
    { slug: '/one', title: 'One', icon: 'one', },
    { slug: '/two', title: 'Two', icon: 'two', },
    { slug: '/three', title: 'Three', icon: 'three', }
];