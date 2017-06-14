import '../sass/style.scss';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
import '../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js';

import scripts from './modules/scripts';
scripts.init();