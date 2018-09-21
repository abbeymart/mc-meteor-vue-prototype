/**
 * Created by saturnbay on 2014-11-23. | Updated: Mar-30-2017
 * TODO: implement query-limit for payments and shipping, as data grow beyond 100K records/documents
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import getPubRecord from '../../methods/central/shared/getPubRecord';
import { checkError } from '../../methods/central/shared/utils';
import _ from 'lodash';
import { AccessKeys, Grants, Services, Taxes, Payments, Shippings, Audits } from "/imports/collections/Central";

// Grants publications: publish granted roles for the current users
Meteor.publish( 'grantedRoles', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    // current userId
    let userId     = this.userId || '';
    const userInfo = AccessKeys.findOne( { token: token } );
    if( userInfo ) {
        userId = userInfo.userId;
    }

    // extend collParams
    collParams = _.extend( collParams, {
        isActive : true,
        grantUser: userId,
    } );

    // extend attributes
    // const extQuery = {
    //     fields: Grants.publicFields,
    // };

    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Grants', { collParams, currentDocId, token, userId } );

} );

// Service publications
Meteor.publish( 'serviceByRole', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Services', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'serviceAll', function( collParams = {}, currentDocId = '', token = '', skip = 0, limit = 100000 ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
        check( skip, Number );
        check( limit, Number );
    } catch( error ) {
        return checkError( error );
    }

    // extend attributes
    const extQuery = {
        skip : skip,
        limit: limit,
    };

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Services', { collParams, currentDocId, token, userId, extQuery } );
    // console.log(result.count());
} );

Meteor.publish( 'serviceAllActive', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    // extend collParams
    collParams = _.extend( collParams, {
        isActive: true,
    } );

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Services', { collParams, currentDocId, token, userId } );
} );

// Taxes publications
Meteor.publish( 'taxAll', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Taxes', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'taxAllActive', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    // extend collParams
    collParams = _.extend( collParams, {
        isActive: true,
    } );

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Taxes', { collParams, currentDocId, token, userId } );
} );

// Payment publications
Meteor.publish( 'payAll', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Payments', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'payAllActive', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    // extend collParams
    collParams = _.extend( collParams, {
        isActive: true,
    } );

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Payments', { collParams, currentDocId, token, userId } );
} );
Meteor.publish( 'payProviderAll', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'PayProviders', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'payProviderAllActive', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    // extend collParams
    collParams = _.extend( collParams, {
        isActive: true,
    } );

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'PayProviders', { collParams, currentDocId, token, userId } );
} );

// Shipping publications
Meteor.publish( 'shipAll', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Shippings', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'shipAllActive', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    // extend collParams
    collParams = _.extend( collParams, {
        isActive: true,
    } );

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Shippings', { collParams, currentDocId, token, userId } );
} );
Meteor.publish( 'shipProviderAll', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'ShipProviders', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'shipProviderAllActive', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    // extend collParams
    collParams = _.extend( collParams, {
        isActive: true,
    } );

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'ShipProviders', { collParams, currentDocId, token, userId } );
} );
Meteor.publish( 'shipCostAll', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }
    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'ShipCosts', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'shipCostAllActive', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    // extend collParams
    collParams = _.extend( collParams, {
        isActive: true,
    } );

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'ShipCosts', { collParams, currentDocId, token, userId } );
} );

// Audit publications
Meteor.publish( 'auditAll', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Audits', { collParams, currentDocId, token, userId } );
} );
