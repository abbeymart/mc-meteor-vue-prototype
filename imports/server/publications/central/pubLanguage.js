/**
 * Created by saturnbay on 2014-12-25. | Updated: Mar-29-2017
 * Publish collections / records - e.g. languages, locations, phones etc.
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import getPubRecord from '../../methods/central/shared/getPubRecord';
import { checkError } from '../../methods/central/shared/utils';
import { Languages } from "/imports/collections/Central";
import _ from 'lodash';

// Define publicly available fields to be published for all users (and test)
Languages.publicFields = {
    langCode: 1,
    langName: 1,
    langDesc: 1,
    isActive: 1
};

// handle additional conditions (e.g. isActive) and other considerations (fields, limit etc.), done

// Publish all language records (active/in-active)
Meteor.publish( 'langAll', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }
    // extend attributes
    const extQuery = {
        fields: Languages.publicFields,
    };

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Languages', { collParams, currentDocId, token, userId, extQuery } );
} );

// Publish all active languages for all users
Meteor.publish( 'langActive', function( collParams = {}, currentDocId = '', token = '' ) {
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

    // extend attributes
    const extQuery = {
        fields: Languages.publicFields,
    };

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Languages', { collParams, currentDocId, token, userId, extQuery } );

    // validate access
    // const validAccess = validateAccess( token );
    // if( validAccess.code === 'success' ) {
    //     const result = Languages.find( { isActive: true }, { fields: Languages.publicFields } );
    //     console.log( result );
    //     return result;
    // } else {
    //     return [];
    // }
} );

// Publish limited records
Meteor.publish( 'langAllLimit', function( collParams = {}, currentDocId = '', token = '', limit = 10 ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
        check( limit, Number );
    } catch( error ) {
        return checkError( error );
    }

    // extend attributes
    const extQuery = {
        fields: Languages.publicFields,
        limit : limit,
    };

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Languages', { collParams, currentDocId, token, userId, extQuery } );
} );

Meteor.publish( 'langActiveLimit', function( collParams = {}, currentDocId = '', token = '', limit = 10 ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
        check( limit, Number );
    } catch( error ) {
        return checkError( error );
    }
    // extend collParams
    collParams = _.extend( collParams, {
        isActive: true,
    } );

    // extend attributes
    const extQuery = {
        fields: Languages.publicFields,
        limit : limit,
    };

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Languages', { collParams, currentDocId, token, userId, extQuery } );
} );

//client-side: Meteor.subscribe('langAllLimit', Session.get('limit'));
