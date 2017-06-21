import axios from 'axios';

const modal = $('#transaction-modal');
const form = $('#transaction-form');
let currentTransactionId = '';

function editTransactionSetUp() {
    if (document.getElementsByClassName('t-body').length == 0) {
        return;
    }
    const transactions = document.getElementsByClassName('t-body');
    for (var t of transactions) {
        t.addEventListener('click', onTransactionClick, false);
    }
    document.getElementById('deleteTransaction').addEventListener('click', onDelete, false);
}

function onDelete() {
    axios
        .delete(`/api/v1/transaction/${currentTransactionId}`)
        .then(res => {
            location.reload();
        });
}

function onTransactionClick() {
    currentTransactionId = this.getAttribute('id')
    let oldState = getCurrentState(form);
    axios
        .get(`/api/v1/transaction/${currentTransactionId}`)
        .then(res => {
            const rawData = res.data;
            const newState = {};
            newState.title = 'Edit Transaction';
            newState.amount = rawData.amount;
            newState.category = rawData.category;
            newState.description = rawData.description;
            newState.wallet = rawData.wallet;
            newState.shouldCount = rawData.shouldCount;
            const dateRaw = new Date(rawData.timestamp);
            const year = dateRaw.getFullYear();
            const month = dateRaw.getMonth() + 1 < 10 ? `0${dateRaw.getMonth() + 1}` : dateRaw.getMonth() + 1;
            const day = dateRaw.getDate();
            newState.date = `${year}-${month}-${day}`;
            const hours = dateRaw.getHours().toString().length < 2 ? `0${dateRaw.getHours()}` : dateRaw.getHours();
            const minutes = dateRaw.getMinutes().toString().length < 2 ? `0${dateRaw.getMinutes()}` : dateRaw.getMinutes();
            newState.time = `${hours}:${minutes}`;
            newState.address = rawData.location.address;
            newState.lat = rawData.location.coordinates[1];
            newState.lng = rawData.location.coordinates[0];
            newState.action = `/api/v1/transaction/${currentTransactionId}`;
            newState.button = 'Edit';
            newState.enableDelete = true;
            setNewState(form, newState);
            modal.modal().show();
            modal.on('hidden.bs.modal', function () {
                if (oldState) {
                    setNewState(form, oldState);
                }
                oldState = null;
            });
        });
}

function getCurrentState(form) {
    const state = {
        title: form.find('h4.modal-title').text(),
        category: form.find('select[name="category"]').val(),
        amount: form.find('input[name="amount"]').val(),
        date: form.find('input[name="date"]').val(),
        time: form.find('input[name="time"]').val(),
        description: form.find('input[name="description"]').val(),
        wallet: form.find('input[name="wallet"]').val(),
        address: form.find('input[name="location[address]"]').val(),
        lat: form.find('input[name="location[coordinates][0]"]').val(),
        lng: form.find('input[name="location[coordinates][1]"]').val(),
        shouldCount: form.find('input[name="shouldCount"]').is(':checked'),
        action: form.attr('action'),
        button: form.find('button[type="submit"]').text(),
        enableDelete: !form.find('#deleteTransaction').hasClass('hidden')
    };
    return state;
}

function setNewState(form, newState) {
    form.find('h4.modal-title').text(newState.title);
    form.find('select[name="category"]').val(newState.category);
    form.find('input[name="amount"]').val(newState.amount);
    form.find('input[name="date"]').val(newState.date);
    form.find('input[name="time"]').val(newState.time);
    form.find('input[name="description"]').val(newState.description);
    form.find('input[name="wallet"]').val(newState.wallet);
    form.find('input[name="location[address]"]').val(newState.address);
    form.find('input[name="location[coordinates][0]"]').val(newState.lng);
    form.find('input[name="location[coordinates][1]"]').val(newState.lat);
    form.find('input[name="shouldCount"]').prop("checked", newState.shouldCount);
    form.find('input[name="shouldCount"]').prop("checked", newState.shouldCount);
    form.attr('action', newState.action);
    form.find('button[type="submit"]').text(newState.button);
    form.find('#deleteTransaction').toggleClass('hidden', !newState.enableDelete);
}

export default editTransactionSetUp;