/**
 * Created by saturnbay on 2015-01-20.
 * Functional roles assignments for menu items
 * Role assignment: group, objects and access levels
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { validateRole, validateGrant } from '/imports/lib/utils/ValidateRecord';
import getRecord from './shared/getRecord';
import saveRecord from './shared/saveRecord';
import removeRecord from "./shared/removeRecord";
import { Roles, Grants } from '/imports/collections/Central';
import { checkError, validateError } from './shared/utils';

Meteor.methods( {
    getRole( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Roles', { collParams, currentDocId, token } );
    },
    // insert / update method:
    saveRole( collParams, currentDocId, token = '' ) {
        // OwnerId: user, organization or contact ID
        // Check the attributes formats
        try {
            check( collParams, {
                roleGroup  : String,
                roleCat    : String,
                roleService: String,
                roleCreate : Boolean,
                roleRead   : Boolean,
                roleUpdate : Boolean,
                roleDelete : Boolean,
                isActive   : Boolean,
                roleDesc   : String
            } );
            check( currentDocId, String );
            check( token, String );

        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        let errors = validateRole( collParams );
        if( errors.roleGroup || errors.roleService || errors.roleDesc ) {
            return validateError( errors );
        }

        // Insert: check if duplicate record exists
        const duplicateDoc = Roles.findOne( {
            roleGroup  : collParams.roleGroup,
            roleService: collParams.roleService
        } ) ? true : false;

        // Update: check if another record name exists for the same docId
        const docNotUnique = Roles.findOne( {
            _id        : { $ne: currentDocId },
            roleGroup  : collParams.roleGroup,
            roleService: collParams.roleService
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Roles', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeRole( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Roles', currentDocId, token );
    },
    getGrant( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Grants', { collParams, currentDocId, token } );
    },
    saveGrant( collParams, currentDocId, token = '' ) {
        // OwnerId: user, organization or contact ID
        // Check the attributes formats
        try {
            check( collParams, {
                grantRole: String,
                grantUser: String,
                isActive : Boolean,
                grantDesc: String
            } );
            check( currentDocId, String );
            check( token, String );

        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateGrant( collParams );
        if( errors.grantRole || errors.grantUser || errors.grantDesc ) {
            return validateError( errors );
        }

        // Insert: check if duplicate record exists for the same ownerId (user, organization, contact)
        const duplicateDoc = Grants.findOne( {
            grantRole: collParams.grantRole,
            grantUser: collParams.grantUser
        } ) ? true : false;

        // Update: check if another record name exists for the same ownerId (user, organization, contact)
        const docNotUnique = Grants.findOne( {
            _id      : { $ne: currentDocId },
            grantRole: collParams.grantRole,
            grantUser: collParams.grantUser
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Grants', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeGrant( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Grants', currentDocId, token );
    }
} );
