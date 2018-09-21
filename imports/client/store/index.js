/**
 * Created by abbeymart on 2017-04-04.
 */
import Vue from 'vue';
import Vuex from 'vuex';

import modules from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
    modules,
    strict: process.env.NODE_ENV !== 'production',
})