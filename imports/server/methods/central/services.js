/**
 * Created by saturnbay on 2014-11-02.
 * Service collection, schema, access controls and methods for mConnect solutions components/objects
 * This collection will hold the functions information used for role based menu display and activities
 * Items: name, desc, isFree, isActive, createdBy, createdDate, updatedBy, updatedDate, parendId,
 * type (solution, package/module, function), access [groupId, accessType]
 * @TODO: review the removeService and checkService methods for needs/correctness
 */
// Import required module(s)
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { validateService, validateRole } from "/imports/lib/utils/ValidateRecord";
import saveRecord, { saveSubRecord } from './shared/saveRecord';
import removeRecord, { removeSubRecord } from './shared/removeRecord';
import getTextRecord from './shared/getTextRecord';
import getRecord from './shared/getRecord';
import { Services, AccessKeys, Grants, Roles, Users } from "/imports/collections/Central";
import { checkError, validateError, unAuthorized, tokenExpired, notFound, success } from './shared/utils';

// Methods to create, update and delete data / documents
Meteor.methods( {
    getService( collParams = {}, currentDocId = '', token = '', skip = 0, limit = 100000 ) {
        // console.log(collParams. currentDocId, token, skip, limit);
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
            check( skip, Number );
            check( limit, Number );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Services', { collParams, currentDocId, token, skip, limit } );
    },
    getServiceText( searchText = '', token = '', skip = 0, limit = 100000 ) {
        try {
            check( searchText, String );
            check( token, String );
            check( skip, Number );
            check( limit, Number );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getTextRecord( 'Services', { searchText, token, skip, limit } );
    },
    saveService( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                serviceName    : String,
                serviceDesc    : String,
                serviceCost    : Number,
                servicePriority: Number,
                serviceType    : String,
                parentId       : String,
                serviceLang    : String,
                servicePath    : String,
                isActive       : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items , checked also on the client side
        const errors = validateService( collParams );
        if( errors.serviceName || errors.serviceDesc || errors.serviceType || errors.servicePath || errors.serviceLang )
            return validateError( errors );

        // Save method check, for new document/record:
        // Check if a duplicate document with the same serviceName and serviceType  exists, for save
        // method, To ensure uniqueness
        const duplicateDoc = Services.findOne( {
            serviceName: collParams.serviceName,
            serviceType: collParams.serviceType
        } ) ? true : false;

        // Check if another document with the same / changed name exist, to avoid duplicate name
        const docNotUnique = Services.findOne( {
            _id        : { $ne: currentDocId },
            serviceName: collParams.serviceName,
            serviceType: collParams.serviceType
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Services', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeService( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Services', currentDocId, token );
    },
    getServiceByRole( collParams = {}, currentDocId = '', token = '', skip = 0, limit = 100000 ) {
        // Get service-items by role assignment. TODO: extend to other collections/methods as appropriate
        // Get default user-role from Users collection
        // Get permitted services (ids) from Roles collection
        // Get permitted service-items from Services collection
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
            check( skip, Number );
            check( limit, Number );
        } catch( error ) {
            return checkError( error );
        }

        // Get the current user ID and information (from meteor login session, if applicable)
        let userId = this.userId || '';

        // Check authentication:
        if( !userId && !token ) {
            // no loginToken / userId, can't be authorized
            return unAuthorized();
        }

        // validate token access
        if( token ) {
            const tokenInfo = AccessKeys.findOne( { token: token } );
            if( tokenInfo ) {
                userId = tokenInfo.userId;
                if( Date.now() > parseInt( tokenInfo.expire ) ) {
                    // login token has expired, require login/new token
                    return tokenExpired();
                }
            }
        }

        // Perform query actions, for authenticated / authorized user/request (re-validation*)
        if( userId ) {
            // Get default user-role from Users collection
            let userRole   = '';
            const userInfo = Users.findOne( { _id: userId } );
            if( userInfo && userInfo.profile.defaultRole ) {
                userRole = userInfo.profile.defaultRole;
            }

            // Get permitted services (ids) from Roles collection
            let roleServices = [];
            const roles      = Roles.find( { roleGroup: userRole } ).fetch();
            roles.forEach( ( item ) => {
                roleServices.push( item.roleService );
            } );

            // Get permitted service-items (single, conditional or multiple items)
            let items = '';

            // For admin user returns all records, otherwise returns permitted records or owned records
            if( userInfo && userInfo.isAdmin ) {
                if( currentDocId ) {
                    // Get the specific item
                    items = Services.findOne( { _id: currentDocId } ).fetch();
                } else if( collParams ) {
                    // Get conditional items
                    items = Services.find( collParams ).fetch();
                } else {
                    // Get all items
                    items = Services.find( {} ).fetch();
                }
            } else if( userRole && roleServices ) {
                if( currentDocId ) {
                    // Get the specific item
                    items = Services.findOne( { _id: currentDocId, createdBy: userId } ).fetch();
                } else if( collParams ) {
                    // Get conditional items
                    const docParams = _.extend( collParams, {
                        createdBy: userId
                    } );
                    items           = Services.find( docParams ).fetch();
                } else {
                    // Get all items
                    items = Services.find( { createdBy: userId } ).fetch();
                }
            } else {
                if( currentDocId ) {
                    // Get the specific item
                    items = Services.findOne( { _id: currentDocId, createdBy: userId } ).fetch();
                } else if( collParams ) {
                    // Get conditional items
                    const docParams = _.extend( collParams, {
                        createdBy: userId
                    } );
                    items           = Services.find( docParams ).fetch();
                } else {
                    // Get all items
                    items = Services.find( { createdBy: userId } ).fetch();
                }
            }

            // Check result and perform next action or send error message
            if( items.length > 0 ) {
                return success( items );
            } else {
                return notFound();
            }
        } else {
            // no loginToken / userId, can't be authorized
            return unAuthorized();
        }
    },
    // TODO: revisit/complete
    saveServiceRole( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                roleGroup  : String,
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

        // compose role items for insert or update

        // Check mandatory data items, checked also on the client side
        let errors = validateRole( collParams );
        if( errors.roleGroup || errors.roleService || errors.roleDesc ) {
            return validateError( errors );
        }

        // Insert: check if duplicate record exists
        const duplicateDoc = Services.findOne(
            { _id: collParams.roleService },
            { roles: { 'roleGroup': collParams.roleGroup } }
        ) ? true : false;

        // Update: check if another record name exists for the same docId
        const docNotUnique = Services.findOne(
            { _id: collParams.roleService },
            { roles: { 'roleGroup': { $ne: collParams.roleGroup } } }
        ) ? true : false;

        // save embedded document: collName, mainDocId, emDocId, emDoc, token

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Roles', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeServiceRole( serviceId, roleId, token = '' ) {

        // Check the attributes formats, using the try catch to track any errors
        try {
            check( serviceId, String );
            check( roleId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // Perform the remove action, for a role-item(roleId) within a service-item(roleId)

        return removeRecord( 'Services', currentDocId, token );
    },
} );
