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

export function stripeChargeLive( payInfo, payToken, customerInfo, userToken = '', ) {
    try {
        check( payInfo, Object );
        check( payToken, String );
        check( userToken, String );
    } catch( error ) {
        return checkError( error );
    }

    // Create a Charge / Payment
    const charge = Meteor.wrapAsync( stripeLive.charges.create, stripeLive.charges );
    try {
        const result = charge( {
            amount       : payInfo.amount,
            currency     : payInfo.currency,
            description  : payInfo.description,
            customer     : customerInfo.id,
            receipt_email: payInfo.email,
            metadata     : payInfo.metadata,
        } );
        // extra info (TBD): receipt_number: payInfo.metadata.orderNumber,
        // console.log( result );
        // save payment charge record
        const chargeParams = {
            recordType  : 'charge-live',
            customerId  : customerInfo.id,
            tradePayment: payInfo.tradePayment,
            orderNumber : payInfo.metadata.orderNumber,
            chargeInfo  : result,
        };
        const currentDocId = '',
              duplicateDoc = false,
              docNotUnique = false;
        // Call saveRecord method to create new or update existing record
        const payRec       = saveRecord( 'Payments', chargeParams, currentDocId, duplicateDoc, docNotUnique, userToken );
        let payDocId ='';
        if(payRec && (payRec.code === 'inserted' || payRec.code === 'updated' )) {
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
            recordType: 'charge-live-error',
            errorInfo : error,
        };
        const currentDocId = '',
              duplicateDoc = false,
              docNotUnique = false;
        // Call saveRecord method to create new or update existing record,
        saveRecord( 'Payments', errorParams, currentDocId, duplicateDoc, docNotUnique, userToken );
        // TODO: optional, handle errors via switch()
        return {
            code   : 'chargeError',
            resCode: 401,
            value  : error,
            docId  : '',
        };
    }
}
