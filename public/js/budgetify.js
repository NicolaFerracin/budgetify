import '../sass/style.scss';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
import '../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js';

import initForm from './modules/categories';
import autocomplete from './modules/autocomplete';
import editTransactionSetUp from './modules/transactions';
import initWallet from './modules/wallet';
import calendarSetup from './modules/transactionWidget';

initForm();
autocomplete(
    document.getElementById('address'), 
    document.getElementById('lat'), 
    document.getElementById('lng')
);
editTransactionSetUp();
initWallet();
calendarSetup();
