/**
 * Created by saturnbay on 2015-01-20 | Updated/re-designed: Feb-24-2017
 *
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { validateRaaci } from '/imports/lib/utils/ValidateRecord';
import saveRecord from './shared/saveRecord';
import { mcMessage } from '/imports/lib/locales/getMessage';
import { Raacis } from '/imports/collections/Central';

Meteor.methods( {
    // insert / update method:
    saveRaaci( collParams, currentDocId ) {
        "use strict";
        // Check the attributes formats
        try {
            check( collParams, {
                raaciCat    : String,
                raaciService: String,
                raaciGroup   : String,
                raaciRole   : String,
                raaciLevel  : String,
                raaciLang   : String,
                raaciDesc   : String,
                isActive    : Boolean
            } );
            check( currentDocId, String );

        } catch( error ) {
            return (error.reason + ':' + mcMessage.paramErrorMessage);
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateRaaci( collParams );
        if( errors.raaciCat || errors.raaciService || errors.raaciGroup || errors.raaciRole || errors.raaciLevel || errors.raaciDesc || errors.raaciLang ) {
            throw new Meteor.Error( 'invalid-entry', mcMessage.validateInputs );
        }

        // Insert: check if duplicate record exists for the same ownerId (user, organization, contact)
        const duplicateDoc = Raacis.findOne( {
            raaciCat    : collParams.raaciCat,
            raaciService: collParams.raaciService,
            raaciGroup   : collParams.raaciGroup
        } ) ? true : false;

        // Update: check if another record name exists for the same ownerId (user, organization, contact)
        const docNotUnique = Raacis.findOne( {
            _id         : {
                $ne: currentDocId
            },
            raaciCat    : collParams.raaciCat,
            raaciService: collParams.raaciService,
            raaciGroup   : collParams.raaciGroup
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Raacis', collParams, currentDocId, duplicateDoc, docNotUnique );
    },
    removeRaaci( currentDocId ) {
        "use strict";
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
        } catch( error ) {
            return (error.reason + ': ' + mcMessage.paramErrorMessage);
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Raacis', currentDocId );
    }
} );
