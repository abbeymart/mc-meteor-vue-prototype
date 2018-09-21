/**
 * Created by abbeymart on 2017-03-07.
 */

// Stripe

// Paypal
const client = require('braintree-web/client');
const paypal = require('braintree-web/paypal');

client.create({
    authorization: 'CLIENT_TOKEN_FROM_SERVER'
}, function (err, clientInstance) {
    paypal.create(/* ... */);
});