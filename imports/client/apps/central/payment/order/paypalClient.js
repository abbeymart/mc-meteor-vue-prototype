/**
 * Created by abbeymart on 2017-03-07.
 * Paypal client payment
 * To request a one-time payment, set flow* to 'checkout'.
 * You must also include amount* and currency* options.
 */
const client    = require( 'braintree-web/client' );
const paypal    = require( 'braintree-web/paypal' );
const braintree = require( 'braintree' );

// Fetch the button you are using to initiate the PayPal flow
const paypalButton = document.getElementById( 'paypal-button' );

// Create a Client component
braintree.client.create( {
    authorization: 'access_token$production$hf3grr93wc3tc4fs$f3a13f378778a398b7087b0307373885'
}, function( clientErr, clientInstance ) {
    // Create PayPal component
    braintree.paypal.create( {
        client: clientInstance
    }, function( err, paypalInstance ) {
        paypalButton.addEventListener( 'click', function() {
            // Tokenize here!
            paypalInstance.tokenize( {
                flow                   : 'checkout', // Required
                amount                 : 10.00, // Required
                currency               : 'USD', // Required
                locale                 : 'en_US',
                enableShippingAddress  : true,
                shippingAddressEditable: false,
                shippingAddressOverride: {
                    recipientName: 'Scruff McGruff',
                    line1        : '1234 Main St.',
                    line2        : 'Unit 1',
                    city         : 'Chicago',
                    countryCode  : 'US',
                    postalCode   : '60652',
                    state        : 'IL',
                    phone        : '123.456.7890'
                }
            }, function( err, tokenizationPayload ) {
                // Tokenization complete
                // Send tokenizationPayload.nonce to server
            } );
        } );
    } );
} );
