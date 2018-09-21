/**
 * Created by saturnbay on 2014-12-14.
 * Info: errorCode, errorMessage, userId, errorDate, transEvent...
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { mcMessage } from '/imports/lib/locales/getMessage';
import { validateEman } from '/imports/lib/utils/ValidateRecord';
import removeRecord from './shared/removeRecord';
import saveRecord from './shared/saveRecord';
import getRecord from './shared/getRecord';
import { Emans } from "/imports/collections/Central";

Meteor.methods( {
    getEman( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return {
                code   : 'Params-Error',
                resCode: 406,
                value  : error + ': ' + mcMessage.paramErrorMessage
            };
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Emans', { collParams, currentDocId, token } );
    },
    // insert / update method:
    saveEman( collParams, currentDocId, token = '' ) {
        // console.log('start of save');

        // Check the attributes formats
        try {
            check( collParams, {
                emanCode   : String,
                emanMessage: String,
                emanCat    : String,
                emanLang   : String,
                emanDesc   : String,
                isActive   : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return {
                code   : 'Params-Error',
                resCode: 406,
                value  : error + ': ' + mcMessage.paramErrorMessage
            };
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateEman( collParams );
        if( errors.emanCode || errors.emanType || errors.emanMessage || errors.emanLang || errors.emanDesc ) {
            throw new Meteor.Error( 'invalid-entry', mcMessage.validateInputs );
        }

        // Insert: check if duplicate record exists for the same ownerId (user, organization, contact)
        const duplicateDoc = Emans.findOne( {
            emanCode: collParams.emanCode,
            emanCat : collParams.emanCat,
            emanLang: collParams.emanLang
        } ) ? true : false;

        // Update: check if another record name exists for the same ownerId (user, organization, contact)
        const docNotUnique = Emans.findOne( {
            _id     : {
                $ne: currentDocId
            },
            emanCode: collParams.emanCode,
            emanCat : collParams.emanCat,
            emanLang: collParams.emanLang
        } ) ? true : false;

        // console.log('ready to save');

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Emans', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeEman( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return {
                code   : 'Params-Error',
                resCode: 406,
                value  : error + ': ' + mcMessage.paramErrorMessage
            };
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Emans', currentDocId, token );
    }
} );
