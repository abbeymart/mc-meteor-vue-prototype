/**
 * Created by abbeymart on 2017-03-09.
 * Payment configuration: server-side
 */
// TODO: Stripe configuration, install / import stripe npm-module

// server-side secret keys: testSecretKey | liveSecretKey
const config     = require( '/imports/server/methods/central/shared/payment/config.json' );
// Stripe Test
const stripeTest = require( "stripe" )(
    config.private.stripe.testSecretKey
);
stripeTest.setTimeout( 20000 ); // in ms (default is node's default: 120000ms)

// Stripe Live
const stripeLive = require( "stripe" )(
    config.private.stripe.liveSecretKey
);
stripeLive.setTimeout( 20000 ); // in ms (default is node's default: 120000ms)
