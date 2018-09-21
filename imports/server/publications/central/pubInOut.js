/**
 * Created by saturnbay on 2015-01-04. | Updated: Mar-31-2017
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import getPubRecord from '../../methods/central/shared/getPubRecord';
import { checkError } from '../../methods/central/shared/utils';
import _ from 'lodash';
import { InOuts } from "/imports/collections/Central";

Meteor.publish( 'ioAll', function( collParams = {}, currentDocId = '', token = '' ) {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'InOuts', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'ioAllActive', function( collParams = {}, currentDocId = '', token = '' ) {
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
    return getPubRecord( 'InOuts', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'ioByRole', function( roleId ) {
    // return activity list for the roleId the user has been assigned
    // check attributes
    return InOuts.find( { roleId: roleId } );
} );
