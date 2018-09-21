/**
 * Created by saturnbay on 2014-12-25.
 * Policies/rules/conditions for service item / use case / function
 * Policies (rules): policyName, policyDesc, policyItems/Conditions []... >> serviceId
 * Policy definition: policyItemName, policyItemDesc, attConditions (itemId, relation (AND, OR, NOT, XOR...)
 * @TODO: include policyComponent: one item, group (two or more items) and groups (group combinations)
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { validatePolicy, validatePService } from '/imports/lib/utils/ValidateRecord';
import saveRecord from './shared/saveRecord';
import { mcMessage } from '/imports/lib/locales/getMessage';
import { Policies, PServices } from '/imports/collections/Central';

Meteor.methods( {
    // insert / update method:
    savePolicy( collParams, currentDocId ) {
        "use strict";
        // Check the attributes formats
        try {
            check( collParams, {
                policyCat          : String,
                policyGroup        : String,
                policyItem         : String,
                policyRelation     : String, // optional, relation applies to items combination only
                policyRelatedTo    : String, // another item within the policy items list
                policyItemOperator : String,
                policyItemType     : String,
                policyItemValue    : String,
                policyInputSource  : String,
                policyCollection   : String,
                policyCollAttribute: String,
                policyOwner        : String,
                policyDesc         : String,
                policyLang         : String,
                isActive           : Boolean
            } );
            check( currentDocId, String );

        } catch( error ) {
            return (error.reason + ':' + mcMessage.paramErrorMessage);
        }

        // Check mandatory data items, checked also on the client side
        const errors = validatePolicy( collParams );
        if( errors.policyCat || errors.policyGroup || errors.policyItem || errors.policyRelation || errors.policyOwner || errors.policyLang || errors.policyItemOperator || errors.policyItemType ) {
            throw new Meteor.Error( 'invalid-entry', mcMessage.validateInputs );
        }

        // Insert: check if duplicate record exists
        const duplicateDoc = Policies.findOne( {
            policyCat  : collParams.policyCat,
            policyGroup: collParams.policyGroup,
            policyItem : collParams.policyItem
        } ) ? true : false;

        // Update: check if another record name exists for another document/record
        const docNotUnique = Policies.findOne( {
            _id        : {
                $ne: currentDocId
            },
            policyCat  : collParams.policyCat,
            policyGroup: collParams.policyGroup,
            policyItem : collParams.policyItem
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Policies', collParams, currentDocId, duplicateDoc, docNotUnique );
    },
    removePolicy( currentDocId ) {
        "use strict";
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
        } catch( error ) {
            return (error.reason + ': ' + mcMessage.paramErrorMessage);
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Policies', currentDocId );
    },
    savePService( collParams, currentDocId ) {
        "use strict";
        // Check the attributes formats
        try {
            check( collParams, {
                pserviceService: String,
                pserviceCat    : String,
                pserviceGroup  : String,
                pserviceLang   : String,
                pserviceDesc   : String,
                isActive       : Boolean
            } );
            check( currentDocId, String );

        } catch( error ) {
            return (error.reason + ':' + mcMessage.paramErrorMessage);
        }

        // Check mandatory data items, checked also on the client side
        const errors = validatePService( collParams );
        if( errors.pserviceService || errors.pserviceCat || errors.pserviceGroup || errors.pserviceLang ) {
            throw new Meteor.Error( 'invalid-entry', mcMessage.validateInputs );
        }

        // Insert: check if duplicate record exists
        const duplicateDoc = PServices.findOne( {
            pserviceService: collParams.pserviceService,
            pserviceCat    : collParams.pserviceCat,
            pserviceGroup  : collParams.pserviceGroup
        } ) ? true : false;

        // Update: check if another record name exists for another document/record
        const docNotUnique = PServices.findOne( {
            _id            : {
                $ne: currentDocId
            },
            pserviceService: collParams.pserviceService,
            pserviceCat    : collParams.pserviceCat,
            pserviceGroup  : collParams.pserviceGroup
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'PServices', collParams, currentDocId, duplicateDoc, docNotUnique );
    },
    removePService( currentDocId ) {
        "use strict";
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
        } catch( error ) {
            return (error.reason + ': ' + mcMessage.paramErrorMessage);
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'PServices', currentDocId );
    },
} );
