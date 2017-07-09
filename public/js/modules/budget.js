import axios from 'axios';

let form;
let quantityErrorMsg;
let currencyErrorMsg;
let budgetWallets;
let dateErrorMsg;

function initBudget() {
    form = document.getElementById('budget-form');
    quantityErrorMsg = document.getElementById('quantity-error');
    currencyErrorMsg = document.getElementById('currency-error');
    dateErrorMsg = document.getElementById('date-error');
    budgetWallets = document.querySelectorAll('input[name="wallets"]');
    onDeletion();
    onSubmit();
    singleBudgetView();
}

function onDeletion() {
    const deleteBudget = document.getElementById('deleteBudget');
    if (deleteBudget) {
        deleteBudget.addEventListener('click', function () {
            const budgetId = deleteBudget.parentElement.parentElement.dataset.budget;
            axios
                .delete(`/api/v1/budget/${budgetId}`)
                .then(res => {
                    window.location = '/dashboard';
                });
        });
    }
}

document.checkWallets = function () {
    checkForErrors(budgetWallets);
}

function onSubmit() {
    if (form) {
        checkForErrors(budgetWallets);
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!checkForErrors(budgetWallets)) {
                this.submit();
                form.querySelector('[type="submit"').disabled = true;
            }
        });
    }
}

function checkForErrors(wallets) {
    let hasErrors = false;
    if (isEndDateBeforeStartDate()) {
        dateErrorMsg.classList.remove('hidden');
        hasErrors = true;
    } else {
        dateErrorMsg.classList.add('hidden');
        hasErrors = hasErrors ? true : false;
    }
    if (!isAtLeastOnWalletSelected(wallets)) {
        quantityErrorMsg.classList.remove('hidden');
        hasErrors = true;
    } else {
        quantityErrorMsg.classList.add('hidden');
        hasErrors = hasErrors ? true : false;
    }
    if (haveWalletsDifferentCurrency(wallets)) {
        currencyErrorMsg.classList.remove('hidden');
        hasErrors = true;
    } else {
        currencyErrorMsg.classList.add('hidden');
        hasErrors = hasErrors ? true : false;
    }
    return hasErrors;
}

function isEndDateBeforeStartDate() {
    const start = new Date(form.querySelector('input[name="start"]').value);
    const end = new Date(form.querySelector('input[name="end"]').value);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        return start.getTime() > end.getTime();
    }
}

function isAtLeastOnWalletSelected(wallets) {
    for (let i = 0; i < wallets.length; i++) {
        if (wallets[i].checked) {
            return true;
        }
    }
    return false;
}

function haveWalletsDifferentCurrency(wallets) {
    const selected = [];
    for (let i = 0; i < wallets.length; i++) {
        if (selected.length === 0) {
            if (wallets[i].checked) {
                selected.push(wallets[i].dataset.currency);
            }
        } else if (wallets[i].checked && selected.indexOf(wallets[i].dataset.currency) < 0) {
            return true;
        }
    }
    return false;
}

function singleBudgetView() {
    const table = document.getElementsByClassName('box-budget-month')[0];
    if (table) {
        // toggle edit
        const readOnlyAmount = document.querySelectorAll('[data-widget="budgetMonth"]');
        readOnlyAmount.forEach(el => el.addEventListener('click', function(e) {
            const trigger = this.dataset.trigger;
            this.classList.add('hidden');
            document.getElementById(trigger).classList.remove('hidden');
        }));

        // cancel edit
        const cancelIcons = document.querySelectorAll('i.cancel');
        cancelIcons.forEach(i => i.addEventListener('click', function(e) {
            const parent = this.parentElement.parentElement;
            parent.classList.add('hidden');
            document.querySelector(`[data-trigger="${parent.id}"`).classList.remove('hidden');
        }));

        // save edit
        const saveIcons = document.querySelectorAll('i.save');
        saveIcons.forEach(i => i.addEventListener('click', function(e) {
            const parent = this.parentElement.parentElement;
            const amount = parent.querySelector('input[name="monthAmount"]').value;
            const budgetId = document.querySelector('.box-budget-month').dataset.budget;
            this.parentElement.classList.add('hidden');
            axios({
                method: 'POST',
                url: `/api/v1/budget/${budgetId}/month`,
                data: {
                    id: parent.id,
                    amount
                }
            })
            .then(res => {
                if (res.data.ok) {
                    location.reload();
                } else {
                    alert('Ops! It seems we experienced an error. Please reload the page and try again.');
                }
            });
        }));
    }
}

export default initBudget;