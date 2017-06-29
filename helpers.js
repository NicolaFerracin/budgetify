const fs = require('fs');
const currencies = require('./src/currencies');
const moment = require('moment');

exports.moment = moment;

exports.dump = (obj) => JSON.stringify(obj, null, 2);

// exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);

exports.yearForFooter = () => {
    const year = new Date().getFullYear();
    return year === 2017 ? year : `2017 - ${year}`;
};

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

exports.getTransactionsByDay = (transactions) => {
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

exports.getYears = (transactions) => {
    return transactions.reduce((res, t) => {
        const date = moment(t.timestamp);
        const year = date.format('YYYY');
        const month = date.format('M');
        if (res[year]) {
            if (res[year].indexOf(month) === -1) {
                res[year].push(month);
            }
        } else {
            res[year] = [month];
        }
        return res;
    }, {});
}

exports.getTransactionsByMonth = (transactions, month = null) => {
    const days = [];
    const temp = transactions.reduce((res, el) => {
        if (!month || new Date(el.timestamp).getMonth() + 1 === month) {
            const transactionDay = moment(el.timestamp).format('YYYY-MM-DD');
            if (res[transactionDay]) {
                res[transactionDay].push(el);
            } else {
                days.push(transactionDay);
                res[transactionDay] = [el]
            }
        }
        return res;
    }, {});
    return days.sort().reduce((res, el) => {
        res.push({
            date: el,
            transactions: orderByHour(temp[el]),
            total: temp[el].reduce((res, item) => res += item.amount, 0)
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

exports.getIconForFlash = (type) => {
    if (type === 'info' || type === 'warning') {
        return type;
    }
    if (type === 'danger') {
        return 'ban';
    }
    return 'check';
}

exports.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function orderByHour(transactions) {
    return transactions.sort((x, y) => x.timestamp > y.timestamp);
}
