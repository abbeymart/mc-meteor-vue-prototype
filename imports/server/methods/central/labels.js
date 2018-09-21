/**
 * Created by saturnbay on 2015-01-11.
 * Methods to save (insert and update) and delete records / documents
 */
// Import required module(s)
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { validateLabel } from '/imports/lib/utils/ValidateRecord';
import removeRecord from "./shared/removeRecord";
import saveRecord from './shared/saveRecord';
import getRecord from './shared/getRecord';
import { Labels } from "/imports/collections/Central";
import { checkError, validateError } from './shared/utils';

Meteor.methods( {
    getAllLabel() {
        // Public access of all labels, messages, constants, plurals, currencies etc.
        "use strict";
        const items = Labels.find( { isActive: true } ).fetch();
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
    getLabel( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Labels', { collParams, currentDocId, token } );
    },
    saveLabel( collParams, currentDocId, token = '' ) {

        // console.log(collParams);
        // Check the attributes formats
        try {
            check( collParams, {
                labelCode: String,
                labelName: String,
                labelLang: String,
                labelCat : String,
                labelDesc: String,
                isActive : Boolean
            } );
            check( currentDocId, String );
            check( token, String );

        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateLabel( collParams );
        if( errors.labelCode || errors.labelName || errors.labelLang )
            return validateError( errors );

        // Insert: check if duplicate record exists
        const duplicateDoc = Labels.findOne( {
            labelCode: collParams.labelCode, labelLang: collParams.labelLang
        } ) ? true : false;

        // Update: check if another document/record with the same/changed name exist, to avoid duplicate name
        const docNotUnique = Labels.findOne( {
            _id      : {
                $ne: currentDocId
            },
            labelCode: collParams.labelCode, labelLang: collParams.labelLang
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Labels', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeLabel( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Labels', currentDocId, token );
    },
} );
