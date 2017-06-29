function calendarSetup() {
    if (!document.getElementById('transactionCalendar')) {
        return;
    }
    const cal = document.getElementById('transactionCalendar');
    const transactions = document.querySelectorAll('.month');
    cal.querySelectorAll('[data-widget="transaction"]').forEach(el => {
        el.addEventListener('click', function() {
            const month = this.dataset.month;
            const year = this.dataset.year;
            transactions.forEach(t => {
                if (t.dataset.year === year && t.dataset.month === month) {
                    t.classList.remove('hidden');
                } else {
                    t.classList.add('hidden');
                }
            });
        });
    });
}

export default calendarSetup;