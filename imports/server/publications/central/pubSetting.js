/**
 * Created by saturnbay on 2015-03-15.
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import getPubRecord from '../../methods/central/shared/getPubRecord';
import { checkError } from '../../methods/central/shared/utils';
import _ from 'lodash';
import { Settings } from "/imports/collections/Central";

Meteor.publish( 'settingAll', function(collParams = {}, currentDocId = '', token = '') {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Settings', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'settingAllActive', function(collParams = {}, currentDocId = '', token = '') {
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
    return getPubRecord( 'Settings', { collParams, currentDocId, token, userId } );
} );
