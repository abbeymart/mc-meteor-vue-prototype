/**
 * Created by saturnbay on 2014-12-14.
 * Updated: 2016-06-29 (Abi)
 * Ship-providers: shipType, shipProvider, shipAccess, shipOwner, shipLocale, shipLocation,
 * Ship-cost: shipName, shipGroup, shipFrom, shipTo, shipCost, shipCostType, shipCurrency, shipMeasure(weight/size)
 * Shipping: shipOrder, shipMethod/Name, shipAmount, shipAddress, shipDate, shipFor, shipStatus (date/desc),part of OM.
 * TODO: standard shipping, per product-group shipping, per product shipping (include in product-feature)
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { validateShipping, validateShipProvider, validateShipCost } from '/imports/lib/utils/ValidateRecord';
import saveRecord from './shared/saveRecord';
import removeRecord from './shared/removeRecord';
import getRecord from './shared/getRecord';
import { checkError, validateError, unAuthorized, tokenExpired } from './shared/utils';
import { Shippings, ShipCosts, ShipProviders, AccessKeys, Users } from '/imports/collections/Central';
import { Orders } from "../../../collections/Mpe";
import { mcConstant } from "../../../lib/locales/getConstant";
import { updateLog } from "./shared/translog";
import _ from "lodash";

Meteor.methods( {
    getShipProvider( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'ShipProviders', { collParams, currentDocId, token } );
    },
    getShipCost( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'ShipCosts', { collParams, currentDocId, token } );
    },
    getShip( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Shippings', { collParams, currentDocId, token } );
    },
    getShipOrder( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'ShipOrders', { collParams, currentDocId, token } );
    },
    saveShipProvider( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                shipProvider: String,
                shipType    : String,
                shipEnv     : String,
                shipAccess  : String,
                shipLocation: String,
                shipEndPoint: String,
                shipLocale  : String,
                shipOwner   : String,
                shipDesc    : String,
                isActive    : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateShipProvider( collParams );
        if( errors.shipProvider || errors.shipType || errors.shipEnv || errors.shipAccess || errors.shipLocation || errors.shipOwner || errors.shipLocale || errors.shipEndPoint ) {
            return validateError( errors );
        }

        // Save method check, for new document/record:
        // Check if a duplicate document with the same information... to ensure uniqueness
        const duplicateDoc = ShipProviders.findOne(
            {
                shipType    : collParams.shipType,
                shipProvider: collParams.shipProvider,
            }
        ) ? true : false;

        // Update method check, for existing record:
        // Check if other document with the same / changed name exist, to avoid duplicate name
        const docNotUnique = ShipProviders.findOne(
            {
                _id         : { $ne: currentDocId },
                shipType    : collParams.shipType,
                shipProvider: collParams.shipProvider,
            }
        ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'ShipProviders', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    saveShipCost( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                shipName        : String,
                shipProvider    : String,
                shipCat         : String,
                shipType        : String,
                shipDuration    : Number, // shipping-duration (delivery) in days
                shipFrom        : String,
                shipToType      : String,
                shipToCountry   : String,
                shipToState     : String,
                shipToCity      : String,
                shipToPostalCode: String,
                shipFixedCost   : Number,
                shipCost        : Number,
                shipCostType    : String,
                shipCurrency    : String,
                shipMeasure     : String,
                shipDesc        : String,
                isActive        : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateShipCost( collParams );
        if( errors.shipName || errors.shipCat || errors.shipType || errors.shipDuration || errors.shipFrom || errors.shipToCountry || errors.shipToState || errors.shipToCity || errors.shipToPostalCode || errors.shipFixedCost || errors.shipCost || errors.shipCostType || errors.shipCurrency || errors.shipDesc ) {
            return validateError( errors );
        }

        // Save method check, for new document/record:
        // Check if a duplicate document with the same information... to ensure uniqueness
        const duplicateDoc = ShipCosts.findOne(
            {
                shipName        : collParams.shipName,
                shipCat         : collParams.shipCat,
                shipFrom        : collParams.shipFrom,
                shipToCountry   : collParams.shipToCountry,
                shipToState     : collParams.shipToState,
                shipToCity      : collParams.shipToCity,
                shipToPostalCode: collParams.shipToPostalCode,
            }
        ) ? true : false;

        // Update method check, for existing record:
        // Check if other document with the same / changed name exist, to avoid duplicate name
        const docNotUnique = ShipCosts.findOne(
            {
                _id             : { $ne: currentDocId },
                shipName        : collParams.shipName,
                shipCat         : collParams.shipCat,
                shipFrom        : collParams.shipFrom,
                shipToCountry   : collParams.shipToCountry,
                shipToState     : collParams.shipToState,
                shipToCity      : collParams.shipToCity,
                shipToPostalCode: collParams.shipToPostalCode,
            }
        ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'ShipCosts', collParams, currentDocId, duplicateDoc, docNotUnique, token );

    },
    saveShip( collParams, currentDocId, token = '' ) {
        // Storing date in long format:
        collParams.shipDate = new Date( collParams.shipDate );

        // Check the attributes formats
        try {
            check( collParams, {
                shipOrder : String,   // sub-order for split order (with items shipped separately)
                shipType  : String,
                shipItems : Array,    // itemIds / itemName
                shipMethod: String,
                shipBy    : String,
                shipFor   : String,   // orderCustomer
                shipAmount: String,   // shipAmount for the order/shipItems (calculated field)
                shipTo    : String,   // selected shipAddress from order
                shipDate  : Date,
                shipTrack : String,
                shipStatus: String,   // shipping tracking status
                shipLang  : String,
                shipDesc  : String,
                isActive  : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // validate ship-items
        if( collParams.shipItems.length === 0 ) {
            return {
                code   : 'notValid',
                docId  : '',
                resCode: 401,
                value  : 'Ship-items cannot be empty for Order(all-items) shipping',
            };
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateShipping( collParams );
        if( errors.shipOrder || errors.shipType || errors.shipItems || errors.shipMethod || errors.shipBy || errors.shipFor || errors.shipAmount || errors.shipTo || errors.shipDate || errors.shipTrack || errors.shipStatus || errors.shipDesc ) {
            return validateError( errors );
        }

        // determine allShipped and partShipped: declare/set orders-collection update parameters:
        const tradeParams = {
            orderNumber: collParams.shipOrder,
            allShipped : collParams.shipType === 'Order',
            partShipped: collParams.shipType === 'Item',
        };

        // order-information
        const orderInfo = Orders.findOne( { orderNumber: collParams.shipOrder } );

        // shipItems-count/quantity === orderItems-count/quantity >> allShipped=true & partShipped = false
        if( orderInfo.orderItems.length === collParams.shipItems.length ) {
            // check that all order-items and ship-items match, by id / quantity
            const allShipped = orderInfo.orderItems.every( ( item ) => {
                const shipItem = collParams.shipItems.find( sItem => {
                    return sItem.productId === item.productId;
                } );
                return shipItem ? shipItem.productQty === item.productQty : false;
            } );
            if( allShipped ) {
                tradeParams.allShipped  = true;
                tradeParams.partShipped = false;
            }
        }

        // include shipped-status in the shipping-record
        collParams = _.extend( collParams, {
            allShipped : tradeParams.allShipped,
            partShipped: tradeParams.partShipped,
        } );

        // duplicateDoc and docNotUnique for shipType (Order and Item)
        // Save method check, for new document/record:
        // Check if a duplicate document with the same information... to ensure uniqueness
        const duplicateDoc = Shippings.findOne(
            {
                shipOrder   : collParams.shipOrder,
                shipFor     : collParams.shipFor,
                shipProvider: collParams.shipProvider,
                shipTrack   : collParams.shipTrack,
            }
        ) ? true : false;

        // Update method check, for existing record:
        // Check if other document with the same / changed name exist, to avoid duplicate name
        const docNotUnique = Shippings.findOne(
            {
                _id         : { $ne: currentDocId },
                shipOrder   : collParams.shipOrder,
                shipFor     : collParams.shipFor,
                shipProvider: collParams.shipProvider,
                shipTrack   : collParams.shipTrack,
            }
        ) ? true : false;

        // Call saveRecord method to create new or update existing record
        const shipResult = saveRecord( 'Shippings', collParams, currentDocId, duplicateDoc, docNotUnique, token );

        // if payResult is successful, update trade-items-info & send email
        if( shipResult.code === 'inserted' || shipResult.code === 'updated' ) {
            const tradeResult = Meteor.call( 'updateShipOrder', tradeParams, token );
            const tradeEmail  = Meteor.call( 'sendShipEmail', collParams, shipResult.docId, token ) || {};
            return [ shipResult, tradeResult, tradeEmail ]
        }
        return [ shipResult, {}, {} ];

    },
    updateShipOrder( tradeParams, token = '' ) {
        // Check the attributes formats
        try {
            check( tradeParams, {
                orderNumber: String,
                allShipped : Boolean,
                partShipped: Boolean,
            } );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        console.log( tradeParams );

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
            updateMessage = '';

        // // update order, with shipping status (allShipped or partShipped)
        try {
            const beforeUpdateOrder = Orders.findOne( { orderNumber: tradeParams.orderNumber } );
            // Apply default shipping-info
            Orders.update(
                {
                    orderNumber: tradeParams.orderNumber,
                },
                {
                    $set: {
                        allShipped : tradeParams.allShipped,
                        partShipped: tradeParams.partShipped,
                        updatedDate: new Date(),
                        updatedBy  : userId,
                    }
                } );
            const afterUpdateOrder = Orders.findOne( { orderNumber: tradeParams.orderNumber } );
            // Log transactions (updated records - old/newParams) in auditLog
            // check the audit-log settings - to perform audit-log
            if( mcConstant.getLogUpdate() ) {
                updateLog( 'Orders', beforeUpdateOrder, afterUpdateOrder, userId );
            }
            updateCode    = 'success';
            updateMessage = `Order updated successfully.`;
        } catch( error ) {
            updateCode    = 'error';
            updateMessage = `${error}: Order update error, post shipping.`;
        }

        return {
            code : updateCode,
            value: updateMessage,
        };
    },
    saveShipOrder( collParams, currentDocId, token = '' ) {
        // Storing date in long format:
        collParams.shipDate = new Date( collParams.shipDate );
        // Check the attributes formats
        try {
            check( collParams, {
                shipOrder : String,   // sub-order for split order (with items shipped separately)
                shipType  : String,
                shipItems : Array,    // itemIds / itemName
                shipMethod: String,
                shipBy    : String,
                shipFor   : String,   // orderCustomer
                shipAmount: String,   // shipAmount for the order/shipItems (calculated field)
                shipTo    : String,   // selected shipAddress from order
                shipDate  : Date,
                shipTrack : String,
                shipStatus: String,   // shipping tracking status
                shipLang  : String,
                shipDesc  : String,
                isActive  : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateShipping( collParams );
        if( errors.shipOrder || errors.shipType || errors.shipItems || errors.shipMethod || errors.shipBy || errors.shipFor || errors.shipAmount || errors.shipTo || errors.shipDate || errors.shipTrack || errors.shipStatus || errors.shipDesc ) {
            return validateError( errors );
        }

        // TODO: duplicateDoc and docNotUnique for shipType (Order and Item)
        // let duplicateDoc,
        //     docNotUnique;
        // Save method check, for new document/record:
        // Check if a duplicate document with the same information... to ensure uniqueness
        const duplicateDoc = Shippings.findOne(
            {
                shipOrder   : collParams.shipOrder,
                shipFor     : collParams.shipFor,
                shipProvider: collParams.shipProvider,
                shipTrack   : collParams.shipTrack,
            }
        ) ? true : false;

        // Update method check, for existing record:
        // Check if other document with the same / changed name exist, to avoid duplicate name
        const docNotUnique = Shippings.findOne(
            {
                _id         : { $ne: currentDocId },
                shipOrder   : collParams.shipOrder,
                shipFor     : collParams.shipFor,
                shipProvider: collParams.shipProvider,
                shipTrack   : collParams.shipTrack,
            }
        ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'ShipOrders', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeShipProvider( currentDocId, token = '' ) {

        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'ShipProviders', currentDocId, token );
    },
    removeShipCost( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'ShipCosts', currentDocId, token );
    },
    removeShip( currentDocId, token = '' ) {

        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Shippings', currentDocId, token );
    },
    removeShipOrder( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'ShipOrders', currentDocId, token );
    },

} );
