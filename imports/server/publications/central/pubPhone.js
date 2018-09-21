/**
 * Created by saturnbay on 2015-12-11.
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import getPubRecord from '../../methods/central/shared/getPubRecord';
import { checkError } from '../../methods/central/shared/utils';
import _ from 'lodash';
import { Phones } from "/imports/collections/Central";

// Define publicly available fields to be published for all users
Phones.publicFields = {
    contentCode: 1,
    contentName: 1,
    contentDesc: 1,
    contentLang: 1
};

// Publish all active/inactive records
Meteor.publish( 'phoneAll', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Phones', { collParams, currentDocId, token, userId } );
} );

//Publish active contents for all users
Meteor.publish( 'phoneAllActive', function( collParams = {}, currentDocId = '', token = '' ) {
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
    return getPubRecord( 'Phones', { collParams, currentDocId, token, userId } );
} );
