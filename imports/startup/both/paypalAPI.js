/**
 * Created by abbeymart on 2017-03-07.
 */

const paypal = require('paypal-rest-sdk');

paypal.configure({
    mode: 'sandbox', // Sandbox or live
    client_id: 'YOUR APPLICATION CLIENT ID',
    client_secret: 'YOUR APPLICATION CLIENT SECRET'});
