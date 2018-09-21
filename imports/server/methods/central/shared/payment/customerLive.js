/**
 * Created by abbeymart on 2017-03-11.
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import saveRecord from '../saveRecord';
import { Payments } from '/imports/collections/Central';
import { checkError } from '../utils';

// Stripe configuration
// server-side secret keys: testSecretKey | liveSecretKey
const config     = require( '../payment/config.json' );
// Stripe Live
const stripeLive = require( "stripe" )( config.private.stripe.liveSecretKey );
// stripeLive.setTimeout( 20000 ); // in ms (default is node's default: 120000ms)

export function stripeCustomerLive( payInfo, payToken, userToken = '' ) {
    try {
        check( payInfo, Object );
        check( payToken, String );
        check( userToken, String );
    } catch( error ) {
        return checkError( error );
    }

    // Create a Customer (for new paying customer only):
    const customer   = Meteor.wrapAsync( stripeLive.customers.create, stripeLive.customers );
    let customerInfo = '';

    try {
        customerInfo = customer( {
            email : payInfo.email,
            source: payToken,
        } );
        // console.log( customerInfo );
        // save customer record / information
        const customerParams = {
            recordType   : 'customer-live',
            customerId   : customerInfo.id,
            customerEmail: payInfo.email,
            customerInfo : customerInfo
        };
        const currentDocId = '',
              duplicateDoc = false,
              docNotUnique = false;
        // Call saveRecord method to create new or update existing record
        saveRecord( 'Payments', customerParams, currentDocId, duplicateDoc, docNotUnique, userToken );
    } catch( error ) {
        // console.log( error );
        // save customer error record
        const errorParams = {
            recordType: 'customer-live-error',
            errorInfo : error,
        };
        const currentDocId = '',
              duplicateDoc = false,
              docNotUnique = false;
        // Call saveRecord method to create new or update existing record, TODO: wrap in try-catch
        saveRecord( 'Payments', errorParams, currentDocId, duplicateDoc, docNotUnique, userToken );
        // TODO: handle errors via switch()
        return {
            code   : 'customerError',
            resCode: 401,
            value  : error
        };
    }

    return customerInfo;
}
