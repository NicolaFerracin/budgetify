import '../sass/style.scss';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;

import test from './modules/test';
test.init();

import scripts from './modules/scripts';
scripts.init();