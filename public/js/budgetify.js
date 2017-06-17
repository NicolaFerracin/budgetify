import '../sass/style.scss';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
import '../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js';

import setUpSidebar from './modules/sidebar';
import initForm from './modules/categories';
import autocomplete from './modules/autocomplete';

setUpSidebar();
if (document.getElementById('edit-categories')) {
    initForm();
}
autocomplete(document.getElementById('address'), document.getElementById('lat'), document.getElementById('lng'));