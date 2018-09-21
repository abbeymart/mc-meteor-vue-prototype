/**
 * Created by saturnbay on 2014-12-14.
 * Methods to save (insert and update) and delete records / documents
 */
// Import required module(s)
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { validateLanguage } from '/imports/lib/utils/ValidateRecord';
import removeRecord from './shared/removeRecord';
import saveRecord from './shared/saveRecord';
import getRecord from './shared/getRecord';
import { Languages } from '/imports/collections/Central';
import { checkError, validateError } from './shared/utils';
// import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

Meteor.methods( {
    getAllLang() {
        // Public access
        "use strict";
        const items = Languages.find( { isActive: true } ).fetch();
        // Check result and perform next action or send error message
        if( items.length > 0 ) {
            return {
                code   : 'success',
                resCode: 200,
                value  : items
            };
        } else {
            return {
                code   : 'Not-Found',
                resCode: 404,
                value  : 'No item(s) found.'
            };
        }
    },
    getLang( collParams = {}, currentDocId = '', token = '', skip = 0, limit = 100000 ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
            check( skip, Number );
            check( limit, Number );
        } catch( error ) {
            return checkError( error );
        }
        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Languages', { collParams, currentDocId, token } );
    },
    saveLang( collParams, currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( collParams, {
                langCode: String,
                langName: String,
                langDesc: String,
                isActive: Boolean
            } );
            check( currentDocId, String );
            check( token, String );

        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateLanguage( collParams );
        // let errors = Languages.Validate( collParams );
        if( errors.langCode || errors.langName ) {
            return validateError( errors );
        }

        // Insert: check if a duplicate document with the same langCode or langName exists, to ensure uniqueness
        const duplicateDoc = Languages.findOne( {
            $or: [ { langCode: collParams.langCode }, { langName: collParams.langName } ]
        } ) ? true : false;

        // Update: check if another document/record with the same/changed name exist, to avoid duplicate name
        const docNotUnique = Languages.findOne( {
            _id: {
                $ne: currentDocId
            },
            $or: [ { langCode: collParams.langCode }, { langName: collParams.langName } ]
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Languages', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    // Remove an existing record / document
    removeLang( currentDocId, token = '' ) {

        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Languages', currentDocId, token );
    }
} );

// // Get list of all method names
// const LISTS_METHODS = _.pluck( [
//     saveLang
// ], 'name' );
//
// // Only allow 5 list operations per connection per second
// DDPRateLimiter.addRule( {
//     name( name ) {
//         return _.contains( LISTS_METHODS, name );
//     },
//
//     // Rate limit per connection ID
//     connectionId() {
//         return true;
//     },
// }, 5, 1000 );
