import '../sass/style.scss';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
import '../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js';

import setUpSidebar from './modules/sidebar';
import initForm from './modules/categories';
import autocomplete from './modules/autocomplete';
import editTransactionSetUp from './modules/transactions';

setUpSidebar();
initForm();
autocomplete(document.getElementById('address'), document.getElementById('lat'), document.getElementById('lng'));