/**
 * Created by abbeymart on 2017-03-13.
 * cartId/cartOwner | cart-products
 * orderID/orderOwner | order-products
 */
// Import required module(s)
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import {
    validateOrderCategory,
    validateTrade,
    validateTradeOrder,
    validateCancelOrder,
    validateCancelOrderItem,
} from '/imports/lib/utils/ValidateRecord';
import saveRecord from '../central/shared/saveRecord';
import removeRecord from '../central/shared/removeRecord';
import getRecord from '../central/shared/getRecord';
import { checkError, validateError, unAuthorized, tokenExpired } from '../central/shared/utils';
import { createLog, updateLog } from '../central/shared/translog';
import { mcMessage } from '/imports/lib/locales/getMessage';
import { mcConstant } from '/imports/lib/locales/getConstant';
import { AccessKeys } from '/imports/collections/Central';
import { Products } from "/imports/collections/Asset";
import { Orders, OrderCategories, Trades, Wishes } from "/imports/collections/Mpe";
import _ from 'lodash';

const randomize = require( 'randomatic' );

Meteor.methods( {
    getOrderCat( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // Get items, for authenticated / authorized user, by token
        return getRecord( 'OrderCategories', { collParams, currentDocId, token } );
    },
    saveOrderCat( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                catName  : String,
                catOwner : String,
                catGroup : String,
                parentId : String,
                catLang  : String,
                catDesc  : String,
                isDefault: Boolean,
                isActive : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // set isDefault to true to specific category/folder items (e.g. 'Cart', 'Wish List')
        if( collParams.catName === 'Cart' || collParams.catName === 'Wish List' ) {
            collParams.isDefault = true;
        } else {
            collParams.isDefault = false;
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateOrderCategory( collParams );
        if( errors.catName || errors.catOwner || errors.catGroup || errors.catLang || errors.catDesc ) {
            return validateError( errors );
        }

        // Insert: check if duplicate record exists
        const duplicateDoc = OrderCategories.findOne( {
            catName : collParams.catName,
            catOwner: collParams.catOwner,
            catGroup: collParams.catGroup
        } ) ? true : false;

        // Update: check if another record name exists
        const docNotUnique = OrderCategories.findOne( {
            _id     : {
                $ne: currentDocId
            },
            catName : collParams.catName,
            catOwner: collParams.catOwner,
            catGroup: collParams.catGroup
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'OrderCategories', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeOrderCat( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'OrderCategories', currentDocId, token );
    },
    getTrade( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Trades', { collParams, currentDocId, token } );
    },
    saveTrade( collParams, currentDocId, toke = '' ) {
        // Cart  or Order
    },
    saveTradeItem( collParams, currentDocId, token = '' ) {
        // checkout cart-to-order: change tradeStatus from 'Cart' to 'Order'
        // Check the attributes formats
        try {
            check( collParams, {
                tradeProduct    : String,
                tradeProductName: String,
                tradeGroup      : String,   // B2C (default), B2B, C2C etc.
                tradeFolder     : String,   // uniqueID for cart(userId) or order(orderId & orderRef)
                tradeQuantity   : Number,
                tradeStatus     : String,   // CartTrade* or OrderTrade (post checkout/payment)
                tradeOwner      : String,
                tradeDesc       : String,
                tradeShipping   : String,  // Shipping information
                tradePayment    : String,  // Payment information
                isActive        : Boolean,
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items , checked also on the client side
        const errors = validateTrade( collParams );
        if( errors.tradeProduct || errors.tradeGroup || errors.tradeFolder || errors.tradeQuantity || errors.tradeStatus || errors.tradeOwner || errors.tradeDesc || errors.tradeShipping || errors.tradePayment ) {
            return validateError( errors );
        }

        // Save method check, for new document/record:
        // Check if a duplicate document with the same todoName, todoType, todoLang and todoService exists, for save
        // method, to ensure uniqueness
        let duplicateDoc = false;

        // check the existing cart-item for a tradeProduct/tradeFolder/tradeOwner
        const currentCart = Trades.findOne(
            {
                tradeProduct: collParams.tradeProduct,
                tradeFolder : collParams.tradeFolder,
                tradeOwner  : collParams.tradeOwner,
            }
        );
        if( currentCart ) {
            duplicateDoc             = true;
            currentDocId             = currentCart._id;
            collParams.tradeQuantity = collParams.tradeQuantity || currentCart.tradeQuantity;
            collParams.tradeStatus   = collParams.tradeStatus || currentCart.tradeStatus;
            collParams.tradeShipping = collParams.tradeShipping || currentCart.tradeShipping;
            collParams.tradePayment  = collParams.tradePayment || currentCart.tradePayment;
            collParams.tradeDesc     = collParams.tradeDesc || currentCart.tradeDesc;
        }

        // Update method check, for existing record:
        // Check if other document with the same item (folder/owner) exist, to avoid duplicate item
        const docNotUnique = Trades.findOne(
            {
                _id         : { $ne: currentDocId },
                tradeProduct: collParams.tradeProduct,
                tradeFolder : collParams.tradeFolder,
                tradeOwner  : collParams.tradeOwner,
            }
        ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Trades', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    updateTradeItems( tradeParams, token = '' ) {
        // Check the attributes formats
        try {
            check( tradeParams, {
                tradeFolder     : String,
                tradeItems      : Array,    // trade/cart-items
                tradeOwner      : String,
                tradeStatus     : String,   // OrderTrade, from CartTrade
                tradeOrderNumber: String,
                tradePayment    : Object, // >> order package/collection
                isActive        : Boolean,
            } );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Affirm / confirm the trade-order status
        if( !tradeParams.tradeStatus || tradeParams.tradeStatus !== 'OrderTrade' ) {
            tradeParams.tradeStatus = 'OrderTrade';
        }

        // Check mandatory data items , checked also on the client side
        const errors = validateTradeOrder( tradeParams );
        if( errors.tradeFolder || errors.tradeStatus || errors.tradeOrderNumber || errors.tradeOwner || errors.tradeItems || errors.tradePayment ) {
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

        // CRUD / message parameters
        let updateCode    = 'error',
            updateMessage = '',
            productItems  = [];

        // extract productIds and productItems
        tradeParams.tradeItems.forEach( ( item ) => {
            // include productCost | TODO: apply productCost based on applied discount or pricing-group
            const prodInfo = Products.findOne( { _id: item.tradeProduct } );

            productItems.push( {
                productId  : item.tradeProduct,
                productQty : item.tradeQuantity,
                productCost: prodInfo.productCost,
                productName: prodInfo.productName,
            } );
        } );

        // TODO: include transactional processing (full-commit/rollback)
        // update orders (tradeId, order#, shipping, payment and owner)
        const orderParams = {
            orderNumber  : tradeParams.tradeOrderNumber,
            orderStatus  : tradeParams.tradeStatus,   // Ordered/Paid, Shipped etc.
            orderFolder  : tradeParams.tradeFolder,   // reference to order-items
            orderOwner   : tradeParams.tradeOwner,
            orderPayment : tradeParams.tradePayment,
            orderDiscount: tradeParams.tradeDiscount,
            orderItems   : productItems,
            createdBy    : userId,
            createdDate  : new Date(),
        };


        // insert a new order record
        try {
            // Apply default shipping-info
            const docParams = _.extend( orderParams, {
                allShipped : false,
                partShipped: false,
                isCancel   : false,
            } );
            const docId     = Orders.insert( docParams );
            // Log transactions (new records - orderParams) in auditLog (insert-type)
            // check the audit-log settings - to perform audit-log
            if( mcConstant.getLogCreate() ) {
                createLog( 'Orders', docParams, userId );
            }
            updateCode    = 'success';
            updateMessage = `${updateMessage} | Order created successfully.`;
        } catch( error ) {
            updateCode    = 'error';
            updateMessage = `${updateMessage} | ${error}: Order update, post payment error.`;
        }

        // update trade-info (tradeStatus: 'OrderTrade') by tradeFolder/tradeProduct[]/Owner
        try {
            let docId = '';
            // update trade-records for each productId
            productItems.forEach( ( item ) => {
                "use strict";
                docId = Trades.update(
                    {
                        tradeProduct: item.productId,
                        tradeFolder : tradeParams.tradeFolder,
                        tradeOwner  : tradeParams.tradeOwner,
                        isActive    : true,
                    },
                    {
                        $set: {
                            tradeStatus: tradeParams.tradeStatus,
                            updatedDate: new Date(),
                            updatedBy  : userId,
                        }
                    } );
            } );
            updateCode    = 'success';
            updateMessage = `${updateMessage} | Trade-items updated successfully.`;
        } catch( error ) {
            updateCode    = 'error';
            updateMessage = `${updateMessage} | ${error}: Trade-items update, post payment error.`;
        }

        // update products (qty-sold), wish-list(wish-purchased) by tradeProduct[] (productId)
        try {
            // Perform qty-updates for each of the trade-items in products-collection
            let docId = '';
            productItems.forEach( ( item ) => {
                "use strict";
                docId = Products.update(
                    {
                        _id     : item.productId,
                        isActive: true,
                    },
                    {
                        $inc: {
                            productSold: item.productQty
                        },
                        $set: {
                            updatedDate: new Date(),
                            updatedBy  : userId,
                        },
                    } );
            } );
            updateCode    = 'success';
            updateMessage = `${updateMessage} | Trade-items quantities (Products) updated successfully.`;
        } catch( error ) {
            updateCode    = 'error';
            updateMessage = `${updateMessage} | ${error}: Trade items-quantities (Products) update, error.`;
        }
        try {
            // Perform qty-updates for each of the trade-items in wishes-collection
            let docId = '';
            // wish-list:
            productItems.forEach( ( item ) => {
                "use strict";
                docId = Wishes.update(
                    {
                        wishProduct: item.productId,
                        wishOwner  : tradeParams.tradeOwner,
                        isActive   : true,
                    },
                    {
                        $inc: {
                            wishPurchased: item.productQty
                        },
                        $set: {
                            updatedDate: new Date(),
                            updatedBy  : userId,
                        },
                    } );
            } );
            updateCode    = 'success';
            updateMessage = `${updateMessage} | Trade-items quantities (Wishes) updated successfully.`;
        } catch( error ) {
            updateCode    = 'error';
            updateMessage = `${updateMessage} | ${error}: Trade items-quantities (Wishes)  update, error.`;
        }

        return {
            code : updateCode,
            value: updateMessage,
        };

        // Send email and respond with action-outcomes
        // const orderEmail = Meteor.call( 'sendOrderEmail', tradeParams.tradeOrderNumber, token );
        // return [ retResult, orderEmail ];
    },
    removeTradeItem( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Trades', currentDocId, token );
    },
    getOrder( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Orders', { collParams, currentDocId, token } );
    },
    getCancelOrder( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // apply cancellation-rule, order-not-shipped or partly-shipped
        collParams = _.extend( collParams, {
            allShipped: false,
            isCancel  : false,
        } );

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Orders', { collParams, currentDocId, token } );
        // console.log(recOrder);
        // return recOrder;
    },
    saveOrder( collParams, currentDocId, token = '' ) {
        // not-in-use,
        // save order information, after confirmed payment
        // OR update the cart information, and keep the tradeStatus as CartOrder and OrderTrade after payment
        // Check the attributes formats
        // create/save order from cart-information, including shipping/payment/other details
        try {
            check( collParams, {
                tradeProducts: Array,    // productId, cost, quantity, discount...
                tradeFolder  : String,   // uniqueID order (orderId & orderRef)
                tradeStatus  : String,   // OrderTrade (post checkout/payment)
                tradeOwner   : String,
                tradeDesc    : String,  // orderDesc / instruction
                tradeShipping: Object,  // Shipping information (shipAddress, shipMethod)
                tradePayment : Object,  // Payment information (billAddress, payMethod)
                tradeInfo    : Object,  // tradeDiscount, tradeDate, itemTotal, shipTotal, taxTotal, itemShipTaxTotal,
                isActive     : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items , checked also on the client side
        const errors = validateTrade( collParams );
        if( errors.tradeProducts || errors.tradeFolder || errors.tradeStatus || errors.tradeStatus || errors.tradeOwner || errors.tradeDesc || errors.tradeShipping || errors.tradePayment ) {
            return validateError( errors );
        }

        // TODO: store/update qty-sold for all order-product-items (coll: products)
        // wrap in a try-catch or transaction* block

        // TODO: update cart-items in Trades collection, for tradeOwner and tradeFolder

        // tradeProducts - tradeQuantity, tradePrice... perform from client to server (auto event-based)... saveCart

        //  payment (client or server side)

        // generate unique order# (e.g. username-1001-9999-4240-6799)
        collParams.tradeFolder = randomize( 'A0', 16 );

        // after successful payment, change tradeFolder to order# and tradeStatus to 'OrderTrade'

        // TODO: create order record

        // create new order in Orders collection: tradeFolder (order#), tradeOwner, tradeShipping, tradePayment,
        // tradeInfo...


    },
    removeOrder( currentDocId, token = '' ) {
        // not-in-use, for audit-purpose
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Orders', currentDocId, token );
    },
    cancelOrder( orderParams, token = '' ) {
        // for order (orderNumber):
        // (1) update/set orderStatus to OrderCancel || or set isCancel to true
        // (2) update tradeStatus for all tradeFolder-items to TradeCancel || or set isCancel to true
        // (3) update products and wish-items quantity ($dec by quantity) and...
        // (4) process refund(orderTotal+Tax) => separate action

        // Check the attributes formats
        try {
            check( orderParams, {
                orderNumber: String,
                isCancel   : Boolean,
            } );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // cancel order: set to true:
        if( orderParams.isCancel === false ) {
            orderParams.isCancel = true;
        }

        // validate data items , checked also on the client side
        const errors = validateCancelOrder( orderParams );
        if( errors.orderNumber ) {
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

        // Current order-items
        const orderInfo = Orders.findOne( { orderNumber: orderParams.orderNumber } );
        let orderItems  = {};
        if( orderInfo ) {
            orderItems = orderInfo.orderItems;
        }

        // check current order-status (i.e. !isCancel)
        if( orderInfo.isCancel ) {
            return {
                code : 401,
                value: 'Order already cancelled',
            };
        }

        // CRUD / message parameters
        let updateCode    = 'error',
            updateMessage = '',
            productItems  = [];

        // extract productIds and productItems
        orderItems.forEach( ( item ) => {
            productItems.push( {
                productId : item.productId,
                productQty: item.productQty,
            } );
        } );

        // TODO: include transactional processing (full-commit/rollback)

        // update current order record
        try {
            // const docId = Orders.insert( orderParams );
            let docId          = '';
            docId              = Orders.update(
                {
                    orderNumber: orderParams.orderNumber,
                },
                {
                    $set: {
                        isCancel     : orderParams.isCancel,
                        cancelledDate: new Date(),
                        updatedDate  : new Date(),
                        updatedBy    : userId,
                    }
                } );
            // Log transactions (new record) in auditLog (update-type)
            const updatedOrder = Orders.findOne( { orderNumber: orderParams.orderNumber } );
            // check the audit-log settings - to perform audit-log
            if( mcConstant.getLogUpdate() ) {
                updateLog( 'Orders', orderInfo, updatedOrder, userId );
            }
            updateCode    = 'success';
            updateMessage = `${updateMessage} | Order updated (isCancel: ${orderParams.isCancel}) successfully.`;
        } catch( error ) {
            updateCode    = 'error';
            updateMessage = `${updateMessage} | ${error}: Order update error.`;
        }

        // update trade-info (tradeStatus: orderParams.orderStatus | 'OrderCancelled' || isCancel: true) by
        // tradeFolder/tradeProduct[]/Owner
        try {
            let docId = '';
            // update trade-records for each productId
            productItems.forEach( ( item ) => {
                "use strict";
                docId = Trades.update(
                    {
                        tradeProduct: item.productId,
                        tradeFolder : orderInfo.orderFolder,
                        tradeOwner  : orderInfo.orderOwner,
                        isActive    : true,
                    },
                    {
                        $set: {
                            isCancel     : orderParams.isCancel,
                            cancelledDate: new Date(),
                            updatedDate  : new Date(),
                            updatedBy    : userId,
                        }
                    } );
            } );
            updateCode    = 'success';
            updateMessage = `${updateMessage} | Trade-items (isCancel: ${orderParams.isCancel}) updated successfully.`;
        } catch( error ) {
            updateCode    = 'error';
            updateMessage = `${updateMessage} | ${error}: Trade-items update error.`;
        }

        // update products (qty-sold), wish-list(wish-purchased) by tradeProduct[] (productId)
        try {
            // Perform qty-updates for each of the trade-items in products-collection
            let docId = '';
            productItems.forEach( ( item ) => {
                "use strict";
                docId = Products.update(
                    {
                        _id     : item.productId,
                        isActive: true,
                    },
                    {
                        $inc: {
                            productSold: -item.productQty
                        },
                        $set: {
                            updatedDate: new Date(),
                            updatedBy  : userId,
                        },
                    } );
            } );
            updateCode    = 'success';
            updateMessage = `${updateMessage} | Trade-items quantities (Products) updated successfully.`;
        } catch( error ) {
            updateCode    = 'error';
            updateMessage = `${updateMessage} | ${error}: Trade items-quantities (Products) update error.`;
        }
        try {
            // Perform qty-updates for each of the trade-items in wishes-collection
            let docId = '';
            // wish-list:
            productItems.forEach( ( item ) => {
                "use strict";
                docId = Wishes.update(
                    {
                        wishProduct: item.productId,
                        wishOwner  : orderInfo.orderOwner,
                        isActive   : true,
                    },
                    {
                        $inc: {
                            wishPurchased: -item.productQty
                        },
                        $set: {
                            updatedDate: new Date(),
                            updatedBy  : userId,
                        },
                    } );
            } );
            updateCode    = 'success';
            updateMessage = `${updateMessage} | Trade-items quantities (Wishes) updated successfully.`;
        } catch( error ) {
            updateCode    = 'error';
            updateMessage = `${updateMessage} | ${error}: Trade items-quantities (Wishes)  update error.`;
        }
        const cancelResult = {
            code : updateCode,
            value: updateMessage,
        };

        // Send email and respond with action-outcomes
        if( cancelResult.code === 'success' ) {
            const cancelType = mcMessage.cancelTypeOrder;
            const tradeEmail = Meteor.call( 'sendCancelEmail', orderParams.orderNumber, cancelType, token ) || {};
            return [ cancelResult, tradeEmail ];
        }
        return [ cancelResult, {} ];
    },
    cancelOrderItem( orderParams, token = '' ) {
        // for order (orderNumber):
        // (1) update tradeStatus for all tradeFolder-items to TradeCancel || or set isCancel to true
        // (2) update product/wish-items quantity ($dec by quantity) and...
        // (3) process refund(orderTotal+Tax) => separate action

        // console.log(orderParams, token);

        // Check the attributes formats
        try {
            check( orderParams, {
                orderNumber: String,
                orderItems : Array,    // [{productId, productQty)], items to cancel
            } );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // validate data items , checked also on the client side
        const errors = validateCancelOrderItem( orderParams );
        if( errors.orderNumber || errors.orderItems ) {
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

        // Current order-items
        const orderInfo      = Orders.findOne( { orderNumber: orderParams.orderNumber } );
        const orderItemCount = orderInfo.orderItems.length;

        // check current order-status (i.e. !isCancel)
        if( orderInfo.isCancel ) {
            return {
                code : 401,
                value: 'Order already cancelled',
            };
        }

        // item quantities (cancel and order) comparison
        // order (all items)
        const qtyOrderEqualCancel   = orderParams.orderItems.every( ( cancel ) => {
            let itemInfo = orderInfo.orderItems.find( ( item ) => {
                return item.productId === cancel.productId;
            } );
            return itemInfo.productQty === cancel.productQty;
        } );
        // some items, part of order
        const qtyOrderGreaterCancel = orderParams.orderItems.some( ( cancel ) => {
            let itemInfo = orderInfo.orderItems.find( ( item ) => {
                return item.productId === cancel.productId;
            } );
            return itemInfo.productQty > cancel.productQty;
        } );
        // a rare occurrence, error
        const qtyOrderLessCancel    = orderParams.orderItems.some( ( cancel ) => {
            let itemInfo = orderInfo.orderItems.find( ( item ) => {
                return item.productId === cancel.productId;
            } );
            return itemInfo.productQty < cancel.productQty;
        } );

        // items count (order / cancel): set trade-order status
        // all order-items (order) cancelled
        if( orderParams.orderItems.length === orderItemCount && qtyOrderEqualCancel ) {
            if( !orderParams.isCancel || orderParams.isCancel !== true ) {
                orderParams.isCancel = true;
            }
            // set orderParams for cancelOrder
            orderParams = {
                orderNumber: orderParams.orderNumber,
                isCancel   : orderParams.isCancel,
            };

            // divert to cancelOrder()
            return Meteor.call( 'cancelOrder', orderParams, token );
        } else if( orderParams.orderItems.length < orderItemCount || qtyOrderGreaterCancel ) {
            // part of order-items cancelled
            if( !orderParams.orderStatus || orderParams.orderStatus !== 'OrderPartlyCancelled' ) {
                orderParams.orderStatus = 'OrderPartlyCancelled';
            }
        } else if( orderParams.orderItems.length > orderItemCount ) {
            // exceptional / rare case: order-items-count
            return {
                code : 401,
                value: `Items (${orderParams.orderItems.length}) to cancel may not exceed order-items (${orderItemCount})`,
            };
        } else if( qtyOrderLessCancel ) {
            // exceptional / rare case: order/cancel-quantities comparison
            return {
                code : 401,
                value: 'Cancelled item(s) quantity may not exceed order item(s) quantity',
            };
        } else {
            orderParams.orderStatus = 'OrderPartlyCancelled';
        }

        // CRUD / message parameters
        let updateCode    = 'error',
            updateMessage = '',
            productItems  = [];

        // extract productIds and productItems... set isCancel, for cancelled-items
        orderInfo.orderItems.forEach( ( prod ) => {
            // set returned-item values
            let cancelQty    = 0,
                isCancel     = false,
                isReturn     = false;
            const cancelItem = orderParams.orderItems.find( ( item ) => {
                "use strict";
                return prod.productId === item.productId;
            } );
            if( cancelItem ) {
                // validate quantity, ensure cancelQty is not greater than orderQty
                if( cancelItem.productQty > prod.productQty ) {
                    cancelQty = prod.productQty;
                } else {
                    cancelQty = cancelItem.productQty;
                }
                isCancel = true;
            }
            productItems.push( {
                productId       : prod.productId,
                productQty      : prod.productQty,
                productQtyReturn: prod.productQtyReturn || 0,
                productQtyCancel: cancelQty,
                isCancel        : isCancel,
                isReturn        : prod.isReturn || isReturn,
                cancelledDate   : new Date(),
                updatedDate     : new Date(),
                updatedBy       : userId,
            } );
        } );

        // TODO: include transactional processing (full-commit/rollback)

        // update current order record-items
        try {
            // update the order.orderItems[]
            Orders.update(
                {
                    orderNumber: orderParams.orderNumber,
                },
                {
                    $set: {
                        orderStatus: orderParams.orderStatus,
                        orderItems : productItems,
                        updatedDate: new Date(),
                        updatedBy  : userId,
                    }
                } );
            // Log transactions (updated record) in auditLog (update-type)
            const updatedOrder = Orders.findOne( { orderNumber: orderParams.orderNumber } );
            // check the audit-log settings - to perform audit-log
            if( mcConstant.getLogUpdate() ) {
                updateLog( 'Orders', orderInfo, updatedOrder, userId );
            }
            updateCode    = 'success';
            updateMessage = `${updateMessage} | Order-items updated successfully.`;
        } catch( error ) {
            updateCode    = 'error';
            updateMessage = `${updateMessage} | ${error}: Order-items update error.`;
        }

        // update trade-info (tradeStatus: orderParams.orderStatus | 'OrderCancelled') by
        // tradeFolder/tradeProduct[]/Owner
        try {
            let docId = '';
            // update trade-records for each productId
            productItems.forEach( ( item ) => {
                "use strict";
                docId = Trades.update(
                    {
                        tradeProduct: item.productId,
                        tradeFolder : orderInfo.orderFolder,
                        tradeOwner  : orderInfo.orderOwner,
                        isActive    : true,
                    },
                    {
                        $set: {
                            isCancel        : item.isCancel,
                            productQtyCancel: item.productQtyCancel,
                            cancelledDate   : new Date(),
                            updatedDate     : new Date(),
                            updatedBy       : userId,
                        }
                    } );
            } );
            updateCode    = 'success';
            updateMessage = `${updateMessage} | Trade-items updated successfully.`;
        } catch( error ) {
            updateCode    = 'error';
            updateMessage = `${updateMessage} | ${error}: Trade-items update error.`;
        }

        // update products (qty-sold), wish-list(wish-purchased) by tradeProduct[] (productId)
        try {
            // Perform qty-updates for each of the trade-items in products-collection
            let docId = '';
            productItems.forEach( ( item ) => {
                "use strict";
                docId = Products.update(
                    {
                        _id     : item.productId,
                        isActive: true,
                    },
                    {
                        $inc: {
                            productSold: -item.productQtyCancel
                        },
                        $set: {
                            updatedDate: new Date(),
                            updatedBy  : userId,
                        },
                    } );
            } );
            updateCode    = 'success';
            updateMessage = `${updateMessage} | Trade-items quantities (Products) updated successfully.`;
        } catch( error ) {
            updateCode    = 'error';
            updateMessage = `${updateMessage} | ${error}: Trade items-quantities (Products) update error.`;
        }
        try {
            // Perform qty-updates for each of the trade-items in products-collection
            let docId = '';
            // wish-list:
            productItems.forEach( ( item ) => {
                "use strict";
                docId = Wishes.update(
                    {
                        wishProduct: item.productId,
                        wishOwner  : orderParams.orderOwner,
                        isActive   : true,
                    },
                    {
                        $inc: {
                            wishPurchased: -item.productQtyCancel
                        },
                        $set: {
                            updatedDate: new Date(),
                            updatedBy  : userId,
                        },
                    } );
            } );
            updateCode    = 'success';
            updateMessage = `${updateMessage} | Trade-items quantities (Wishes) updated successfully.`;
        } catch( error ) {
            updateCode    = 'error';
            updateMessage = `${updateMessage} | ${error}: Trade items-quantities (Wishes)  update error.`;
        }
        const cancelResult = {
            code : updateCode,
            value: updateMessage,
        };

        // Send email and respond with action-outcomes
        if( cancelResult.code === 'success' ) {
            const cancelType = mcMessage.cancelTypeItem;
            const tradeEmail = Meteor.call( 'sendCancelEmail', orderParams.orderNumber, cancelType, token ) || {};
            return [ cancelResult, tradeEmail ];
        }
        return [ cancelResult, {} ];
    },
    returnOrderItem( orderParams, token = '' ) {
        // for order (orderNumber):
        // (1) update tradeStatus for all tradeFolder-items to TradeCancel || or set isCancel to true
        // (2) update product/wish-items quantity ($dec by quantity returned) and...
        // (3) process refund(orderTotal+Tax) => separate action

        // Check the attributes formats
        try {
            check( orderParams, {
                orderNumber: String,
                orderItems : Array,    // {productId, productQty), include isReturn: true / false
            } );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // validate data items , checked also on the client side
        const errors = validateCancelOrderItem( orderParams );
        if( errors.orderNumber || errors.orderItems ) {
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

        // Current order-items
        const orderInfo = Orders.findOne( { orderNumber: orderParams.orderNumber } );
        // const orderItemCount = orderInfo.orderItems.length;

        // set isCancel variable to ensure cancel-action before return-action
        let isCancel = false;
        // for every return-item, corresponding order/order-item must have been cancelled
        // if order (all items) has been cancelled, then isCancel = true
        if( orderInfo.isCancel ) {
            isCancel = true;
        } else {
            isCancel = orderParams.orderItems.every( ( item ) => {
                const itemInfo = orderInfo.orderItems.find( ( prod ) => {
                    return prod.productId === item.productId;
                } );
                return itemInfo.isCancel;
            } );
        }
        // order-item must be cancelled prior to processing return
        if( !isCancel ) {
            return {
                code   : 'notCancelled',
                resCode: 401,
                value  : 'order/order-item(s) must be cancelled prior to processing return',
            };
        }

        // returned items/qty must be less than or equal to cancel and/or order product-quantity
        const qtyReturnLessCancelOrder = orderParams.orderItems.every( ( ret ) => {
            let returnQty = ret.productQty;
            let itemInfo  = orderInfo.orderItems.find( ( prod ) => {
                return prod.productId === ret.productId;
            } );
            // cater for existing and new/additional return quantity
            if( itemInfo && itemInfo.productQtyReturn && itemInfo.productQtyReturn > 0 ) {
                returnQty += itemInfo.productQtyReturn
            }
            // determine if the return product met the qtyReturnLessCancelOrder condition
            if( itemInfo && itemInfo.productQtyCancel && itemInfo.productQtyCancel > 0 ) {
                // assert cancelQty >= returnQty
                return itemInfo.productQtyCancel >= returnQty;
            } else {
                // assert order productQty >= returnQty
                return itemInfo.productQty >= returnQty;
            }
        } );
        if( !qtyReturnLessCancelOrder ) {
            return {
                code : 401,
                value: 'Returned item(s) quantity cannot not exceed cancel and/or order item(s) quantity',
            };
        }

        // CRUD / message parameters
        let updateCode    = 'error',
            updateMessage = '',
            productItems  = [];
        // extract productIds and productItems... set isReturn, for returned-items
        for( const prod of orderInfo.orderItems ) {
            let returnQty    = prod.productQtyReturn || 0,
                isReturn     = prod.isReturn || false,
                isCancel     = prod.isCancel || false;
            const returnItem = orderParams.orderItems.find( ( item ) => {
                return item.productId === prod.productId;
            } );
            if( returnItem ) {
                returnQty += returnItem.productQty;
                isReturn = true;
                isCancel = true;
            }
            // update item-record/info
            productItems.push( {
                productId       : prod.productId,
                productQty      : prod.productQty,
                productQtyCancel: prod.productQtyCancel || 0,
                isCancel        : isCancel,
                isReturn        : isReturn,
                productQtyReturn: returnQty,
                returnedDate    : new Date(),
                updatedDate     : new Date(),
                updatedBy       : userId,
            } );
        }

        // TODO: include transactional processing (full-commit/rollback)

        // update order record/items
        try {
            // update the order.orderItems[]
            let docId          = '';
            docId              = Orders.update(
                {
                    orderNumber: orderParams.orderNumber,
                },
                {
                    $set: {
                        orderStatus: orderParams.orderStatus,
                        orderItems : productItems,
                        updatedDate: new Date(),
                        updatedBy  : userId,
                    }
                } );
            // Log transactions (updated record) in auditLog (update-type)
            const updatedOrder = Orders.findOne( { orderNumber: orderParams.orderNumber } );
            // check the audit-log settings - to perform audit-log
            if( mcConstant.getLogUpdate() ) {
                updateLog( 'Orders', orderInfo, updatedOrder, userId );
            }
            updateCode    = 'success';
            updateMessage = `${updateMessage} | Order-items updated successfully.`;
        } catch( error ) {
            updateCode    = 'error';
            updateMessage = `${updateMessage} | ${error}: Order-items update error.`;
        }

        // update trade-info (tradeStatus: orderParams.orderStatus | 'OrderCancelled') by
        // tradeFolder/tradeProduct[]/Owner
        try {
            let docId = '';
            // update trade-records for each productId
            productItems.forEach( ( item ) => {
                "use strict";
                docId = Trades.update(
                    {
                        tradeProduct: item.productId,
                        tradeFolder : orderInfo.orderFolder,
                        tradeOwner  : orderInfo.orderOwner,
                        isActive    : true,
                    },
                    {
                        $set: {
                            isCancel        : item.isCancel,
                            isReturn        : item.isReturn,
                            productQtyCancel: item.productQtyCancel,
                            productQtyReturn: item.productQtyReturn,
                            returnedDate    : new Date(),
                            updatedDate     : new Date(),
                            updatedBy       : userId,
                        }
                    } );
            } );
            updateCode    = 'success';
            updateMessage = `${updateMessage} | Trade-items updated successfully.`;
        } catch( error ) {
            updateCode    = 'error';
            updateMessage = `${updateMessage} | ${error}: Trade-items update error.`;
        }

        // productQty updated in Products and Wishes collections, from cancel-action.

        const retResult  = {
            code : updateCode,
            value: updateMessage,
        };
        // Send email and respond with action-outcomes
        if( retResult.code === 'success' ) {
            const tradeEmail = Meteor.call( 'sendReturnEmail', orderParams.orderNumber, token ) || {};
            return [ retResult, tradeEmail ];
        }
        return [ retResult, {} ];
    },
} );
