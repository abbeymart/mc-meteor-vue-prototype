/**
 * Created by saturnbay on 2014-12-25. | Updated: Mar-30-2017
 * Publish standard categories and codes collection objects
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import getPubRecord from '../../methods/central/shared/getPubRecord';
import { checkError } from '../../methods/central/shared/utils';
import _ from 'lodash';
import { StandardCategories, StandardCodes } from "/imports/collections/Central";

// Define publicly available fields to be published for all users
StandardCategories.publicFields = {
    catName: 1,
    catDesc: 1,
    catLang: 1
};

StandardCodes.publicFields = {
    codeName  : 1,
    codeDesc  : 1,
    codeCat   : 1,
    codeParent: 1,
    codeLang  : 1
};

Meteor.publish( 'standardCategoryAll', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'StandardCategories', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'standardCategoryAllActive', function( collParams = {}, currentDocId = '', token = '' ) {
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
    return getPubRecord( 'StandardCategories', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'standardCodeAll', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'StandardCodes', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'standardCodeAllActive', function( collParams = {}, currentDocId = '', token = '' ) {
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
    return getPubRecord( 'StandardCodes', { collParams, currentDocId, token, userId } );
} );
