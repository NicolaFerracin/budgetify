function initForm() {
    const form = document.getElementById('categories-form');
    const newCategoryForm = document.getElementById('new-category');
    const listContainer = document.getElementById('categories-list')
    const list = listContainer.getElementsByTagName('li');
    form.addEventListener('submit', onSubmit, false);
    newCategoryForm.addEventListener('submit', addCategory, false);

    function onSubmit(e) {
        e.preventDefault();
        for (let i = 0; i < list.length; i++) {
            const categoriesInput = document.createElement('input');
            categoriesInput.name = 'categories';
            categoriesInput.type = 'hidden';
            categoriesInput.value = list[i].dataset.value.trim();
            form.appendChild(categoriesInput);
        }
        form.submit();
    }

    function addCategory(e) {
        e.preventDefault();
        const newCategory = newCategoryForm.getElementsByTagName('input')[0].value.trim();
        if (newCategory && newCategory != '') {
            listContainer.innerHTML = `<li data-value="${newCategory}">${newCategory} <span class="fa fa-remove" onclick="this.parentElement.remove()"></li>` + listContainer.innerHTML;
        }
    }
}

export default initForm;