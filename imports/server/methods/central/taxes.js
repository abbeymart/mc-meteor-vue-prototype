/**
 * Created by saturnbay on 2016-06-25. | Updated: 2017-03-06
 * Tax category/type | Tax table | Tax calculation:
 * Current focus: sales tax by region/country/state/city... extend to income/property/business taxes
 */
// Import required module(s)
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { validateTax } from '/imports/lib/utils/ValidateRecord';
import saveRecord from './shared/saveRecord';
import removeRecord from './shared/removeRecord';
import getRecord from './shared/getRecord';
import { checkError, validateError } from './shared/utils';
import { Taxes } from "/imports/collections/Central";

Meteor.methods( {
    getTax( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Taxes', { collParams, currentDocId, token } );
    },
    saveTax( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                taxName     : String,
                taxCat      : String,
                taxJuri     : String,   // region, country, state, local/city... determines taxLocation
                taxLocation : String,
                taxRegion   : String,
                taxCountry  : String,
                taxState    : String,
                taxCity     : String,
                taxLang     : String,
                taxAmount   : Number,
                taxUnit     : String,
                taxRangeFrom: Number,
                taxRangeTo  : Number,
                taxDesc     : String,
                isActive    : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items , checked also on the client side
        const errors = validateTax( collParams );
        if( errors.taxName || errors.taxCat || errors.taxJuri || errors.taxLocation || errors.taxAmount || errors.taxUnit || errors.taxRangeFrom || errors.taxDesc || errors.taxLang ) {
            return validateError( errors );
        }

        // Save method check, for new document/record:
        // Check if a duplicate document with the same todoName, todoType, todoLang and todoService exists, for save
        // method, to ensure uniqueness
        const duplicateDoc = Taxes.findOne(
            {
                taxName    : collParams.taxName,
                taxCat     : collParams.taxCat,
                taxLocation: collParams.taxLocation,
            }
        ) ? true : false;

        // Update method check, for existing record:
        // Check if other document with the same / changed name exist, to avoid duplicate name
        const docNotUnique = Taxes.findOne(
            {
                _id        : { $ne: currentDocId },
                taxName    : collParams.taxName,
                taxCat     : collParams.taxCat,
                taxLocation: collParams.taxLocation,
            }
        ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Taxes', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeTax( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Taxes', currentDocId, token );
    }
} );
