/**
 * Created by saturnbay on 2014-11-23. |Updated: Mar-30-2017
 * TODO: implement query-limit for payments and shipping, as data grow beyond 100K
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import getPubRecord from '../../methods/central/shared/getPubRecord';
import { checkError } from '../../methods/central/shared/utils';
import _ from 'lodash';
import { Products, ProductReviews, ProductDocuments, Prices, Features } from "/imports/collections/Asset";

// Products
Meteor.publish( 'productAll', function( collParams = {}, currentDocId = '', token = '', skip = 0, limit = 100000 ) {
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
    return getPubRecord( 'Products', { collParams, currentDocId, token, userId, extQuery } );
    // console.log(result.count());
    // console.log(result);
} );

Meteor.publish( 'productAllActive', function( collParams = {}, currentDocId = '', token = '' ) {
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
    return getPubRecord( 'Products', { collParams, currentDocId, token, userId } );
} );

// Product Features
Meteor.publish( 'productFeatureAll', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Features', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'productFeatureAllActive', function( collParams = {}, currentDocId = '', token = '' ) {
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
    return getPubRecord( 'Features', { collParams, currentDocId, token, userId } );
} );

// Product Reviews
Meteor.publish( 'productReviewAll', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'ProductReviews', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'productReviewAllActive', function( collParams = {}, currentDocId = '', token = '' ) {
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
    return getPubRecord( 'ProductReviews', { collParams, currentDocId, token, userId } );
} );

// Prices
Meteor.publish( 'priceAll', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Prices', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'priceAllActive', function( collParams = {}, currentDocId = '', token = '' ) {
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
    return getPubRecord( 'Prices', { collParams, currentDocId, token, userId } );
} );

// Product Documents
Meteor.publish( 'productDocAll', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'ProductDocuments', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'productDocAllActive', function( collParams = {}, currentDocId = '', token = '' ) {
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
    return getPubRecord( 'ProductDocuments', { collParams, currentDocId, token, userId } );
} );
