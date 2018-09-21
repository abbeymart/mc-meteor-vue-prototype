/**
 * Created by abbeymart on 2017-01-17.
 */
// Import Libraries
import { Meteor } from 'meteor/meteor';
import Vue from 'vue';
// import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import VueMeteorTracker from 'vue-meteor-tracker';
// import VueSupply from 'vue-supply';

// Plugins:
import Auth from '/imports/client/lib/plugins/Auth';
import Locales from '/imports/client/lib/plugins/Locales';
import Utility from '/imports/client/lib/plugins/Utility';
// Routes
import { mcRoutes } from '/imports/client/routers';
// Apollo
// import ApolloClient, { createNetworkInterface } from 'apollo-client';
// import VueApollo from 'vue-apollo';
// App layout
import App from '/imports/client/App.vue';

// State management: store (modules)
import store from '../../client/store';

// Promise polyfill for non-supported browsers
import Promise from 'promise-polyfill';
// const setAsap = require('setasap');
// Promise._immediateFn = setAsap;
// To add to window
if( !window.Promise ) {
    window.Promise = Promise;
}

// mcSolutions global services/packages (vue resource, router and vuex)
// Vue.use( VueResource );
Vue.use( VueRouter );
Vue.use( Vuex );
// Auth plugin
Vue.use( Auth );
// Internationalization plugins
Vue.use( Locales );
// Utility functions plugin (functions-library and data validations
Vue.use( Utility );

// Declarative subscriptions and meteor reactive data (subscriptions, collections, tracker etc...)
// alternative to using akryum:vue
Vue.use( VueMeteorTracker );
// Vue.use( VueSupply );

// vue-meteor-data
// const VueMeteorData = require ('vue-meteor-data');
// Vue.mixin(VueMeteorData);

// Router setup
const router = new VueRouter( {
    mode  : 'history',
    routes: mcRoutes,
} );

// DDP setup
// const DDP     = require( 'ddp.js' );
// import DDP from 'ddp.js';

// const options    = {
//     endpoint         : 'ws://localhost:3000/websocket',
//     SocketConstructor: WebSocket
// };

// export const ddp = new DDP( options );

// ddp.on( 'connected', () => {
//     console.log( "Connected to DDP server" );
// } );
// Vue app is now DDP-enabled!

// apollo client setup
// const apolloClient = new ApolloClient( {
//     networkInterface: createNetworkInterface( {
//         uri              : 'http://localhost:3000/graphql',
//         transportBatching: true,
//     } ),
// } );

// Install the vue apollo plugin
// Vue.use( VueApollo, {
//     apolloClient,
// } );
// Vue app is now Apollo-enabled!

// App start (pure vue)
// Meteor.startup(() => {
//     new Vue({
//         el: 'body',
//         replace: false,
//         components: {
//             App
//         },
//         router,
//         store,
//     });
// });

Meteor.startup( () => {
    // Activate the router, store... and mount the application
    new Vue( {
        router,
        store,
        render: h => h( App ),
    } ).$mount( 'app' );
} );
