/**
 * Created by saturnbay on 2016-01-17.
 * Content methods maintains page information (blog, information, description etc.)
 */
// Import required module(s)
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { validateContent } from '/imports/lib/utils/ValidateRecord';
import removeRecord from './shared/removeRecord';
import saveRecord from './shared/saveRecord';
import getRecord from './shared/getRecord';
import { Contents } from "/imports/collections/Central";
import { checkError, validateError } from './shared/utils';
const sanitizeHtml = require( 'sanitize-html' );

Meteor.methods( {
    getAllContent() {
        // Public access
        "use strict";
        const items = Contents.find( { isActive: true, contentAccess: 'Public' } ).fetch();
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
    getContent( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Contents', { collParams, currentDocId, token } );
    },
    // insert / update method:
    saveContent( collParams, currentDocId, token = '' ) {

        // Check the attributes formats
        try {
            check( collParams, {
                contentTitle   : String,
                contentSubTitle: String,
                contentTag     : String,
                contentBody    : String,
                contentDesc    : String,
                contentType    : String,
                contentCat     : String,
                contentPriority: Number,
                contentAccess  : String,
                contentLang    : String,
                parentId       : String,
                isActive       : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Sanitize contentDesc (server side)
        collParams.contentBody = sanitizeHtml( collParams.contentBody );

        // Check mandatory data items, checked also on the client side
        const errors = validateContent( collParams );
        if( errors.contentTitle || errors.contentType || errors.contentCat || errors.contentLang || errors.contentSubTitle || errors.contentTag || errors.contentDesc ) {
            return validateError( errors );
        }

        // Insert: check if duplicate record exists, within the same category and language
        const duplicateDoc = Contents.findOne( {
            contentTitle: collParams.contentTitle,
            contentCat  : collParams.contentCat,
            contentLang : collParams.contentLang
        } ) ? true : false;

        // Update: check if another record name exist, within the same category and language
        const docNotUnique = Contents.findOne( {
            _id         : {
                $ne: currentDocId
            },
            contentTitle: collParams.contentTitle,
            contentCat  : collParams.contentCat,
            contentLang : collParams.contentLang
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Contents', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    // Remove an existing record / document
    removeContent( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Contents', currentDocId, token );
    }
} );
