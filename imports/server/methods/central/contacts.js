/**
 * Created by abbeymart on 2016-03-19.
 * Contacts information management for all users
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { validateContact } from '/imports/lib/utils/ValidateRecord';
import removeRecord from './shared/removeRecord';
import saveRecord from './shared/saveRecord';
import getRecord from './shared/getRecord';
import { checkError, validateError } from './shared/utils';
import { Contacts } from '/imports/collections/Central';

Meteor.methods( {
    getContact( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Contacts', { collParams, currentDocId, token } );
    },
    // insert / update method:
    saveContact( collParams, currentDocId, token = '' ) {
        // OwnerId: user or organization ID

        // Check the attributes formats
        try {
            check( collParams, {
                contactFirstName : String,
                contactLastName  : String,
                contactMiddleName: String,
                contactLang      : String,
                contactCat       : String,
                contactAddress   : String,
                contactPhone     : String,
                contactEmail     : String,
                contactDesc      : String,
                isActive         : Boolean,
                ownerId          : String,
                ownerType        : String
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateContact( collParams );
        if( errors.contactFirstName || errors.contactLastName || errors.contactMiddleName || errors.contactCat || errors.contactDesc || errors.contactAddress || errors.contactLang || errors.contactEmail || errors.contactPhone ) {
            return validateError( errors );
        }

        // Insert: check if duplicate record exists for the same ownerId (user, organization)
        const duplicateDoc = Contacts.findOne( {
            ownerId         : collParams.ownerId,
            contactFirstName: collParams.contactFirstName,
            contactLastName : collParams.contactLastName,
            contactPhone    : collParams.contactPhone
        } ) ? true : false;

        // Update: check if another record name exists for the same ownerId (user, organization)
        const docNotUnique = Contacts.findOne( {
            _id            : {
                $ne: currentDocId
            },
            ownerId        : collParams.ownerId,
            contactFistName: collParams.contactFirstName,
            contactLastName: collParams.contactLastName,
            contactPhone   : collParams.contactPhone
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Contacts', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeContact( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Contacts', currentDocId, token );
    }
} );
