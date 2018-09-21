/**
 * Created by saturnbay on 2015-01-07. | Updated: Mar-30-2017
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import getPubRecord from '../../methods/central/shared/getPubRecord';
import { checkError } from '../../methods/central/shared/utils';
import _ from 'lodash';
import { Todos, Assignments } from "/imports/collections/Central";
import { utils } from '/imports/lib/utils/Utility';

Meteor.publish( 'todoAll', function(collParams = {}, currentDocId = '', token = '') {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Todos', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'todoAllActive', function(collParams = {}, currentDocId = '', token = '') {
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
    return getPubRecord( 'Todos', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'assignAll', function(collParams = {}, currentDocId = '', token = '') {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Assignments', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'assignAllActive', function(collParams = {}, currentDocId = '', token = '') {
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
    return getPubRecord( 'Assignments', { collParams, currentDocId, token, userId } );
} );


// Other / optional publications
Meteor.publish( 'todoByRole', function( roleId ) {
    // return activity list for the roleId the user has been assigned
    // check attributes
    return Todos.find( { roleId: roleId } );
} );

Meteor.publish( 'todoByUser', function() {
    const ownerId = utils.userIdentity();
    return Todos.find( { createdBy: ownerId } );
} );
