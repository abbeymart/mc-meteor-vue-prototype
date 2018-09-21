/**
 * Created by saturnbay on 2016-07-01.
 * Documents/folders management methods
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { validateDocument, validateFolder } from '/imports/lib/utils/ValidateRecord';
import removeRecord from './shared/removeRecord';
import saveRecord from './shared/saveRecord';
import getRecord from './shared/getRecord';
import { checkError, validateError } from './shared/utils';
import { Documents, Folders } from '/imports/collections/Central';

Meteor.methods( {
    getDoc( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Documents', { collParams, currentDocId, token } );
    },
    saveDoc( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                docCat     : String,
                docType    : String,
                docFolder  : String,
                docName    : String,
                docFile    : String,
                docOwner   : String,
                docActivity: String,
                docRef     : String,
                docUrl     : String,
                docSize    : Number,
                docLang    : String,
                docDesc    : String,
                isActive   : Boolean
            } );
            check( currentDocId, String );
            check( token, String );

        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateDocument( collParams );
        if( errors.docCat || errors.docType || errors.docName || errors.docLang ) {
            return validateError( errors );
        }

        // reset currentDocId, to create a new record/document, for multiple file-upload
        // condition: if docFile/docName/docOwner does not existing
        const docExist = Documents.findOne( {
            docFile : collParams.docFile,
            docName : collParams.docName,
            docOwner: collParams.docOwner,
        } );
        if( !docExist ) {
            currentDocId = '';
        }

        // Insert: check if duplicate record exists
        const duplicateDoc = Documents.findOne( {
            docName  : collParams.docName,
            docFolder: collParams.docFolder,
            docOwner : collParams.docOwner,
        } ) ? true : false;

        // Update: check if another record with the same information/name exists
        const docNotUnique = Documents.findOne( {
            _id      : {
                $ne: currentDocId
            },
            docName  : collParams.docName,
            docFolder: collParams.docFolder,
            docOwner : collParams.docOwner,
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Documents', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeDoc( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Documents', currentDocId, token );
    },
    getFolder( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Folders', { collParams, currentDocId, token } );
    },
    saveFolder( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                folderName    : String,
                folderOwner   : String,
                folderActivity: String,
                parentId      : String,
                folderLang    : String,
                folderDesc    : String,
                isActive      : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateFolder( collParams );
        if( errors.folderOwner || errors.folderName || errors.folderLang ) {
            return validateError( errors );
        }

        // Insert: check if duplicate record exists
        const duplicateDoc = Folders.findOne( {
            folderName    : collParams.docName,
            folderOwner   : collParams.docOwner,
            folderActivity: collParams.folderActivity
        } ) ? true : false;

        // Update: check if another record name exists
        const docNotUnique = Folders.findOne( {
            _id           : {
                $ne: currentDocId
            },
            folderName    : collParams.docName,
            folderOwner   : collParams.docOwner,
            folderActivity: collParams.folderActivity
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Folders', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeFolder( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Folders', currentDocId, token );
    }
} );
