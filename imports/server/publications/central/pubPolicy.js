/**
 * Created by saturnbay on 2014-11-23. | Updated: Mar-30-2017
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import getPubRecord from '../../methods/central/shared/getPubRecord';
import { checkError } from '../../methods/central/shared/utils';
import _ from 'lodash';
import { Policies, PServices } from "/imports/collections/Central";

Meteor.publish( 'policyAll', function(collParams = {}, currentDocId = '', token = '') {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Policies', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'policyAllActive', function(collParams = {}, currentDocId = '', token = '') {
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
    return getPubRecord( 'Policies', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'pserviceAll', function(collParams = {}, currentDocId = '', token = '') {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'PServices', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'pserviceAllActive', function(collParams = {}, currentDocId = '', token = '') {
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
    return getPubRecord( 'PServices', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'policyByRole', function( roleId ) {
    // return policies list for the roleId the user has been assigned
    // check attributes
    check( roleId, String );
    return Policies.find( { roleId: roleId } );
} );
