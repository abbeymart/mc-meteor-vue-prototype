/**
 * Created by abbeymart on 2017-11-17
 */

let deferredPrompt;

if (!window.Promise) {
    window.Promise = Promise;
}

if( 'serviceWorker' in navigator ) {
    navigator.serviceWorker
        .register( '/sw.js' )
        .then( function() {
            console.log( 'Service worker registered!' );
        } )
        .catch( function( err ) {
            console.log( 'ServiceWorker registration failed: ', err );
        } );
}

window.addEventListener('beforeinstallprompt', function(event) {
    console.log('beforeinstallprompt fired');
    event.preventDefault();
    deferredPrompt = event;
    return false;
});