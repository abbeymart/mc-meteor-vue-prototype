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
// Stripe Test
const stripeTest = require( "stripe" )( config.private.stripe.testSecretKey );

export function stripeChargeTest( payInfo, payToken, customerInfo, userToken = '', ) {
    try {
        check( payInfo, Object );
        check( payToken, String );
        check( userToken, String );
    } catch( error ) {
        return checkError( error );
    }

    // console.log( payInfo.metadata, 'check-pay' );

    // Create a Charge / Payment
    const charge = Meteor.wrapAsync( stripeTest.charges.create, stripeTest.charges );
    try {
        const result = charge( {
            amount       : payInfo.amount,
            currency     : payInfo.currency,
            description  : payInfo.description,
            customer     : customerInfo.id,
            receipt_email: payInfo.email,
            metadata     : payInfo.metadata,
        } );
        // console.log( result );
        // save payment charge record
        const chargeParams = {
            recordType  : 'charge-test',
            customerId  : customerInfo.id,
            tradePayment: payInfo.tradePayment,
            orderNumber : payInfo.tradePayment.orderNumber,
            chargeInfo  : result,
        };
        const currentDocId = '',
              duplicateDoc = false,
              docNotUnique = false;
        // Call saveRecord method to create new or update existing record
        const payRec       = saveRecord( 'Payments', chargeParams, currentDocId, duplicateDoc, docNotUnique, userToken );

        let payDocId = '';
        if( payRec && (payRec.code === 'inserted' || payRec.code === 'updated' ) ) {
            payDocId = payRec.docId;
        }

        return {
            code   : 'success',
            resCode: 200,
            value  : result,
            docId  : payDocId,
        };
    } catch( error ) {
        // console.log( error );
        // save payment error record
        const errorParams  = {
            recordType: 'charge-test-error',
            errorInfo : error,
        };
        const currentDocId = '',
              duplicateDoc = false,
              docNotUnique = false;
        // Call saveRecord method to create new or update existing record, TODO: wrap in try-catch
        saveRecord( 'Payments', errorParams, currentDocId, duplicateDoc, docNotUnique, userToken );
        // TODO: handle errors via switch()
        return {
            code   : 'chargeError',
            resCode: 401,
            value  : error,
            docId  : '',
        };
    }
}
