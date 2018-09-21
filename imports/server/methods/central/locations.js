/**
 * Created by saturnbay on 2014-11-02.
 * Items: code, name, description, type (universe, world, country, state, city, warehouse, business, home, farm etc.),
 * parentId etc.
 */
// Import required module(s)
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { validateLocation } from '/imports/lib/utils/ValidateRecord';
import removeRecord from "./shared/removeRecord";
import saveRecord from './shared/saveRecord';
import getRecord from './shared/getRecord';
import getTextRecord from './shared/getTextRecord';
import { checkError, validateError } from './shared/utils';
import { Locations } from "/imports/collections/Central";

Meteor.methods( {
    getLocation( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Locations', { collParams, currentDocId, token } );
    },
    getLocationText( searchText = '', token = '', skip = 0, limit = 100000 ) {
        try {
            check( searchText, String );
            check( token, String );
            check( skip, Number );
            check( limit, Number );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getTextRecord( 'Locations', { searchText, token, skip, limit } );
    },
    saveLocation( collParams, currentDocId, token = '' ) {
        // insert / update method:
        // Check the attributes formats
        try {
            check( collParams, {
                locationCode     : String,
                locationName     : String,
                locationDesc     : String,
                locationTimezone : String,
                locationLat      : Number,
                locationLong     : Number,
                locationPhoneCode: Number,
                locationType     : String,
                locationCurrency : String,
                parentId         : String,
                locationLang     : String,
                isActive         : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateLocation( collParams );
        if( errors.locationCode || errors.locationName || errors.locationDesc || errors.locationType || errors.locationLang || errors.locationPhoneCode ) {
            return validateError( errors );
        }

        // Insert: check if a duplicate record with the same locationCode, parentId and locationLang
        // exists, for save method, To ensure uniqueness
        const duplicateDoc = Locations.findOne( {
            locationCode  : collParams.locationCode,
            locationParent: collParams.parentId,
            locationLang  : collParams.locationLang
        } ) ? true : false;

        // Check if another document with the same record being changed exist, to avoid duplicate name during
        // update
        const docNotUnique = Locations.findOne( {
            _id           : { $ne: currentDocId },
            locationCode  : collParams.locationCode,
            locationParent: collParams.parentId,
            locationLang  : collParams.locationLang
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Locations', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeLocation( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Locations', currentDocId, token );
    }
} );
