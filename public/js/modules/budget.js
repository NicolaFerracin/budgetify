import axios from 'axios';

let form;
let quantityErrorMsg;
let currencyErrorMsg;
let budgetWallets;

function initBudget() {
    form = document.getElementById('budget-form');
    quantityErrorMsg = document.getElementById('quantity-error');
    currencyErrorMsg = document.getElementById('currency-error');
    budgetWallets = document.querySelectorAll('input[name="wallets"]');
    onDeletion();
    onSubmit();
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
    if (!isAtLeastOnWalletSelected(wallets)) {
        quantityErrorMsg.classList.remove('hidden');
        hasErrors = true;
    } else {
        quantityErrorMsg.classList.add('hidden');
        hasErrors = false;
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

export default initBudget;