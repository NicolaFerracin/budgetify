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

exports.currencies = currencies.currencies;

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
        if (!w.excludeFromTotal) {
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

exports.orderByHour = (transactions) => transactions.sort((x, y) => x.timestamp < y.timestamp);

exports.getSavedAmountPerBudget = (wallets) => {
    return wallets.reduce((res, w) => {
        res += w.transactions.filter(t => !t.excludeFromBudget)
            .reduce((res, t) => {
                res += t.amount;
                return res;
            }, 0)
        return res;
    }, 0)
}