/**
 * Created by saturnbay on 2014-11-02.
 * <b>Organization model/collection objects</b>
 * Information items: Organization/business number, name, description, registration date, location(id), type
 * (corporation, sole, partnership, department, business unit, ministry, division, branch, program, section, team,
 * unit etc.), parentId, isActive, createdBy, createdDate, industry (technology, manufacturing, logistics,
 * banking/finance, etc.), others ( collections* / [arrays] / {objects}) - addresses, contacts, phones, taxes,
 * documents etc.
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { validateOrganization } from '/imports/lib/utils/ValidateRecord';
import removeRecord from './shared/removeRecord';
import saveRecord from './shared/saveRecord';
import getRecord from './shared/getRecord';
import getTextRecord from './shared/getTextRecord';
import { checkError, validateError } from './shared/utils';
import { Organizations } from "/imports/collections/Central";

Meteor.methods( {
    getOrg( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Organizations', { collParams, currentDocId, token } );
    },
    getOrgText( searchText = '', token = '', skip = 0, limit = 100000 ) {
        try {
            check( searchText, String );
            check( token, String );
            check( skip, Number );
            check( limit, Number );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getTextRecord( 'Organizations', { searchText, token, skip, limit } );
    },
    saveOrg( collParams, currentDocId, token = '' ) {
        // insert / update method:
        // Check the attributes formats
        // Storing date in long format:
        collParams.orgRegDate = new Date( collParams.orgRegDate );
        try {
            check( collParams, {
                orgNumber  : String,
                orgName    : String,
                orgDesc    : String,
                orgType    : String,
                orgIndustry: String,
                orgRegDate : Date,
                orgCountry : String,
                orgState   : String,
                orgCity    : String,
                parentId   : String,
                orgAddress : String,
                orgLang    : String,
                isActive   : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items , checked also on the client side
        const errors = validateOrganization( collParams );
        if( errors.orgName || errors.orgType || errors.orgCountry || errors.orgState || errors.orgLocation || errors.orgLang || errors.orgDesc || errors.orgCity || errors.orgAddress ) {
            return validateError( errors );
        }

        // Insert: check if duplicate record exists for the same ownerId (user, organization, contact)
        const duplicateDoc = Organizations.findOne( {
            orgNumber : collParams.orgNumber,
            orgName   : collParams.orgName,
            orgCountry: collParams.orgLocation
        } ) ? true : false;

        // Update: check if another record name exists for the same ownerId (user, organization, contact)
        const docNotUnique = Organizations.findOne( {
            _id       : { $ne: currentDocId },
            orgNumber : collParams.orgNumber,
            orgName   : collParams.orgName,
            orgCountry: collParams.orgLocation
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Organizations', collParams, currentDocId, duplicateDoc, docNotUnique, token );

    },
    removeOrg( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Organizations', currentDocId, token );
    }
} );
