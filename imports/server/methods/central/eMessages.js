/**
 * Created by saturnbay on 2017-09-17.
 * Email messages for trading activities: order, cancel, return, refund, reminder (wish / cart) etc.
 *
 */
// Import required module(s)
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';
import { mcLabel } from '/imports/lib/locales/getLabel';
import { mcMessage } from '/imports/lib/locales/getMessage';
import { mcConstant } from '/imports/lib/locales/getConstant';
import { utils } from '/imports/lib/utils/Utility';
import { Users, AccessKeys, Payments, Taxes, Refunds } from '/imports/collections/Central';
import { Orders } from '/imports/collections/Mpe';
import { Products } from '/imports/collections/Asset';
import orderMessage from './shared/email/orderMessage';
import { checkError, unAuthorized } from './shared/utils';
import _ from 'lodash';

const moment = require( 'moment' );

Meteor.methods( {
    sendOrderEmail( orderNumber, token = '' ) {
        // check all arguments.
        try {
            check( [ orderNumber, token ], [ String ] );
        } catch( error ) {
            return checkError( error );
        }

        // Determine userId from token
        let userId;
        if( token ) {
            userId = AccessKeys.findOne( { token: token } ).userId || '';
        } else {
            userId = this.userId || '';
        }

        // HTML-data
        let mailData = {};

        // Send item-email
        try {
            if( userId ) {
                // Get order-info: trade / owner-buyer / seller (from... mConstants)...
                const order              = Orders.findOne( { orderNumber: orderNumber } );
                // trade-parameters
                let tradeParams          = order.orderPayment;
                tradeParams.tradeTaxName = tradeParams.tradeTaxName || 'Sales Tax';

                // order-currency
                const tradeCurrency   = order.orderPayment.tradeCurrency;
                const stateShipName   = utils.stateName( order.orderPayment.tradeShipAddress.addressState );
                const countryShipName = utils.countryName( order.orderPayment.tradeShipAddress.addressCountry );
                const statePayName    = utils.stateName( order.orderPayment.tradePayAddress.addressState );
                const countryPayName  = utils.countryName( order.orderPayment.tradePayAddress.addressCountry );

                // order-items, include productName, shortDesc, formatted product-cost...
                const orderItems = order.orderItems.map( item => {
                    const prod = Products.findOne( { _id: item.productId } );
                    _.extend( item, {
                        productName     : prod.productName,
                        shortProductDesc: utils.shortString( prod.productDesc, mcConstant.getShortDesc() ),
                    } );
                    item.productCost = !item.productId ? `${tradeCurrency}${utils.formatNum( item.productCost )}` : `${tradeCurrency}${utils.productCost( item.productId )}`;
                    return item;
                } );

                // format (0.00) tradeParams cost-info
                tradeParams.tradeCost             = utils.formatNum( tradeParams.tradeCost );
                tradeParams.tradeShipCost         = utils.formatNum( tradeParams.tradeShipCost );
                tradeParams.tradeShipCostTax      = utils.formatNum( tradeParams.tradeShipCostTax );
                tradeParams.tradeCostTax          = utils.formatNum( tradeParams.tradeCostTax );
                tradeParams.tradeTotalCost        = utils.formatNum( tradeParams.tradeTotalCost );
                tradeParams.tradeTotalCostTax     = utils.formatNum( tradeParams.tradeTotalCostTax );
                tradeParams.tradeCostTotalPlusTax = utils.formatNum( tradeParams.tradeCostTotalPlusTax );

                const userInfo    = Users.findOne( { _id: order.orderOwner } );
                const userProfile = userInfo.profile || '';

                // Compile Email template
                SSR.compileTemplate( 'htmlEmail', Assets.getText( 'orderMessage.html' ) );

                // console.log('got here 1');

                mailData = {
                    mcLabel,
                    tradeParams,
                    tradeCurrency,
                    stateShipName,
                    countryShipName,
                    statePayName,
                    countryPayName,
                    orderItems,
                    userProfile,
                    orderNumber,
                    orderDate: moment( order.createdDate ).format( 'LLLL' ),
                };

                // console.log( SSR.render( 'htmlEmail', mailData ) );

                // TODO: comment this line after sandbox/testing
                const toEmailAddress = 'abbeya1@yahoo.com';

                // TODO: uncomment for test/uat/prod, determine sending (from) userEmail address
                // const userInfo = Users.findOne( { _id: order.orderOwner } );
                // const toEmailAddress = userInfo.emails[ '0' ].address;

                // send email
                const to      = toEmailAddress,
                      from    = 'mConnect [suppport@saturnbay.net]',
                      subject = `${mcMessage.orderMsgSubject} [${orderNumber} - ${moment( order.createdDate ).format( 'LLLL' )}]`,
                      html    = SSR.render( 'htmlEmail', mailData );
                Email.send( { to, from, subject, html } );
                return {
                    code   : 'success',
                    resCode: 200,
                    value  : `Order Email (message) sent, successfully: from ${from} to ${to}`,
                }
            } else {
                return unAuthorized();
            }
        } catch( error ) {
            return {
                code   : error.code,
                resCode: 406,
                value  : JSON.stringify( error ),
            };
        }
    },
    sendPayEmail( orderNumber, payId = '', token = '' ) {
        /**
         * Info: order- #/orderTotal(+tax)/billingAddress?, payment - amountPaid(payAmount), totalPaid, payMethod,
         * payDate, amountDue...
         * */
        // check all arguments.
        try {
            check( [ orderNumber, payId, token ], [ String ] );
        } catch( error ) {
            return checkError( error );
        }

        // Determine userId from token
        let userId;
        if( token ) {
            userId = AccessKeys.findOne( { token: token } ).userId || '';
        } else {
            userId = this.userId || '';
        }

        // hmtl data
        let mailData = {};

        // Send item-email
        try {
            if( userId ) {
                // Get order-info: trade / owner-buyer / seller (from... mConstants)...
                const order              = Orders.findOne( { orderNumber: orderNumber } );
                // Get current payment-info:
                const payInfo            = Payments.findOne( { _id: payId } );
                // trade-parameters
                let tradeParams          = order.orderPayment;
                tradeParams.tradeTaxName = tradeParams.tradeTaxName || 'Sales Tax';

                // order-currency
                const tradeCurrency   = order.orderPayment.tradeCurrency;
                const stateShipName   = utils.stateName( order.orderPayment.tradeShipAddress.addressState );
                const countryShipName = utils.countryName( order.orderPayment.tradeShipAddress.addressCountry );
                const statePayName    = utils.stateName( order.orderPayment.tradePayAddress.addressState );
                const countryPayName  = utils.countryName( order.orderPayment.tradePayAddress.addressCountry );

                // order-items, include productName, shortDesc, formatted product-cost...
                const orderItems = order.orderItems.map( item => {
                    const prod = Products.findOne( { _id: item.productId } );
                    _.extend( item, {
                        productName     : prod.productName,
                        shortProductDesc: utils.shortString( prod.productDesc, mcConstant.getShortDesc() ),
                    } );
                    item.productCost = !item.productId ? `${tradeCurrency}${utils.formatNum( item.productCost )}` : `${tradeCurrency}${utils.productCost( item.productId )}`;
                    return item;
                } );

                // format (0.00) tradeParams cost-info
                tradeParams.tradeCost             = utils.formatNum( tradeParams.tradeCost );
                tradeParams.tradeShipCost         = utils.formatNum( tradeParams.tradeShipCost );
                tradeParams.tradeShipCostTax      = utils.formatNum( tradeParams.tradeShipCostTax );
                tradeParams.tradeCostTax          = utils.formatNum( tradeParams.tradeCostTax );
                tradeParams.tradeTotalCost        = utils.formatNum( tradeParams.tradeTotalCost );
                tradeParams.tradeTotalCostTax     = utils.formatNum( tradeParams.tradeTotalCostTax );
                tradeParams.tradeCostTotalPlusTax = utils.formatNum( tradeParams.tradeCostTotalPlusTax );

                // order-payment
                // payment-amounts in 100 units:
                let payStatus       = payInfo.chargeInfo.paymentStatus,
                    amountPaid      = payInfo.chargeInfo.amount,
                    priorAmountPaid = 0.00,
                    refundPaid      = 0.00;

                // Determine amount already refunded | account for refund-paid, if any
                const refundInfo = Refunds.find( { orderNumber: orderNumber } );

                if( refundInfo ) {
                    refundInfo.forEach( ( refund ) => {
                        refundPaid += refund.amount;
                    } );
                }

                // Determine priorAmountPaid by orderNumber from Payments
                // chargeInfo : { paymentStatus: { $or: [ "Paid", "Paid full", "Paid part", "Paid above"] } }
                const orderPayInfo = Payments.find( {
                    recordType                : 'invoice-payment',
                    orderNumber               : orderNumber,
                    "chargeInfo.paymentStatus": { $ne: 'Invoice' },
                } ).fetch();

                if( orderPayInfo ) {
                    // reset amountPaid, for part-payments-total (invoice order)
                    amountPaid = 0.00;
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
                amountPaid += priorAmountPaid;

                // user-info
                const userInfo    = Users.findOne( { _id: order.orderOwner } );
                const userProfile = userInfo.profile || '';

                // Compile Email template
                SSR.compileTemplate( 'htmlEmail', Assets.getText( 'payMessage.html' ) );

                // console.log('got here 1');

                mailData = {
                    mcLabel,
                    tradeParams,
                    tradeCurrency,
                    stateShipName,
                    countryShipName,
                    statePayName,
                    countryPayName,
                    orderItems,
                    userProfile,
                    refundPaid: utils.formatNum( refundPaid / 100 ),
                    currentPay: utils.formatNum( payInfo.chargeInfo.amount / 100 ),
                    payDate   : moment( payInfo.createdDate ).format( 'LLLL' ),
                    totalPaid : utils.formatNum( amountPaid / 100 ),
                    amountDue : utils.formatNum( tradeParams.tradeCostTotalPlusTax - (amountPaid / 100) - (refundPaid / 100) ),
                    payStatus,
                    payMethod : payInfo.chargeInfo.payMethod,
                    orderNumber,
                    orderDate : moment( order.createdDate ).format( 'LLLL' ),
                };

                // console.log( SSR.render( 'htmlEmail', mailData ) );

                // TODO: comment this line after sandbox/testing
                const toEmailAddress = 'abbeya1@yahoo.com';

                // TODO: uncomment for test/uat/prod, determine sending (from) userEmail address
                // const userInfo = Users.findOne( { _id: order.orderOwner } );
                // const toEmailAddress = userInfo.emails[ '0' ].address;

                // send email
                const to      = toEmailAddress,
                      from    = 'mConnect [suppport@saturnbay.net]',
                      subject = `${mcMessage.payMsgSubject} [${orderNumber} - ${moment( payInfo.createdDate ).format( 'LLLL' )}]`,
                      html    = SSR.render( 'htmlEmail', mailData );
                Email.send( { to, from, subject, html } );
                return {
                    code   : 'success',
                    resCode: 200,
                    value  : `Order Payment Email (message) sent, successfully: from ${from} to ${to}`,
                }
            } else {
                return unAuthorized();
            }
        } catch( error ) {
            return {
                code   : error.code,
                resCode: 406,
                value  : JSON.stringify( error ),
            };
        }
    },
    sendShipEmail( shipParams, shipId, token = '' ) {
        /**
         * Info: order, shipAddress, billingAddress, orderSummary(cost), productShipped, shipMethod, trackNo?,
         * shipCarrier, shipDate, estDeliveryDate/Days...
         * */
        // check all arguments.
        try {
            check( shipParams, Object );
            check( [ shipId, token ], [ String ] );
        } catch( error ) {
            return checkError( error );
        }

        // Determine userId from token
        let userId;
        if( token ) {
            userId = AccessKeys.findOne( { token: token } ).userId || '';
        } else {
            userId = this.userId || '';
        }

        // initialize mail-data
        let mailData = {};

        // Send item-email
        try {
            if( userId ) {
                // Get order-info: trade / owner-buyer / seller (from... mConstants)...
                const order              = Orders.findOne( { orderNumber: shipParams.shipOrder } );
                // trade-parameters
                let tradeParams          = order.orderPayment;
                tradeParams.tradeTaxName = tradeParams.tradeTaxName || 'Sales Tax';

                // order-currency
                const tradeCurrency   = order.orderPayment.tradeCurrency;
                const stateShipName   = utils.stateName( order.orderPayment.tradeShipAddress.addressState );
                const countryShipName = utils.countryName( order.orderPayment.tradeShipAddress.addressCountry );
                const statePayName    = utils.stateName( order.orderPayment.tradePayAddress.addressState );
                const countryPayName  = utils.countryName( order.orderPayment.tradePayAddress.addressCountry );

                // order-items, include productName, shortDesc, formatted product-cost...
                const orderItems = order.orderItems.map( item => {
                    const prod = Products.findOne( { _id: item.productId } );
                    _.extend( item, {
                        productName     : prod.productName,
                        shortProductDesc: utils.shortString( prod.productDesc, mcConstant.getShortDesc() ),
                    } );
                    // translate number into label to email-template
                    item.productCost = item.productId ? `${tradeCurrency}${utils.formatNum( item.productCost )}` : `${tradeCurrency}${utils.productCost( item.productId )}`;
                    return item;
                } );

                // shipped items
                const shipItems = shipParams.shipItems.map( item => {
                    const shipItem       = order.orderItems.find( oitem => {
                        return oitem.productId === item.productId;
                    } );
                    const prod = Products.findOne( { _id: item.productId } );
                    // translate number into label to email-template
                    shipItem.productCost = shipItem.productId ? `${tradeCurrency}${utils.formatNum( shipItem.productCost )}` : `${tradeCurrency}${utils.productCost( shipItem.productId )}`;

                    item = _.extend( item, {
                        productCost     : shipItem.productCost,
                        productName     : shipItem.productName,
                        shortProductDesc: utils.shortString( prod.productDesc, mcConstant.getShortDesc() )
                    } );

                    return item;
                } );

                // format (0.00) tradeParams cost-info
                tradeParams.tradeCost             = utils.formatNum( tradeParams.tradeCost );
                tradeParams.tradeShipCost         = utils.formatNum( tradeParams.tradeShipCost );
                tradeParams.tradeShipCostTax      = utils.formatNum( tradeParams.tradeShipCostTax );
                tradeParams.tradeCostTax          = utils.formatNum( tradeParams.tradeCostTax );
                tradeParams.tradeTotalCost        = utils.formatNum( tradeParams.tradeTotalCost );
                tradeParams.tradeTotalCostTax     = utils.formatNum( tradeParams.tradeTotalCostTax );
                tradeParams.tradeCostTotalPlusTax = utils.formatNum( tradeParams.tradeCostTotalPlusTax );

                const userInfo    = Users.findOne( { _id: order.orderOwner } );
                const userProfile = userInfo.profile || '';

                // Compile Email template
                SSR.compileTemplate( 'htmlEmail', Assets.getText( 'shipMessage.html' ) );

                mailData = {
                    mcLabel,
                    tradeParams,
                    tradeCurrency,
                    stateShipName,
                    countryShipName,
                    statePayName,
                    countryPayName,
                    orderItems,
                    shipItems,
                    shipParams,
                    userProfile,
                    orderDate: moment( order.createdDate ).format( 'LLLL' ),
                    shipDate : moment( shipParams.shipDate ).format( 'LLLL' ),
                };

                // console.log( SSR.render( 'htmlEmail', mailData ) );

                // TODO: comment this line after sandbox/testing
                const toEmailAddress = 'abbeya1@yahoo.com';

                // TODO: uncomment for test/uat/prod, determine sending (from) userEmail address
                // const userInfo = Users.findOne( { _id: order.orderOwner } );
                // const toEmailAddress = userInfo.emails[ '0' ].address;

                // send email
                const to      = toEmailAddress,
                      from    = 'mConnect [suppport@saturnbay.net]',
                      subject = `${mcMessage.shipMsgSubject} [${shipParams.shipOrder} - ${moment( shipParams.shipDate ).format( 'LLLL' )}]`,
                      html    = SSR.render( 'htmlEmail', mailData );

                Email.send( { to, from, subject, html } );

                return {
                    code   : 'success',
                    resCode: 200,
                    value  : `Ship Email (message) sent, successfully: from ${from} to ${to}`,
                }
            } else {
                return unAuthorized();
            }
        } catch( error ) {
            return {
                code   : 'error',
                resCode: 406,
                value  : JSON.stringify( error ) + 'Error sending email',
            };
        }
    },
    sendCancelEmail( orderNumber, cancelType = '', token = '' ) {
        /**
         * Info: order- #/orderTotal(+tax)/billingAddress?, cancel - type(order/item)/order-items, refundDue, cancelDate
         * */
        // check all arguments.
        try {
            check( [ orderNumber, cancelType, token ], [ String ] );
        } catch( error ) {
            return checkError( error );
        }

        // Determine userId from token
        let userId;
        if( token ) {
            userId = AccessKeys.findOne( { token: token } ).userId || '';
        } else {
            userId = this.userId || '';
        }

        // hmtl data
        let mailData = {};

        // Send item-email
        try {
            if( userId ) {
                // Get order-info: trade / owner-buyer / seller (from... mConstants)...
                const order = Orders.findOne( { orderNumber: orderNumber } );

                // trade-parameters
                let tradeParams          = order.orderPayment;
                tradeParams.tradeTaxName = tradeParams.tradeTaxName || 'Sales Tax';

                // order-currency
                const tradeCurrency   = order.orderPayment.tradeCurrency;
                const stateShipName   = utils.stateName( order.orderPayment.tradeShipAddress.addressState );
                const countryShipName = utils.countryName( order.orderPayment.tradeShipAddress.addressCountry );
                const statePayName    = utils.stateName( order.orderPayment.tradePayAddress.addressState );
                const countryPayName  = utils.countryName( order.orderPayment.tradePayAddress.addressCountry );

                // order-items, include productName, shortDesc, formatted product-cost...
                const orderItems = order.orderItems.map( item => {
                    const prod = Products.findOne( { _id: item.productId } );
                    _.extend( item, {
                        productName     : prod.productName,
                        shortProductDesc: utils.shortString( prod.productDesc, mcConstant.getShortDesc() ),
                        tradeCurrency,
                    } );
                    item.productCost = !item.productId ? utils.formatNum( item.productCost ) : utils.productCost( item.productId );
                    return item;
                } );

                // format (0.00) tradeParams cost-info
                tradeParams.tradeCost             = utils.formatNum( tradeParams.tradeCost );
                tradeParams.tradeShipCost         = utils.formatNum( tradeParams.tradeShipCost );
                tradeParams.tradeShipCostTax      = utils.formatNum( tradeParams.tradeShipCostTax );
                tradeParams.tradeCostTax          = utils.formatNum( tradeParams.tradeCostTax );
                tradeParams.tradeTotalCost        = utils.formatNum( tradeParams.tradeTotalCost );
                tradeParams.tradeTotalCostTax     = utils.formatNum( tradeParams.tradeTotalCostTax );
                tradeParams.tradeCostTotalPlusTax = utils.formatNum( tradeParams.tradeCostTotalPlusTax );

                // order-payment
                // Get payment-info for fully paid order (non-invoice order) |TODO: review need here
                const payInfo         = Payments.findOne( {
                    'tradePayment.orderNumber': orderNumber,
                    recordType                : { $ne: 'invoice-payment' },
                } );
                // payment-amounts in 100 units
                let amountPaid        = payInfo ? payInfo.chargeInfo.amount : 0.00,
                      priorAmountPaid = 0.00,
                      refundPaid      = 0.00;

                // Determine amount already refunded | account for refund-paid, if any
                const refundInfo = Refunds.find( { orderNumber: orderNumber } );

                if( refundInfo ) {
                    refundInfo.forEach( ( refund ) => {
                        refundPaid += refund.amount;
                    } );
                }

                // Get payment-info for partly paid order (invoice order):
                const orderPayInfo = Payments.find( {
                    recordType                : 'invoice-payment',
                    orderNumber               : orderNumber,
                    "chargeInfo.paymentStatus": { $ne: 'Invoice' },
                } ).fetch();

                if( orderPayInfo ) {
                    // reset amountPaid, for part-payments-total (invoice order)
                    amountPaid = 0.00;
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
                amountPaid += priorAmountPaid;

                // set tax rate
                let taxName = 'Sale Tax',
                    taxRate = tradeParams.tradeTax ? tradeParams.tradeTax.taxAmount : 0,
                    taxUnit = tradeParams.tradeTax ? tradeParams.tradeTax.taxUnit : '%';

                // determine pre-set tax rates by buyer's/shipTo address/taxLocation, taxiJuri (State*) and taxCat
                // (Sales*), productTax?, productTaxExempt? TODO: settings, include the taxiJuri for the seller
                // (default: 'State')
                const taxJuri        = 'State',
                      shipToLocation = tradeParams.tradeShipAddress.addressState;

                // determine taxName and taxRate (%*, fixed, range) by taxLocation = ShipToLocation, taxiJuri = 'State'
                // or as set/defined
                const taxInfo = Taxes.findOne( {
                    taxJuri: taxJuri, taxLocation: shipToLocation, taxCat: 'Sales Tax'
                } );
                if( taxInfo ) {
                    taxName = taxInfo.taxName;
                    taxRate = taxInfo.taxAmount;
                    taxUnit = taxInfo.taxUnit;
                }

                // calculate cancelRefund due based on cancelled order or order-items & refundPaid
                let cancelAmount   = 0.00,
                    cancelRefund   = 0.00,
                    amountDue      = tradeParams.tradeCostTotalPlusTax * 100 - amountPaid - refundPaid,
                    cancelledItems = [],
                    cancelDate     = new Date();

                if( order.isCancel ) {
                    // cancel the whole order (all-items)
                    cancelAmount   = tradeParams.tradeCostTotalPlusTax * 100;
                    amountDue      = 0.00;
                    cancelType     = mcMessage.cancelTypeOrder;
                    cancelledItems = order.orderItems;
                    cancelDate     = order.cancelledDate ? order.cancelledDate : new Date();
                } else {
                    // calculate based on cancelled order-items (partial)
                    orderItems.forEach( item => {
                        if( item.isCancel ) {
                            cancelAmount += (item.productCost * item.productQtyCancel * 100);
                            cancelType = mcMessage.cancelTypeItem;
                            cancelDate = item.cancelledDate ? item.cancelledDate : new Date();
                            // add cancelled-item
                            cancelledItems.push( {
                                productId       : item.productId,
                                productName     : item.productName,
                                shortProductDesc: item.shortProductDesc,
                                productQty      : item.productQty,
                                productCost     : item.productCost,
                                productQtyCancel: item.productQtyCancel,
                                isCancel        : item.isCancel,
                                tradeCurrency,
                            } );
                            // TODO: apply shipping-cost portion to the cancelAmount - if/if-not shipped
                            // assumed non-shipped order
                            cancelAmount += tradeParams.tradeShipCostTax * 100;
                        }
                    } );
                    // Apply Sales tax to cancelAmount
                    if( taxUnit === '%' ) {
                        cancelAmount += cancelAmount * taxRate / 100;
                    }
                    if( taxUnit === '#' ) {
                        cancelAmount += taxRate;
                    }
                }

                // account for amountPaid and refundPaid (payments made and refunds processed)
                // convert tradeCostTotalPlusTax to 100 units
                const tradeTotalCost = tradeParams.tradeCostTotalPlusTax * 100;
                if( cancelAmount > tradeTotalCost ) {
                    return {
                        code   : 'overflow',
                        resCode: 401,
                        value  : `return-amount($) cannot be greater than total order-cost($)`,
                    }
                }
                if( (amountPaid - refundPaid) === (tradeTotalCost - cancelAmount) ) {
                    amountDue    = 0.00;
                    cancelRefund = 0.00;
                }
                if( (amountPaid - refundPaid) < (tradeTotalCost - cancelAmount) ) {
                    amountDue    = (tradeTotalCost - cancelAmount) - (amountPaid - refundPaid);
                    cancelRefund = 0.0;
                }
                if( (amountPaid - refundPaid) > (tradeTotalCost - cancelAmount) ) {
                    amountDue    = 0.00;
                    cancelRefund = (amountPaid - refundPaid) - (tradeTotalCost - cancelAmount);
                }

                // user-info
                const userInfo    = Users.findOne( { _id: order.orderOwner } );
                const userProfile = userInfo.profile || '';

                // Compile Email template
                SSR.compileTemplate( 'htmlEmail', Assets.getText( 'cancelMessage.html' ) );

                mailData = {
                    mcLabel,
                    tradeParams,
                    tradeCurrency,
                    stateShipName,
                    countryShipName,
                    statePayName,
                    countryPayName,
                    orderItems,
                    cancelledItems,
                    userProfile,
                    refundPaid  : utils.formatNum( refundPaid / 100 ),
                    amountPaid  : utils.formatNum( amountPaid / 100 ),
                    cancelDate  : moment( cancelDate ).format( 'LLLL' ),
                    amountDue   : utils.formatNum( amountDue / 100 ),
                    cancelType  : cancelType,
                    cancelRefund: utils.formatNum( cancelRefund / 100 ),
                    orderNumber,
                    orderDate   : moment( order.createdDate ).format( 'LLLL' ),
                };

                // console.log( tradeParams.tradeCostTotalPlusTax, mailData.amountPaid, mailData.cancelRefund,
                //     mailData.amountDue );
                // return;

                // console.log( SSR.render( 'htmlEmail', mailData ) );

                // TODO: comment this line after sandbox/testing
                const toEmailAddress = 'abbeya1@yahoo.com';

                // TODO: uncomment for test/uat/prod, determine sending (from) userEmail address
                // const userInfo = Users.findOne( { _id: order.orderOwner } );
                // const toEmailAddress = userInfo.emails[ '0' ].address;

                // send email
                const to      = toEmailAddress,
                      from    = 'mConnect [suppport@saturnbay.net]',
                      subject = `${mcMessage.cancelMsgSubject} [${orderNumber} - ${mailData.cancelDate}]`,
                      html    = SSR.render( 'htmlEmail', mailData );
                Email.send( { to, from, subject, html } );
                return {
                    code   : 'success',
                    resCode: 200,
                    value  : `Cancel Email (message) sent, successfully: from ${from} to ${to}`,
                }
            } else {
                return unAuthorized();
            }
        } catch( error ) {
            return {
                code   : error.code,
                resCode: 406,
                value  : JSON.stringify( error ),
            };
        }
    },
    sendReturnEmail( orderNumber, token = '' ) {
        /**
         * Info: order, orderSummary(cost), returnItem(s), returnDate, returnAmount (for refund)
         * */
        // check all arguments.
        try {
            check( [ orderNumber, token ], [ String ] );
        } catch( error ) {
            return checkError( error );
        }

        // Determine userId from token
        let userId;
        if( token ) {
            userId = AccessKeys.findOne( { token: token } ).userId || '';
        } else {
            userId = this.userId || '';
        }

        // hmtl data
        let mailData = {};

        // Send item-email
        try {
            if( userId ) {
                // Get order-info: trade / owner-buyer / seller (from... mConstants)...
                const order = Orders.findOne( { orderNumber: orderNumber } );

                // trade-parameters
                let tradeParams          = order.orderPayment;
                tradeParams.tradeTaxName = tradeParams.tradeTaxName || 'Sales Tax';

                // order-currency
                const tradeCurrency   = order.orderPayment.tradeCurrency;
                const stateShipName   = utils.stateName( order.orderPayment.tradeShipAddress.addressState );
                const countryShipName = utils.countryName( order.orderPayment.tradeShipAddress.addressCountry );
                const statePayName    = utils.stateName( order.orderPayment.tradePayAddress.addressState );
                const countryPayName  = utils.countryName( order.orderPayment.tradePayAddress.addressCountry );

                // order-items, include productName, shortDesc, formatted product-cost...
                const orderItems = order.orderItems.map( item => {
                    const prod = Products.findOne( { _id: item.productId } );
                    _.extend( item, {
                        productName     : prod.productName,
                        shortProductDesc: utils.shortString( prod.productDesc, mcConstant.getShortDesc() ),
                        tradeCurrency,
                    } );
                    item.productCost = !item.productId ? utils.formatNum( item.productCost ) : utils.productCost( item.productId );
                    return item;
                } );

                // format (0.00) tradeParams cost-info
                tradeParams.tradeCost             = utils.formatNum( tradeParams.tradeCost );
                tradeParams.tradeShipCost         = utils.formatNum( tradeParams.tradeShipCost );
                tradeParams.tradeShipCostTax      = utils.formatNum( tradeParams.tradeShipCostTax );
                tradeParams.tradeCostTax          = utils.formatNum( tradeParams.tradeCostTax );
                tradeParams.tradeTotalCost        = utils.formatNum( tradeParams.tradeTotalCost );
                tradeParams.tradeTotalCostTax     = utils.formatNum( tradeParams.tradeTotalCostTax );
                tradeParams.tradeCostTotalPlusTax = utils.formatNum( tradeParams.tradeCostTotalPlusTax );

                // order-payment
                // Get payment-info for fully paid order (non-invoice order):
                const payInfo         = Payments.findOne( {
                    'tradePayment.orderNumber': orderNumber,
                    recordType                : { $ne: 'invoice-payment' },
                } );
                // payment-amounts in 100 units
                let amountPaid        = payInfo ? payInfo.chargeInfo.amount : 0.00,
                      priorAmountPaid = 0.00,
                      refundPaid      = 0.00;

                // Determine amount already refunded | account for refund-paid, if any
                const refundInfo = Refunds.find( { orderNumber: orderNumber } );

                if( refundInfo ) {
                    refundInfo.forEach( ( refund ) => {
                        refundPaid += refund.amount;
                    } );
                }

                // Get payment-info for partly paid order (invoice order):
                const orderPayInfo = Payments.find( {
                    recordType                : 'invoice-payment',
                    orderNumber               : orderNumber,
                    "chargeInfo.paymentStatus": { $ne: 'Invoice' },
                } ).fetch();

                if( orderPayInfo ) {
                    // reset amountPaid, for part-payments-total (invoice order)
                    amountPaid = 0; // 100 units
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
                amountPaid += priorAmountPaid;

                // set tax rate
                let taxName = 'Sale Tax',
                    taxRate = tradeParams.tradeTax ? tradeParams.tradeTax.taxAmount : 0,
                    taxUnit = tradeParams.tradeTax ? tradeParams.tradeTax.taxUnit : '%';

                // determine pre-set tax rates by buyer's/shipTo address/taxLocation, taxiJuri (State*) and taxCat
                // (Sales*), productTax?, productTaxExempt? TODO: settings, include the taxiJuri for the seller
                // (default: 'State')
                const taxJuri        = 'State',
                      shipToLocation = tradeParams.tradeShipAddress.addressState;

                // determine taxName and taxRate (%*, fixed, range) by taxLocation = ShipToLocation, taxiJuri = 'State'
                // or as set/defined
                const taxInfo = Taxes.findOne( {
                    taxJuri: taxJuri, taxLocation: shipToLocation, taxCat: 'Sales Tax'
                } );
                if( taxInfo ) {
                    taxName = taxInfo.taxName;
                    taxRate = taxInfo.taxAmount;
                    taxUnit = taxInfo.taxUnit;
                }

                // calculate cancelRefund due based on cancelled order or order-items
                // cancelAmount   = tradeParams.tradeCostTotalPlusTax * 100;
                // cancelRefund   = amountPaid - refundPaid;
                // amountDue      = 0.00;

                let returnAmount  = 0.00,
                    returnRefund  = 0.00,
                    amountDue     = tradeParams.tradeCostTotalPlusTax * 100 - amountPaid - refundPaid,
                    returnedItems = [],
                    returnDate    = new Date();

                if( !_.isEmpty( orderItems ) ) {
                    // calculate based on returned order-items
                    orderItems.forEach( item => {
                        if( item.isReturn ) {
                            returnAmount += (item.productCost * item.productQtyReturn * 100);
                            returnDate = item.returnedDate ? item.returnedDate : new Date();
                            // add cancelled-item
                            returnedItems.push( {
                                productId       : item.productId,
                                productName     : item.productName,
                                shortProductDesc: item.shortProductDesc,
                                productQty      : item.productQty,
                                productCost     : item.productCost,
                                productQtyCancel: item.productQtyCancel,
                                tradeCurrency,
                            } );
                        }
                    } );
                    // Apply Sales tax to cancelRefund
                    if( taxUnit === '%' ) {
                        returnAmount += (returnAmount * taxRate / 100);
                    }
                    if( taxUnit === '#' ) {
                        returnAmount += taxRate;
                    }
                    // TODO: apply shipping-cost portion to the returnAmount - optional for returns

                    // account for amountPaid and refundPaid (payments made and refunds processed)
                    // convert tradeCostTotalPlusTax to 100 units
                    const tradeTotalCost = tradeParams.tradeCostTotalPlusTax * 100;
                    if( returnAmount > tradeTotalCost ) {
                        return {
                            code   : 'overflow',
                            resCode: 401,
                            value  : `return-amount($) cannot be greater than total order-cost($)`,
                        }
                    }
                    if( (amountPaid - refundPaid) === (tradeTotalCost - returnAmount) ) {
                        amountDue    = 0.00;
                        returnRefund = 0.00;
                    }
                    if( (amountPaid - refundPaid) < (tradeTotalCost - returnAmount) ) {
                        amountDue    = (tradeTotalCost - returnAmount) - (amountPaid - refundPaid);
                        returnRefund = 0.0;
                    }
                    if( (amountPaid - refundPaid) > (tradeTotalCost - returnAmount) ) {
                        amountDue    = 0.00;
                        returnRefund = (amountPaid - refundPaid) - (tradeTotalCost - returnAmount);
                    }
                }

                // console.log( 'test-1', amountPaid, returnAmount, returnRefund, amountDue );

                // user-info
                const userInfo    = Users.findOne( { _id: order.orderOwner } );
                const userProfile = userInfo.profile || '';

                // Compile Email template
                SSR.compileTemplate( 'htmlEmail', Assets.getText( 'returnMessage.html' ) );

                mailData = {
                    mcLabel,
                    tradeParams,
                    tradeCurrency,
                    stateShipName,
                    countryShipName,
                    statePayName,
                    countryPayName,
                    orderItems,
                    returnedItems,
                    userProfile,
                    refundPaid  : utils.formatNum( refundPaid / 100 ),
                    amountPaid  : utils.formatNum( amountPaid / 100 ),
                    returnDate  : moment( returnDate ).format( 'LLLL' ),
                    amountDue   : utils.formatNum( amountDue / 100 ),
                    returnRefund: utils.formatNum( returnRefund / 100 ),
                    orderNumber,
                    orderDate   : moment( order.createdDate ).format( 'LLLL' ),
                };

                // console.log( tradeParams.tradeCostTotalPlusTax, mailData.amountPaid, mailData.returnRefund,
                //     mailData.amountDue );
                // return;

                // console.log( SSR.render( 'htmlEmail', mailData ) );

                // TODO: comment this line after sandbox/testing
                const toEmailAddress = 'abbeya1@yahoo.com';

                // TODO: uncomment for test/uat/prod, determine sending (from) userEmail address
                // const userInfo = Users.findOne( { _id: order.orderOwner } );
                // const toEmailAddress = userInfo.emails[ '0' ].address;

                // send email
                const to      = toEmailAddress,
                      from    = 'mConnect [suppport@saturnbay.net]',
                      subject = `${mcMessage.returnMsgSubject} [${orderNumber} - ${mailData.returnDate}]`,
                      html    = SSR.render( 'htmlEmail', mailData );
                Email.send( { to, from, subject, html } );
                return {
                    code   : 'success',
                    resCode: 200,
                    value  : `Returns Email (message) sent, successfully: from ${from} to ${to}`,
                }
            } else {
                return unAuthorized();
            }
        } catch( error ) {
            return {
                code   : error.code,
                resCode: 406,
                value  : JSON.stringify( error ),
            };
        }
    },
    sendRefundEmail( orderNumber, refundId, token = '' ) {
        /**
         * Info: order, orderSummary(cost), refundDue, refundAmount, refundMethod, refundDate, refundBalance - for
         * cancelled order/order-items and/or returned items
         * */
        // check all arguments.
        try {
            check( [ orderNumber, refundId, token ], [ String ] );
        } catch( error ) {
            return checkError( error );
        }

        // Determine userId from token
        let userId;
        if( token ) {
            userId = AccessKeys.findOne( { token: token } ).userId || '';
        } else {
            userId = this.userId || '';
        }

        // hmtl data
        let mailData = {};

        // Send item-email
        try {
            if( userId ) {
                // Get order-info: trade / owner-buyer / seller (from... mConstants)...
                const order = Orders.findOne( { orderNumber: orderNumber } );

                // trade-parameters
                let tradeParams          = order.orderPayment;
                tradeParams.tradeTaxName = tradeParams.tradeTaxName || 'Sales Tax';

                // order-currency
                const tradeCurrency   = order.orderPayment.tradeCurrency;
                const stateShipName   = utils.stateName( order.orderPayment.tradeShipAddress.addressState );
                const countryShipName = utils.countryName( order.orderPayment.tradeShipAddress.addressCountry );
                const statePayName    = utils.stateName( order.orderPayment.tradePayAddress.addressState );
                const countryPayName  = utils.countryName( order.orderPayment.tradePayAddress.addressCountry );

                // order-items, include productName, shortDesc, formatted product-cost...
                const orderItems = order.orderItems.map( item => {
                    const prod = Products.findOne( { _id: item.productId } );
                    _.extend( item, {
                        productName     : prod.productName,
                        shortProductDesc: utils.shortString( prod.productDesc, mcConstant.getShortDesc() ),
                        tradeCurrency,
                    } );
                    item.productCost = !item.productId ? utils.formatNum( item.productCost ) : utils.productCost( item.productId );
                    return item;
                } );

                // format (0.00) tradeParams cost-info
                tradeParams.tradeCost             = utils.formatNum( tradeParams.tradeCost );
                tradeParams.tradeShipCost         = utils.formatNum( tradeParams.tradeShipCost );
                tradeParams.tradeShipCostTax      = utils.formatNum( tradeParams.tradeShipCostTax );
                tradeParams.tradeCostTax          = utils.formatNum( tradeParams.tradeCostTax );
                tradeParams.tradeTotalCost        = utils.formatNum( tradeParams.tradeTotalCost );
                tradeParams.tradeTotalCostTax     = utils.formatNum( tradeParams.tradeTotalCostTax );
                tradeParams.tradeCostTotalPlusTax = utils.formatNum( tradeParams.tradeCostTotalPlusTax );

                // order-payment
                // Get payment-info for fully paid order (non-invoice order):
                const payInfo         = Payments.findOne( {
                    'tradePayment.orderNumber': orderNumber,
                    recordType                : { $ne: 'invoice-payment' },
                } );
                // payment-amounts in 100 units
                let amountPaid        = payInfo ? payInfo.chargeInfo.amount : 0.00,
                      priorAmountPaid = 0.00,
                      refundPaid      = 0.00;

                // Get the current refundAmount

                // current refund-amount
                const refundItem   = Refunds.findOne( { _id: refundId } );
                const refundAmount = refundItem ? refundItem.amount : 0.0;
                const refundDate   = refundItem.createdDate ? refundItem.createdDate : new Date();

                // Determine refunded-amount-total for the order
                const refundInfo = Refunds.find( { orderNumber: orderNumber } );

                if( refundInfo ) {
                    refundInfo.forEach( ( refund ) => {
                        refundPaid += refund.amount;
                    } );
                }

                // Get payment-info for partly paid order (invoice order):
                const orderPayInfo = Payments.find( {
                    recordType                : 'invoice-payment',
                    orderNumber               : orderNumber,
                    "chargeInfo.paymentStatus": { $ne: 'Invoice' },
                } ).fetch();

                if( orderPayInfo ) {
                    // reset amountPaid, for part-payments-total (invoice order)
                    amountPaid = 0; // 100 units
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
                amountPaid += priorAmountPaid;

                // set tax rate
                let taxName = 'Sale Tax',
                    taxRate = tradeParams.tradeTax ? tradeParams.tradeTax.taxAmount : 0,
                    taxUnit = tradeParams.tradeTax ? tradeParams.tradeTax.taxUnit : '%';

                // determine pre-set tax rates by buyer's/shipTo address/taxLocation, taxiJuri (State*) and taxCat
                // (Sales*), productTax?, productTaxExempt? TODO: settings, include the taxiJuri for the seller
                // (default: 'State')
                const taxJuri        = 'State',
                      shipToLocation = tradeParams.tradeShipAddress.addressState;

                // determine taxName and taxRate (%*, fixed, range) by taxLocation = ShipToLocation, taxiJuri = 'State'
                // or as set/defined
                const taxInfo = Taxes.findOne( {
                    taxJuri: taxJuri, taxLocation: shipToLocation, taxCat: 'Sales Tax'
                } );
                if( taxInfo ) {
                    taxName = taxInfo.taxName;
                    taxRate = taxInfo.taxAmount;
                    taxUnit = taxInfo.taxUnit;
                }

                // calculate refAmount based on cancelled order/items and/or returned items
                let refAmount = 0.00,
                    refRefund = 0.00,
                    amountDue = tradeParams.tradeCostTotalPlusTax * 100 - amountPaid - refundPaid,
                    refItems  = [];

                if( order.isCancel ) {
                    // cancel the whole order (all-items)
                    refAmount = tradeParams.tradeCostTotalPlusTax * 100;
                    amountDue = 0.00;
                    refItems  = order.orderItems;
                } else {
                    // calculate based on cancelled order-items (partial)
                    orderItems.forEach( item => {
                        if( item.isCancel || item.isReturn ) {
                            const qty = item.productQtyCancel || item.productQtyReturn;
                            refAmount += (item.productCost * qty * 100);
                            // add cancelled-item
                            refItems.push( {
                                productId       : item.productId,
                                productName     : item.productName,
                                shortProductDesc: item.shortProductDesc,
                                productQty      : item.productQty,
                                productCost     : item.productCost,
                                productQtyCancel: item.productQtyCancel,
                                productQtyReturn: item.productQtyReturn,
                                isCancel        : item.isCancel,
                                isReturn        : item.isReturn,
                                tradeCurrency,
                            } );
                            // TODO: apply shipping-cost portion to the cancelAmount - if/if-not shipped
                            // assumed non-shipped order
                            refAmount += tradeParams.tradeShipCostTax * 100;
                        }
                    } );
                    // Apply Sales tax to cancelAmount
                    if( taxUnit === '%' ) {
                        refAmount += refAmount * taxRate / 100;
                    }
                    if( taxUnit === '#' ) {
                        refAmount += taxRate;
                    }
                }

                // calculate refundable-amount (refRefund): account for amountPaid and refundPaid
                // convert tradeCostTotalPlusTax to 100 units
                const tradeTotalCost = tradeParams.tradeCostTotalPlusTax * 100;
                if( refAmount > tradeTotalCost ) {
                    return {
                        code   : 'overflow',
                        resCode: 401,
                        value  : `refundable-amount($) cannot be greater than total order-cost($)`,
                    }
                }
                if( (amountPaid - refundPaid) === (tradeTotalCost - refAmount) ) {
                    amountDue = 0.00;
                    refRefund = 0.00;
                }
                if( (amountPaid - refundPaid) < (tradeTotalCost - refAmount) ) {
                    amountDue = (tradeTotalCost - refAmount) - (amountPaid - refundPaid);
                    refRefund = 0.0;
                }
                if( (amountPaid - refundPaid) > (tradeTotalCost - refAmount) ) {
                    amountDue = 0.00;
                    refRefund = (amountPaid - refundPaid) - (tradeTotalCost - refAmount);
                }

                // user-info
                const userInfo    = Users.findOne( { _id: order.orderOwner } );
                const userProfile = userInfo.profile || '';

                // Compile Email template
                SSR.compileTemplate( 'htmlEmail', Assets.getText( 'refundMessage.html' ) );

                mailData = {
                    mcLabel,
                    tradeParams,
                    tradeCurrency,
                    stateShipName,
                    countryShipName,
                    statePayName,
                    countryPayName,
                    orderItems,
                    refItems,
                    userProfile,
                    refundAmount: utils.formatNum( refundAmount / 100 ),
                    refundPaid  : utils.formatNum( refundPaid / 100 ),
                    refRefund   : utils.formatNum( refRefund / 100 ),
                    amountPaid  : utils.formatNum( amountPaid / 100 ),
                    refundDate  : moment( refundDate ).format( 'LLLL' ),
                    amountDue   : utils.formatNum( amountDue / 100 ),
                    orderNumber,
                    orderDate   : moment( order.createdDate ).format( 'LLLL' ),
                };

                // console.log( SSR.render( 'htmlEmail', mailData ) );

                // TODO: comment this line after sandbox/testing
                const toEmailAddress = 'abbeya1@yahoo.com';

                // TODO: uncomment for test/uat/prod, determine sending (from) userEmail address
                // const userInfo = Users.findOne( { _id: order.orderOwner } );
                // const toEmailAddress = userInfo.emails[ '0' ].address;

                // send email
                const to      = toEmailAddress,
                      from    = 'mConnect [suppport@saturnbay.net]',
                      subject = `${mcMessage.refundMsgSubject} [${orderNumber} - ${mailData.refundDate}]`,
                      html    = SSR.render( 'htmlEmail', mailData );
                Email.send( { to, from, subject, html } );
                return {
                    code   : 'success',
                    resCode: 200,
                    value  : `Refund Email (message) sent, successfully: from ${from} to ${to}`,
                }
            } else {
                return unAuthorized();
            }
        } catch( error ) {
            return {
                code   : error.code,
                resCode: 406,
                value  : JSON.stringify( error ),
            };
        }
    },
    sendOrderEmail2( orderNumber, token = '' ) {
        // check all arguments.
        try {
            check( [ orderNumber, token ], [ String ] );
        } catch( error ) {
            return checkError( error );
        }

        // Determine userId from token
        let userId;
        if( token ) {
            userId = AccessKeys.findOne( { token: token } ).userId || '';
        } else {
            userId = this.userId || '';
        }

        // console.log(orderMessage( orderNumber ));

        // TODO: comment this line after sandbox/testing
        const toEmailAddress = 'abbeya1@yahoo.com';

        // Send item-email
        try {
            if( userId ) {
                // Get order-info: trade / owner-buyer / seller (from... mConstants)...
                const order = Orders.findOne( { orderNumber: orderNumber } );
                // Determine sending (from) userEmail address
                // TODO: uncomment for test/uat/prod, determine sending (from) userEmail address
                // const userInfo = Users.findOne( { _id: order.orderOwner } );
                // const toEmailAddress = userInfo.emails[ '0' ].address;

                // send email
                const to      = toEmailAddress,
                      from    = 'mConnect [suppport@saturnbay.net]',
                      subject = `${mcMessage.orderMsgSubject} [${orderNumber} - ${new Date()}]`,
                      html    = orderMessage( orderNumber );
                Email.send( { to, from, subject, html } );
                return {
                    code   : 'success',
                    resCode: 200,
                    value  : `Order Email (message) sent, successfully: from ${from} to ${to}`,
                }
            } else {
                return unAuthorized();
            }
        } catch( error ) {
            return {
                code   : error.code,
                resCode: 406,
                value  : JSON.stringify( error ),
            };
        }
    },
} );
