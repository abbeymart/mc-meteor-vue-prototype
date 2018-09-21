/**
 * Created by saturnbay on 2015-01-20.
 * Info: addressOwner, streetNumber, streetName, addressCity, addressState,
 * addressCountry, postalCode, addressType (home, business/work etc.)...
 * ownerId: userId, orgId or contactId for the address
 * ownerType: User, Organization, Contact...
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { validateAddress } from '/imports/lib/utils/ValidateRecord';
import removeRecord from './shared/removeRecord';
import saveRecord from './shared/saveRecord';
import getRecord from './shared/getRecord';
import { checkError, validateError } from './shared/utils';
import { Addresses, Audits } from '/imports/collections/Central';

Meteor.methods( {
    getAudit( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Audits', { collParams, currentDocId, token } );
    },
    // TODO: insert / update method ??
    saveAudit( collParams, currentDocId, token = '' ) {
        // OwnerId: user, organization or contact ID

        // Check the attributes formats
        try {
            check( collParams, {
                streetNumber  : Number,
                streetName    : String,
                streetType    : String,
                postalCode    : String,
                addressCity   : String,
                addressState  : String,
                addressCountry: String,
                addressLang   : String,
                addressType   : String,
                addressDesc   : String,
                isActive      : Boolean,
                ownerId       : String,
                ownerType     : String
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateAddress( collParams );
        if( errors.streetNumber || errors.streetName || errors.postalCode || errors.addressCity || errors.addressState || errors.addressCountry || errors.addressLang || errors.addressType ) {
            return validateError( errors );
        }

        // Insert: check if duplicate record exists for the same ownerId (user, organization, contact)
        const duplicateDoc = Addresses.findOne(
            {
                ownerId       : collParams.ownerId,
                streetNumber  : collParams.streetNumber,
                streetName    : collParams.streetName,
                postalCode    : collParams.postalCode,
                addressCity   : collParams.addressCity,
                addressState  : collParams.addressState,
                addressCountry: collParams.addressCountry
            }
        ) ? true : false;

        // Update: check if another record name exists for the same ownerId (user, organization, contact)
        const docNotUnique = Addresses.findOne(
            {
                _id           : {
                    $ne: currentDocId
                },
                ownerId       : collParams.ownerId,
                streetNumber  : collParams.streetNumber,
                streetName    : collParams.streetName,
                postalCode    : collParams.postalCode,
                addressCity   : collParams.addressCity,
                addressState  : collParams.addressState,
                addressCountry: collParams.addressCountry
            }
        ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Audits', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },

    // TODO: remove ??
    removeAudit( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Audits', currentDocId, token );
    }
} );