/**
 * Created by abbeymart on 2017-03-09.
 * Payment configuration: server-side
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { checkError, validateError } from '../utils';

// Stripe configuration
// server-side secret keys: testSecretKey | liveSecretKey
const config     = require( './config.json' );
// Stripe Test
const stripeTest = require( "stripe" )( config.private.stripe.testSecretKey );
stripeTest.setTimeout( 20000 ); // in ms (default is node's default: 120000ms)
// Stripe Live
const stripeLive = require( "stripe" )( config.private.stripe.liveSecretKey );
stripeLive.setTimeout( 20000 ); // in ms (default is node's default: 120000ms)


Meteor.methods( {
    chargeCustomer( payInfo, payToken, accessToken = '' ) {
        try {
            check( payInfo, Object );
            check( accessToken, String );
        } catch( error ) {
            return checkError( error );
        }
        // Token is created using Stripe.js or Checkout!
        // Get the payment token submitted by the form:
        const token = request.body.stripeToken; // Using Express

        // Charge the user's card:
        const charge = stripeLive.charges.create( {
            amount     : 1000,
            currency   : "usd",
            description: "Example charge",
            source     : token,
        }, function( err, charge ) {
            // TODO: asynchronously called
        } );
    },
    saveChargeCustomer( payInfo, accessToken = '' ) {
        try {
            check( payInfo, Object );
            check( payToken, String );
            check( accessToken, String );
        } catch( error ) {
            return checkError( error );
        }

        // TODO: validate access via Meteor userId and/or userToken

        // Token is created using Stripe.js or Checkout!
        // Get the payment token submitted by the form:
        const token = request.body.stripeToken; // Using Express

        // Create a Customer:
        stripeLive.customers.create( {
            email : "paying.user@example.com",
            source: token,
        } ).then( function( customer ) {
            // TODO, YOUR CODE, Save the customer ID and other info in a database for later.
            return stripeLive.charges.create( {
                amount  : 1000,
                currency: "usd",
                customer: customer.id,
            } );
        } ).then( function( charge ) {
            // TODO: Use and save the charge info.
        } );
        // TODO: YOUR CODE (LATER), When it's time to charge the customer again, retrieve the customer ID.
        stripe.charges.create( {
            amount  : 1500, // $15.00 this time
            currency: "usd",
            customer: customerId,
        } );
    },
    chargeCustomerTest( payInfo, accessToken = '' ) {
        try {
            check( payInfo, Object );
            check( accessToken, String );
        } catch( error ) {
            return checkError( error );
        }
        // Token is created using Stripe.js or Checkout!
        // Get the payment token submitted by the form:
        const token = request.body.stripeToken; // Using Express

        // Charge the user's card:
        const charge = stripeTest.charges.create( {
            amount     : 1000,
            currency   : "usd",
            description: "Example charge",
            source     : token,
        }, function( err, charge ) {
            // TODO: asynchronously called
            if(err) {
                return {
                    code: 'error',
                    result: err.message
                }
            }
            return {
                code: 'success',
                result: charge
            }
        } );
    },
    saveChargeCustomerTest( payInfo, accessToken = '' ) {
        try {
            check( payInfo, Object );
            check( accessToken, String );
        } catch( error ) {
            return checkError( error );
        }

        // Token is created using Stripe.js or Checkout!
        // Get the payment token submitted by the form:
        const token = request.body.stripeToken; // Using Express

        // Create a Customer:
        stripeLive.customers.create( {
            email : "paying.user@example.com",
            source: token,
        } ).then( function( customer ) {
            // TODO, YOUR CODE, Save the customer ID and other info in a database for later.
            return stripeTest.charges.create( {
                amount  : 1000,
                currency: "usd",
                customer: customer.id,
            } );
        } ).then( function( charge ) {
            // TODO: Use and save the charge info.
        } );
        // TODO: YOUR CODE (LATER), When it's time to charge the customer again, retrieve the customer ID.
        stripe.charges.create( {
            amount  : 1500, // $15.00 this time
            currency: "usd",
            customer: customerId,
        } );
    },
} );
