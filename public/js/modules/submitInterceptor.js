// Script to disable buttons on submit to avoid duplicate requests
function setupSubmitInterceptor() {
    formSubmitInterceptor();
}

function formSubmitInterceptor() {
    const forms = document.querySelectorAll('form');
    if (!forms) {
        return;
    }
    forms.forEach(f => {
        f.addEventListener('submit', function() {
            f.querySelectorAll('[type="submit"]')
                .forEach(submitBtn => submitBtn.disabled = true);
        });
    });
}

export default setupSubmitInterceptor;