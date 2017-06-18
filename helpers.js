const fs = require('fs');
const currencies = require('./src/currencies');
const moment = require('moment');

exports.moment = moment;

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

exports.transactionsByDay = (transactions) => {
    const days = [];
    const temp = transactions.reduce((res, el) => {
        const transactionDay = moment(el.timestamp).format('YYYY-MM-DD');
        if (res[transactionDay]) {
            res[transactionDay].push(el);
        } else {
            days.push(transactionDay);
            res[transactionDay] = [el]
        }
        return res;
    }, {});
    return days.sort().reduce((res, el) => {
        res.push({
            date: el,
            transactions: orderByHour(temp[el])
        });
        return res;
    }, []);
};

exports.isEmpty = (something) => {
    if (something.constructor === Object) {
        return Object.keys(something).length === 0;
    }
    if (something.constructor === Array) {
        return something.length === 0;
    }
};

exports.getTotalByCurrency = (wallets) => {
    const temp = [];
    const c = {};
    wallets.forEach(w => {
        if (w.shouldCount) {
            const currency = w.currency;
            const total = w.transactions.reduce((res2, t) => res2 += t.amount, 0);
            if (c[currency]) {
                c[currency] += total;
            } else {
                temp.push(currency);
                c[currency] = total;
            }
        }
    });
    return temp.reduce((res, el) => {
        res.push({
            currency: el,
            amount: c[el]
        });
        return res;
    }, []);
};

function orderByHour(transactions) {
    return transactions.sort((x, y) => x.timestamp > y.timestamp);
}