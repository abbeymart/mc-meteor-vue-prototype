/**
 * Created by abbeymart on 2017-01-15.
 */

// Promise polyfill
// if( !window.Promise ) {
//     window.Promise = Promise;
// }

// service-worker: register
// if( 'serviceWorker' in navigator ) {
//     navigator.serviceWorker
//         .register( '/sw.js' )
//         .then( function() {
//             console.log( 'Service worker registered!' );
//         } )
//         .catch( function( err ) {
//             console.log( 'ServiceWorker registration failed: ', err );
//         } );
// }

// mConnect application / solutions activation / startup
import './appStart';
import '/imports/startup/both';

// Apollo client
// import './apolloClient';

// Payment
// import './payment';
