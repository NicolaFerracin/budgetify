// Script to disable buttons on submit to avoid duplicate requests
function setupSubmitInterceptor() {
    formSubmitInterceptor();
}

function formSubmitInterceptor() {
    const forms = document.querySelectorAll('form');
    if (forms) {
        forms.forEach(f => {
            f.addEventListener('submit', function() {
                f.querySelectorAll('[type="submit"]:not(.exclude)')
                    .forEach(submitBtn => submitBtn.disabled = true);
            });
        });
    }
}

export default setupSubmitInterceptor;