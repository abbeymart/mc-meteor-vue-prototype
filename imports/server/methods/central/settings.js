/**
 * Created by saturnbay on 2014-12-30.
 */
// Import required module(s)
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { validateSetting } from '/imports/lib/utils/ValidateRecord';
import saveRecord from './shared/saveRecord';
import removeRecord from './shared/removeRecord';
import getRecord from './shared/getRecord';
import { Settings } from "/imports/collections/Central";
import { checkError, validateError } from './shared/utils';

Meteor.methods( {
    getSetting( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Settings', { collParams, currentDocId, token } );
    },
    saveSetting( collParams, currentDocId, token = '' ) {
        // insert / update method:
        // console.log( collParams );
        // Check the attributes formats
        try {
            check( collParams, {
                settingCat     : String,
                settingName    : String,
                settingRelation: String,
                settingValue   : String,
                settingLang    : String,
                settingDesc    : String,
                isActive       : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateSetting( collParams );
        if( errors.settingCat || errors.settingName || errors.settingRelation || errors.settingValue || errors.settingDesc ) {
            return validateError( errors );
        }

        // Insert: check if duplicate record exists
        const duplicateDoc = Settings.findOne( {
            settingCat : collParams.settingCat,
            settingName: collParams.settingName,
            settingLang: collParams.settingLang
        } ) ? true : false;

        // Update: check if another record with the same information exists
        const docNotUnique = Settings.findOne( {
            _id        : { $ne: currentDocId },
            settingCat : collParams.settingCat,
            settingName: collParams.settingName,
            settingLang: collParams.settingLang
        } ) ? true : false;


        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Settings', collParams, currentDocId, duplicateDoc, docNotUnique, token );

    },
    removeSetting( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Settings', currentDocId, token );
    }
} );
