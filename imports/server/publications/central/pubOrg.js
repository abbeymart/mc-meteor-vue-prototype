/**
 * Created by saturnbay on 2014-11-23. | Updated Mar-31-2017
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import getPubRecord from '../../methods/central/shared/getPubRecord';
import { checkError } from '../../methods/central/shared/utils';
import _ from 'lodash';
import { Organizations } from "/imports/collections/Central";

// central-mpe-pam-publish all organization records (active and inactive) - for admin users only
Meteor.publish( 'orgAll', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Organizations', { collParams, currentDocId, token, userId } );
} );

// central-mpe-pam-publish all active records - for admin users only
Meteor.publish( 'orgAllActive', function( collParams = {}, currentDocId = '', token = '' ) {
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
    return getPubRecord( 'Organizations', { collParams, currentDocId, token, userId } );
} );

// central-mpe-pam-publish records based on the roleId the user has been assigned
Meteor.publish( 'orgByRole', function( roleId ) {
    check( roleId, String );
    return Organizations.find( { roleId: roleId } );
} );

