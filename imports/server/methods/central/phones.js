/**
 * Created by saturnbay on 2014-12-14.
 * Phone codes information: phoneType, phoneNumber, phoneNameTag, phoneOwner
 */
// Import required module(s)
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { validatePhone } from '/imports/lib/utils/ValidateRecord';
import removeRecord from './shared/removeRecord';
import saveRecord from './shared/saveRecord';
import getRecord from './shared/getRecord';
import { checkError, validateError } from './shared/utils';
import { Phones } from "/imports/collections/Central";

Meteor.methods( {
    getPhone( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Phones', { collParams, currentDocId, token } );
    },
    // insert / update method:
    savePhone( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                contactName: String,
                contactId  : String,
                phoneNumber: String,
                phoneType  : String,
                phoneLang  : String,
                phoneDesc  : String,
                isActive   : Boolean,
                ownerId    : String,
                ownerType  : String
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validatePhone( collParams );
        if( errors.phoneNumber || errors.phoneType || errors.phoneLang || errors.phoneDesc ) {
            return validateError( errors );
        }

        // Insert: check if duplicate record exists for the same ownerId (user, organization, contact)
        const duplicateDoc = Phones.findOne( {
            contactId  : collParams.contactId,
            contactName: collParams.contactName,
            ownerId    : collParams.ownerId,
            phoneNumber: collParams.phoneNumber
        } ) ? true : false;

        // Update: check if another record name exists for the same ownerId (user, organization, contact)
        const docNotUnique = Phones.findOne( {
            _id        : {
                $ne: currentDocId
            },
            contactId  : collParams.contactId,
            contactName: collParams.contactName,
            ownerId    : collParams.ownerId,
            phoneNumber: collParams.phoneNumber
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Phones', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removePhone( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Phones', currentDocId, token );
    }
} );
