/**
 * Created by saturnbay on 2015-01-11. | Updated Mar-31-2017
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import getPubRecord from '../../methods/central/shared/getPubRecord';
import { checkError } from '../../methods/central/shared/utils';
import _ from 'lodash';
import { Labels } from "/imports/collections/Central";

// Define publicly available fields to be published for all users
Labels.publicFields = {
    labelCode: 1,
    labelName: 1,
    labelDesc: 1,
    labelLang: 1,
    isActive : 1
};

// Publish all active/inactive labels for admin users
Meteor.publish( 'labelAll', ( collParams = {}, currentDocId = '', token = '' ) => {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Labels', { collParams, currentDocId, token, userId } );
} );

//Publish active labels for all users
Meteor.publish( 'labelAllActive', ( collParams = {}, currentDocId = '', token = '' ) => {
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
        fields: Labels.publicFields,
    };

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Labels', { collParams, currentDocId, token, userId, extQuery } );
} );
