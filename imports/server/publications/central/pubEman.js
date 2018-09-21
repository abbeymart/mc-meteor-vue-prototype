/**
 * Created by saturnbay on 2015-01-11. | Updated: Mar-31-2017
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import getPubRecord from '../../methods/central/shared/getPubRecord';
import { checkError } from '../../methods/central/shared/utils';
import _ from 'lodash';
import { Emans } from "/imports/collections/Central";

Meteor.publish( 'emanAll', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Emans', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'emanAllActive', function( collParams = {}, currentDocId = '', token = '' ) {
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
    return getPubRecord( 'Emans', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'emanByRole', function( roleId ) {
    // return activity list for the roleId the user has been assigned
    // check attributes
    return Emans.find( { roleId: roleId } );
} );
