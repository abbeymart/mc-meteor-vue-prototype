/**
 * Created by saturnbay on 2015-04-06.
 * Conversion methods: save (create and update) and delete/remove
 */
// Import required module(s)
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { validateConvert } from '/imports/lib/utils/ValidateRecord';
import saveRecord from './shared/saveRecord';
import removeRecord from './shared/removeRecord';
import getRecord from './shared/getRecord';
import { checkError, validateError } from './shared/utils';
import { Converts } from "/imports/collections/Central";

Meteor.methods( {
    getConvert( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Converts', { collParams, currentDocId, token } );
    },
    // insert / update method:
    saveConvert( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                convertCat  : String,
                convertFrom : String,
                convertTo   : String,
                convertValue: Number,
                convertLang : String,
                convertDesc : String,
                isActive    : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateConvert( collParams );
        if( errors.convertCat || errors.convertFrom || errors.convertTo || errors.convertValue || errors.convertLang || errors.convertDesc ) {
            return validateError(errors);
        }

        // Save (insert) method check, for new document/record:
        // Check if a duplicate document with the same information type exists, for save/insert method,
        // To ensure uniqueness
        const duplicateDoc = Converts.findOne( {
            convertCat : collParams.convertCat,
            convertFrom: collParams.convertFrom,
            convertTo  : collParams.convertTo,
            convertLang: collParams.convertLang
        } ) ? true : false;

        // Update method check, for existing record:
        // Check if another document with the same / changed name exist, to avoid duplicate name during update
        const docNotUnique = Converts.findOne( {
            _id        : { $ne: currentDocId },
            convertCat : collParams.convertCat,
            convertFrom: collParams.convertFrom,
            convertTo  : collParams.convertTo,
            convertLang: collParams.convertLang
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Converts', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeConvert( currentDocId, token = '' ) {

        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Converts', currentDocId, token );
    }
} );
