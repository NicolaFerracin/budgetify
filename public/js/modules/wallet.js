import axios from 'axios';

function initWallet() {
    const deleteWallet = document.getElementById('deleteWallet');
    if (deleteWallet) {
        deleteWallet.addEventListener('click', function() {
            const walletId = deleteWallet.parentElement.parentElement.dataset.wallet;
             axios
                .delete(`/api/v1/wallet/${walletId}`)
                .then(res => {
                    window.location = '/dashboard';
                });
        });
    }
}

export default initWallet;