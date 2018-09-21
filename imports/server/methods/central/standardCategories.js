/**
 * Created by saturnbay on 2014-12-14.
 * Methods to save (insert and update) and delete records / documents
 */
// Import required module(s)
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { validateStandardCategory, validateStandardCode } from "/imports/lib/utils/ValidateRecord";
import removeRecord from "./shared/removeRecord";
import saveRecord from './shared/saveRecord';
import getRecord from './shared/getRecord';
import { StandardCategories, StandardCodes } from "/imports/collections/Central";
import { checkError, validateError } from './shared/utils';

Meteor.methods( {
    getCat( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError(error);
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'StandardCategories', { collParams, currentDocId, token } );
    },
    saveCat( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                catName : String,
                catDesc : String,
                catLang : String,
                isActive: Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError(error);
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateStandardCategory( collParams );
        if( errors.catName || errors.catDesc || errors.catLang ) {
            return validateError(errors);
        }

        // Save method: Check if a duplicate document with the same name exists, to ensure uniqueness
        const duplicateDoc = StandardCategories.findOne( {
            catName: collParams.catName, catLang: collParams.catLang
        } ) ? true : false;

        // Update: Check if another document/record with the same name exist, to avoid duplicate name
        const docNotUnique = StandardCategories.findOne( {
            _id    : { $ne: currentDocId },
            catName: collParams.catName, catLang: collParams.catLang
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'StandardCategories', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeCat( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError(error);
        }
        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'StandardCategories', currentDocId, token );
    },
    getCode( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError(error);
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'StandardCodes', { collParams, currentDocId, token } );
    },
    saveCode( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                codeName: String,
                codeDesc: String,
                codeCat : String,
                parentId: String,
                codeLang: String,
                isActive: Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError(error);
        }

        // Check mandatory data items , checked also on the client side
        const errors = validateStandardCode( collParams );
        if( errors.codeName || errors.codeDesc || errors.codeCat || errors.codeLang ) {
            return validateError(errors);
        }

        // Insert: check if duplicate record exists
        const duplicateDoc = StandardCodes.findOne(
            {
                codeName: collParams.codeName,
                codeCat : collParams.codeCat
            }
        ) ? true : false;

        // Update method check: check if other document with the same / changed name exist, to avoid duplicate name
        const docNotUnique = StandardCodes.findOne(
            {
                _id     : { $ne: currentDocId },
                codeName: collParams.codeName,
                codeCat : collParams.codeCat
            }
        ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'StandardCodes', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeCode( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError(error);
        }
        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'StandardCodes', currentDocId, token );
    }
} );
