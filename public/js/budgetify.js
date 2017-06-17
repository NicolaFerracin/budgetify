import '../sass/style.scss';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
import '../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js';

import setUpSidebar from './modules/sidebar';
import initForm from './modules/categories';

setUpSidebar();

if (document.getElementById('edit-categories')) {
    initForm();
}