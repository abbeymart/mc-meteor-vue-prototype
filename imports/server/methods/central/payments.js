/**
 * Created by saturnbay on 2014-12-14.
 * Updated: 2016-06-29 (Abi) | Updated: 2017-03-07
 * Pay-providers: payType, payProvider, payAccess, payOwner, payLocale, payLocation,
 * Payment: payProvider, payOrder, payAmount, payDate/createdDate/updatedDate, payBy, payBalance... (part of OM?)
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import {
    validatePayment,
    validatePayProvider,
    validateTradePayment,
    validateRefund
} from '/imports/lib/utils/ValidateRecord';
import saveRecord from './shared/saveRecord';
import { Payments, PayProviders, Refunds, AccessKeys } from '/imports/collections/Central';
import { Orders } from '/imports/collections/Mpe';
import removeRecord from './shared/removeRecord';
import getRecord from './shared/getRecord';
import { checkError, validateError, unAuthorized, tokenExpired } from './shared/utils';
import { stripeCustomerTest } from './shared/payment/customerTest';
import { stripeChargeTest } from './shared/payment/chargeTest';
import { stripeCustomerLive } from './shared/payment/customerLive';
import { stripeChargeLive } from './shared/payment/chargeLive';

// Stripe configuration
// server-side secret keys: testSecretKey | liveSecretKey
const config     = require( './shared/payment/config.json' );
// Stripe Test
const stripeTest = require( "stripe" )( config.private.stripe.testSecretKey );
// Stripe Live
const stripeLive = require( "stripe" )( config.private.stripe.liveSecretKey );
// stripeLive.setTimeout( 20000 ); // in ms (default is node's default: 120000ms)

Meteor.methods( {
    getPayProvider( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // Get items, for authenticated / authorized user, by token
        return getRecord( 'PayProviders', { collParams, currentDocId, token } );
    },
    getPay( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Payments', { collParams, currentDocId, token } );
    },
    getRefund( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Refunds', { collParams, currentDocId, token } );
    },
    savePayProvider( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                payProvider: String,
                payType    : String, // Debit-Credit | Credit | Debit | Cash | Cheque...
                payEnv     : String, // Test or Live
                payAccess  : String, // Test or Live access key
                payLocation: String, // Seller payment location
                payEndPoint: String,  // Payment provider payment processing URL
                payLocale  : String,
                payOwner   : String, // Seller's identification / name
                payDesc    : String,
                isActive   : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validatePayProvider( collParams );
        if( errors.payProvider || errors.payType || errors.payEnv || errors.payAccess || errors.payLocation || errors.payOwner || errors.payLocale || errors.payEndPoint ) {
            return validateError( errors );
        }

        // Save method check, for new document/record:
        // Check if a duplicate document with the same information... to ensure uniqueness
        const duplicateDoc = PayProviders.findOne(
            {
                payType    : collParams.payType,
                payEnv     : collParams.payEnv,
                payProvider: collParams.payProvider,
            }
        ) ? true : false;

        // Update method check, for existing record:
        // Check if other document with the same / changed name exist, to avoid duplicate name
        const docNotUnique = PayProviders.findOne(
            {
                _id        : { $ne: currentDocId },
                payType    : collParams.payType,
                payEnv     : collParams.payEnv,
                payProvider: collParams.payProvider,
            }
        ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'PayProviders', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    savePay( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        // @TODO: not-in-use, payItem (ID) must be unique for order or sub-order (managed from order management package)
        try {
            check( collParams, {
                order      : {
                    orderId    : String,
                    orderName  : String,
                    orderDesc  : String,
                    orderAmount: Number,
                },
                customer   : {
                    email: String,
                    name : String,
                },
                billAddress: {
                    address_line1  : String,
                    address_line2  : String,
                    address_city   : String,
                    address_state  : String,
                    address_zip    : String,
                    address_country: String,
                },
                shipAddress: {
                    address_line1  : String,
                    address_line2  : String,
                    address_city   : String,
                    address_state  : String,
                    address_zip    : String,
                    address_country: String,
                },
                payLang    : String,
                payName    : String,
                payDesc    : String,
                isActive   : Boolean,
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validatePayment( collParams );
        if( errors.payDesc || errors.billAddress || errors.order || errors.customer || errors.payName ) {
            return validateError( errors );
        }

        // Save method check, for new document/record:
        // Check if other document with the same / changed name exist, to avoid duplicate name
        const duplicateDoc = Payments.findOne(
            {
                payName          : collParams.payName,
                'order.orderName': collParams.order.orderName,
            }
        ) ? true : false;

        // Update method check, for existing record:
        // Check if other document with the same / changed name exist, to avoid duplicate name
        const docNotUnique = Payments.findOne(
            {
                _id              : { $ne: currentDocId },
                payName          : collParams.payName,
                'order.orderName': collParams.order.orderName,
            }
        ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Payments', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removePayProvider( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'PayProviders', currentDocId, token );
    },
    removePay( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Payments', currentDocId, token );
    },
    chargeCustomerLive( payInfo, payToken, userToken = '' ) {
        try {
            check( payInfo, Object );
            check( payToken, String );
            check( userToken, String );
        } catch( error ) {
            return checkError( error );
        }

        const charge = Meteor.wrapAsync( stripeLive.charges.create, stripeLive.charges );

        try {
            const result = charge( {
                amount     : payInfo.amount,
                currency   : payInfo.currency,
                description: payInfo.description,
                source     : payToken,
            } );
            // console.log( result );
            // save payment charge record
            const currentDocId = '',
                  duplicateDoc = false,
                  docNotUnique = false;
            // Call saveRecord method to create new or update existing record
            const logCharge    = saveRecord( 'Payments', result, currentDocId, duplicateDoc, docNotUnique, userToken );
            return {
                code   : 'success',
                resCode: 200,
                value  : result + logCharge.code
            };
        } catch( error ) {
            // console.log( error );
            // save payment error record
            const currentDocId = '',
                  duplicateDoc = false,
                  docNotUnique = false;
            // Call saveRecord method to create new or update existing record
            const logError     = saveRecord( 'Payments', error, currentDocId, duplicateDoc, docNotUnique, userToken );
            return {
                code   : 'chargeError',
                resCode: 401,
                value  : error + logError.code
            };
        }
    },
    chargeCustomerTest( payInfo, payToken, userToken = '' ) {
        try {
            check( payInfo, Object );
            check( payToken, String );
            check( userToken, String );
        } catch( error ) {
            return checkError( error );
        }

        const charge = Meteor.wrapAsync( stripeTest.charges.create, stripeTest.charges );

        try {
            const result = charge( {
                amount     : payInfo.amount,
                currency   : payInfo.currency,
                description: payInfo.description,
                source     : payToken,
            } );
            // console.log( result );
            // save payment charge record
            const currentDocId = '',
                  duplicateDoc = false,
                  docNotUnique = false;
            // Call saveRecord method to create new or update existing record
            const logCharge    = saveRecord( 'Payments', result, currentDocId, duplicateDoc, docNotUnique, userToken );
            return {
                code   : 'success',
                resCode: 200,
                value  : result + logCharge.code
            };
        } catch( error ) {
            // console.log( error );
            // save payment error record
            const currentDocId = '',
                  duplicateDoc = false,
                  docNotUnique = false;
            // Call saveRecord method to create new or update existing record
            const logError     = saveRecord( 'Payments', error, currentDocId, duplicateDoc, docNotUnique, userToken );
            return {
                code   : 'chargeError',
                resCode: 401,
                value  : error + logError.code
            };
        }

        // Charge the user's card:
        // const result = charge( {
        //     amount     : payInfo.amount,
        //     currency   : payInfo.currency,
        //     description: payInfo.description,
        //     source     : payToken,
        // }, function( err, charge ) {
        //     if( err ) {
        //         console.log( err );
        //         // save payment error record
        //         const currentDocId = '',
        //               duplicateDoc = false,
        //               docNotUnique = false;
        //         // Call saveRecord method to create new or update existing record
        //         const logError     = saveRecord( 'Payments', err, currentDocId, duplicateDoc, docNotUnique,
        // userToken ); return { code : 'chargeError', value: err + logError }; } console.log( charge ); // save
        // payment charge record const currentDocId = '', duplicateDoc = false, docNotUnique = false; // Call
        // saveRecord method to create new or update existing record const logCharge    = saveRecord( 'Payments',
        // charge, currentDocId, duplicateDoc, docNotUnique, userToken ); return { code : 'success', value: charge +
        // logCharge }; } ); console.log(charge); return result;
    },
    saveChargeCustomerLive( payInfo, payToken, token = '' ) {
        try {
            check( payInfo, Object );
            check( payToken, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // check if customer exists (ref: userToken / email), retrieve the customerInfo, and process payment
        const currentCustomer = Payments.findOne( { customerEmail: payInfo.email, recordType: 'customer-live' } );
        if( currentCustomer ) {
            // Create a Charge / Payment
            const payInfo = stripeChargeLive( payInfo, payToken, currentCustomer.customerInfo, token );

            // if payResult is successful, update trade-items-info & send email
            if( payResult.code === 'success' ) {
                const tradeResult = Meteor.call( 'updateTradeItems', payInfo.tradeParams, token );
                const tradeEmail  = Meteor.call( 'sendOrderEmail', payInfo.tradeParams.tradeOrderNumber, token ) || {};
                return [ payResult, tradeResult, tradeEmail ]
            }
            return [ payResult, {}, {} ];
        }

        // Create a Customer (for new paying customer only):
        const customer = stripeCustomerLive( payInfo, payToken, token );
        if( customer.code === 'customerError' ) {
            return customer;
        }
        // Create a Charge / Payment
        const payResult = stripeChargeLive( payInfo, payToken, customer, token );

        // if payResult is successful, update trade-items-info & send email
        if( payResult.code === 'success' ) {
            const tradeResult = Meteor.call( 'updateTradeItems', payInfo.tradeParams, token );
            const tradeEmail  = Meteor.call( 'sendOrderEmail', payInfo.tradeParams.tradeOrderNumber, token ) || {};
            return [ payResult, tradeResult, tradeEmail ]
        }
        return [ payResult, {}, {} ];
    },
    saveChargeCustomerTest( payInfo, payToken, token = '' ) {
        try {
            check( payInfo, Object );
            check( payToken, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // check if customer exists (ref: userToken / email), retrieve the customerInfo, and process payment
        const currentCustomer = Payments.findOne( { customerEmail: payInfo.email, recordType: 'customer-test' } );
        if( currentCustomer ) {
            // Create a Charge / Payment
            const payResult = stripeChargeTest( payInfo, payToken, currentCustomer.customerInfo, token );

            // if payResult is successful, update trade-items-info & send email
            if( payResult.code === 'success' ) {
                const tradeResult = Meteor.call( 'updateTradeItems', payInfo.tradeParams, token );
                const tradeEmail  = Meteor.call( 'sendOrderEmail', payInfo.tradeParams.tradeOrderNumber, token ) || {};
                return [ payResult, tradeResult, tradeEmail ]
            }
            return [ payResult, {}, {} ];
        }

        // Create a Customer (for new paying customer only):
        const customer = stripeCustomerTest( payInfo, payToken, token );
        if( customer.code === 'customerError' ) {
            return customer;
        }

        // console.log(currentCustomer, customer, 'checking1');
        // Create a Charge / Payment
        const payResult = stripeChargeTest( payInfo, payToken, customer, token );

        console.log( payResult );

        // if payResult is successful, update trade-items-info & send email
        if( payResult.code === 'success' ) {
            const tradeResult = Meteor.call( 'updateTradeItems', payInfo.tradeParams, token );
            const tradeEmail  = Meteor.call( 'sendOrderEmail', payInfo.tradeParams.tradeOrderNumber, token ) || {};
            return [ payResult, tradeResult, tradeEmail ]
        }
        return [ payResult, {}, {} ];
    },
    saveCashPayment( payInfo, token = '' ) {
        try {
            check( payInfo, Object );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        const result = {
            email        : payInfo.email,
            amount       : payInfo.amount,
            currency     : payInfo.currency,
            description  : payInfo.description,
            paymentStatus: 'Paid',
            metadata     : payInfo.metadata,
        };

        // Save cash-payment: insert permitted for payment, update permitted for refund - for audit-purposes
        const chargeParams = {
            recordType  : 'cash-payment',
            customerId  : payInfo.customerId,
            tradePayment: payInfo.tradePayment,
            orderNumber : payInfo.tradePayment.orderNumber,
            chargeInfo  : result,
        };
        const currentDocId = '',
              duplicateDoc = false,
              docNotUnique = false;
        // Call saveRecord method to create new or update existing record
        const payResult    = saveRecord( 'Payments', chargeParams, currentDocId, duplicateDoc, docNotUnique, token );
        // if payResult is successful, update trade-items-info & send email
        if( payResult.code === 'inserted' ) {
            const tradeResult = Meteor.call( 'updateTradeItems', payInfo.tradeParams, token );
            const tradeEmail  = Meteor.call( 'sendOrderEmail', payInfo.tradeParams.tradeOrderNumber, token ) || {};
            return [ payResult, tradeResult, tradeEmail ]
        }
        return [ payResult, {}, {} ];
    },
    getInvoice( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Invoices', { collParams, currentDocId, token } );
    },
    saveInvoice( payInfo, token = '' ) {
        try {
            check( payInfo, Object );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // enforce security: token / userId, prior to CRUD action
        let userId = Meteor.userId() || '';

        // Check authentication:
        if( !userId && !token ) {
            // no loginToken / userId, can't be authorized
            return unAuthorized();
        }

        // validate token access
        if( token ) {
            const tokenInfo = AccessKeys.findOne( { token: token } );
            if( tokenInfo ) {
                userId = tokenInfo.userId;
                if( Date.now() > parseInt( tokenInfo.expire ) ) {
                    // login token has expired, require login/new token
                    return tokenExpired();
                }
            }
        }

        const result = {
            email        : payInfo.email,
            amount       : payInfo.amount,
            currency     : payInfo.currency,
            description  : payInfo.description,
            paymentStatus: 'Invoice',
            metadata     : payInfo.metadata,
        };

        // Save invoice-payment: insert permitted for payment, update permitted for payment confirmation (cheque, pod,
        // wire...), cancellation and refund - for audit-purposes
        const chargeParams = {
            recordType  : 'invoice-payment',
            customerId  : payInfo.customerId,
            tradePayment: payInfo.tradePayment,
            orderNumber : payInfo.tradePayment.orderNumber,
            chargeInfo  : result,
        };
        // for new invoice-payment (insert only)
        let currentDocId   = '',
              duplicateDoc = false,
              docNotUnique = false;

        // Call saveRecord method to create new or update existing record
        const payResult = saveRecord( 'Payments', chargeParams, currentDocId, duplicateDoc, docNotUnique, token );

        // if payResult is successful, update trade-items-info & send email
        if( payResult.code === 'inserted' ) {
            const tradeResult = Meteor.call( 'updateTradeItems', payInfo.tradeParams, token );
            const tradeEmail  = Meteor.call( 'sendOrderEmail', payInfo.tradeParams.tradeOrderNumber, token ) || {};
            return [ payResult, tradeResult, tradeEmail ]
        }
        return [ payResult, {}, {} ];
    },
    removeInvoice( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Invoices', currentDocId, token );
    },
    saveTradePayment( payInfo, token = '' ) {
        // process and keep track of trades' payments (part or full) for invoice-payment methods (cheque, pod, wire,
        // credit-card, debit-card, cash etc.) by orderNumber.

        // console.log(payInfo);
        // validate input-parameters
        try {
            check( payInfo, {
                orderNumber: String,
                payAmount  : Number,
                payDesc    : String,
                payMethod  : String,
                payStatus  : String,
                payCurrency: String,
                payEmail   : String,
                isActive   : Boolean,
            } );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        let errors = validateTradePayment( payInfo );
        if( errors.orderNumber || errors.payStatus || errors.payMethod || errors.payAmount || errors.payDesc ) {
            return validateError( errors );
        }

        // enforce security: token / userId, prior to CRUD action
        let userId = Meteor.userId() || '';

        // Check authentication:
        if( !userId && !token ) {
            // no loginToken / userId, can't be authorized
            return unAuthorized();
        }

        // validate token access
        if( token ) {
            const tokenInfo = AccessKeys.findOne( { token: token } );
            if( tokenInfo ) {
                userId = tokenInfo.userId;
                if( Date.now() > parseInt( tokenInfo.expire ) ) {
                    // login token has expired, require login/new token
                    return tokenExpired();
                }
            }
        }

        // orderTotal cost
        const costInfo = Orders.findOne( { orderNumber: payInfo.orderNumber } );

        // Payment status-types:
        // Paid or Paid full => amountPaid === orderTotalCost(less discount?),
        // Paid part => amountPaid < orderTotalCost((less discount?),
        // Paid above?? => amountPaid > orderTotalCost(less discount?)
        // TODO: amount in 100 units, align with stripe payment (server side? remove from client-side)
        let payStatus       = payInfo.payStatus,
            amountPaid      = payInfo.payAmount,
            totalCost       = costInfo.orderPayment.tradeCostTotalPlusTax, // in $0.00
            priorAmountPaid = 0;

        // Determine priorAmountPaid by orderNumber from Payments
        // chargeInfo : { paymentStatus: { $or: [ "Paid", "Paid full", "Paid part", "Paid above"] } }
        const orderPayInfo = Payments.find( {
            recordType                : 'invoice-payment',
            orderNumber               : payInfo.orderNumber,
            "chargeInfo.paymentStatus": { $ne: 'Invoice' },
        } ).fetch();

        // console.log( orderPayInfo.length );

        if( orderPayInfo ) {
            if( orderPayInfo.length > 1 ) {
                orderPayInfo.forEach( ( item ) => {
                    "use strict";
                    priorAmountPaid += item.chargeInfo.amount;
                } );
            }
            if( orderPayInfo.length === 1 ) {
                priorAmountPaid += orderPayInfo[ '0' ].chargeInfo.amount;
            }
        }
        // Total amount paid, including prior part-payments, for the order, from server-side
        amountPaid = payInfo.payAmount + priorAmountPaid;

        // console.log( amountPaid );

        // Total order cost for the order, recorded in the Payments collection (server-side validation)
        const orderCostInfo = Payments.findOne( {
            recordType                : 'invoice-payment',
            'tradePayment.orderNumber': payInfo.orderNumber,
            'chargeInfo.paymentStatus': 'Invoice'
        } );

        // console.log( orderCostInfo.chargeInfo.amount );

        if( orderCostInfo ) {
            totalCost = orderCostInfo.chargeInfo.amount;
        }

        if( amountPaid === totalCost ) {
            payStatus = 'Paid full';
        }

        if( amountPaid < totalCost ) {
            payStatus = 'Paid part';
        }

        // optional/rare-step, return an alert to indicate over-payment, for refund or correction*
        if( amountPaid > totalCost ) {
            payStatus = 'Paid above';
            return {
                code : 'over-payment',
                value: `Over payment: cumulative/total payment (${amountPaid}) is greater than order cost (${totalCost}) - review payment`,
            }
        }

        const result = {
            email        : payInfo.payEmail,
            amount       : payInfo.payAmount,
            currency     : payInfo.payCurrency,
            description  : payInfo.payDesc,
            payMethod    : payInfo.payMethod,
            paymentStatus: payStatus,
        };

        // update payment details
        const chargeParams = {
            recordType : 'invoice-payment',
            orderNumber: payInfo.orderNumber,
            customerId : costInfo.orderOwner,
            chargeInfo : result,
        };
        // for new invoice-payment (insert only), for existing payment record, cancel/refund
        let currentDocId   = '',
              duplicateDoc = false,
              docNotUnique = false;

        // Call saveRecord method to create new or update existing record
        const payResult = saveRecord( 'Payments', chargeParams, currentDocId, duplicateDoc, docNotUnique, token );
        // return saveRecord( 'Payments', chargeParams, currentDocId, duplicateDoc, docNotUnique, token );
        if( payResult.code === 'inserted' || payResult.code === 'updated' ) {
            // send email and return email-sent status
            const tradeEmail = Meteor.call( 'sendPayEmail', orderNumber, payResult.docId, token );
            return [ payResult, tradeEmail ];
        }
        return [ payResult, {} ];
    },
    refundPayment( refundInfo, token = '' ) {
        // Refund payments for payments made, by orderNumber, part or full refund
        // Refund options: cancel/return order-items, discount/discretionary-basis

        // validate input parameters
        try {
            check( refundInfo, {
                orderNumber: String,
                amount     : Number,   // amount to refund
                currency   : String,
                method     : String,
                desc       : String,
            } );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // validate data items , checked also on the client side
        const errors = validateRefund( refundInfo );
        if( errors.orderNumber || errors.amount || errors.currency || errors.method || errors.desc ) {
            return validateError( errors );
        }

        // enforce security: token / userId, prior to CRUD action
        let userId = Meteor.userId() || '';

        // Check authentication:
        if( !userId && !token ) {
            // no loginToken / userId, can't be authorized
            return unAuthorized();
        }

        // validate token access
        if( token ) {
            const tokenInfo = AccessKeys.findOne( { token: token } );
            if( tokenInfo ) {
                userId = tokenInfo.userId;
                if( Date.now() > parseInt( tokenInfo.expire ) ) {
                    // login token has expired, require login/new token
                    return tokenExpired();
                }
            }
        }

        // Refund payment amount... keep records in Refunds collection (linked by orderNumber)
        // for new invoice-payment (insert only)
        const currentDocId = '';
        const duplicateDoc = false,
              docNotUnique = false;

        // Call saveRecord method to create new or update existing record
        const refundResult = saveRecord( 'Refunds', refundInfo, currentDocId, duplicateDoc, docNotUnique, token );
        if( refundResult.code === 'inserted' || refundResult.code === 'updated' ) {
            // send email and return email-sent status
            const tradeEmail = Meteor.call( 'sendRefundEmail', refundInfo.orderNumber, refundResult.docId, token );
            return [ refundResult, tradeEmail ];
        }
        return [ refundResult, {} ];
    },
    getReceipt( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Receipts', { collParams, currentDocId, token } );
    },
    saveReceipt( payInfo, userToken = '' ) {
        try {
            check( payInfo, Object );
            check( userToken, String );
        } catch( error ) {
            return checkError( error );
        }

        const result = {
            email        : payInfo.email,
            amount       : payInfo.amount,
            currency     : payInfo.currency,
            description  : payInfo.description,
            paymentStatus: 'Invoice',
            metadata     : payInfo.metadata,
        };

        // Save invoice-payment: insert permitted for payment, update permitted for payment confirmation (cheque, pod,
        // wire...) and refund - for audit-purposes
        const chargeParams = {
            recordType  : 'invoice-payment',
            customerId  : payInfo.customerId,
            tradePayment: payInfo.tradePayment,
            chargeInfo  : result,
        };
        // for new invoice-payment (insert only)
        let currentDocId   = '',
              duplicateDoc = false,
              docNotUnique = false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Payments', chargeParams, currentDocId, duplicateDoc, docNotUnique, userToken );
    },
    removeReceipt( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Receipts', currentDocId, token );
    },
} );
