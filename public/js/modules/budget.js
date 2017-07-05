import axios from 'axios';

function initBudget() {
    const deleteBudget = document.getElementById('deleteBudget');
    if (deleteBudget) {
        deleteBudget.addEventListener('click', function() {
            const budgetId = deleteBudget.parentElement.parentElement.dataset.budget;
            axios
                .delete(`/api/v1/budget/${budgetId}`)
                .then(res => {
                    window.location = '/dashboard';
                });
        });
    }
}

export default initBudget;