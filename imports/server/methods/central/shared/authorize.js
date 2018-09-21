/**
 * Created by saturnbay on 2014-12-16. Updated: Dec-18-2016.
 * Access/permissions to resources (packages, functions, collections, methods, publications etc.)
 * Authorization levels: isAdmin, ownDocument and role
 * Resources access/permissions (implement at all entry points):
 * > UI (services/packages/menu-items and UI elements): isAdmin and role
 * > APIs, CRUD/methods, collections/publications: isAdmin, ownDocument and role
 * > Others: exceptions (write-once/read-only by users) - TBD
 * Notes:
 * user may have multiple roles (groups), but only one role may be active at a time.
 * default role, set as part of userAccount package
 * TODO: other roles may be selected after login
 * TODO: control UI display based on permission(s)... via publications & methods
 * TODO: control actions, CRUD, from the server side (publications & methods) - in progress
 */
// Required imports
import { AccessKeys, Users, Roles, Services } from '/imports/collections/Central';
import getCollectionName from '/imports/lib/utils/getCollectionName';
import { mcMessage } from '/imports/lib/locales/getMessage';
import { checkError, tokenExpired, unAuthorized } from './utils';

/**
 * isAdmin(): determine if the logged-in user is a system-admin/power user
 * @param token
 * @returns {*} | true for admin user, else returns false
 */
export function isAdmin( token = '' ) {
    // Perform params checking
    try {
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    // Get current userId
    let userId = this.userId || '';

    // API/token access point
    if( token ) {
        const userInfo = AccessKeys.findOne( { token: token } );
        if( userInfo ) {
            userId = userInfo.userId;
            if( Date.now() > parseInt( userInfo.expire ) ) {
                // login token has expired, require login/new token
                return tokenExpired();
            }
        }
    }
    // Check admin status
    if( userId ) {
        return Users.findOne( { _id: userId } ).isAdmin || false;
    }
}

// ownDocument (created): determines if the logged-in user owns/created the document
export function ownsDocCreated( doc, token = '' ) {
    // Perform params checking
    try {
        check( doc, Object );
        check( token, String );
    } catch( error ) {
        return (error.reason + ':' + mcMessage.paramErrorMessage);
    }

    // Get current userId
    let userId = this.userId || '';

    // API/token access point
    if( token ) {
        const userInfo = AccessKeys.findOne( { token: token } );
        if( userInfo ) {
            userId = userInfo.userId;
            if( Date.now() > parseInt( userInfo.expire ) ) {
                // login token has expired, require login/new token
                return tokenExpired();
            }
        }
    }
    if( userId ) {
        // process action
        return (this.userId && (doc.createdBy === this.userId));
    }
}

// ownDocument (updated): determines if the logged-in user updated (most recent) the document
export function ownsDocUpdated( doc, token = '' ) {
    // Perform params checking
    try {
        check( doc, Object );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    // Get current userId
    let userId = this.userId || '';

    // API/token access point
    if( token ) {
        const userInfo = AccessKeys.findOne( { token: token } );
        if( userInfo ) {
            userId = userInfo.userId;
            if( Date.now() > parseInt( userInfo.expire ) ) {
                // login token has expired, require login/new token
                return tokenExpired();
            }
        }
    }
    if( userId ) {
        // process action
        return (this.userId && (doc.updatedBy === this.userId));
    }
}

// Deny permission for document/record with one or more sub-item(s) - should be removed first
export function subItems( coll, doc ) {
    // Perform params checking
    try {
        check( coll, String );
        check( doc, Object );
    } catch( error ) {
        return checkError( error );
    }
    // Get collection name
    const collection = getCollectionName( coll );

    const hasSubItem = collection.findOne( { parentId: doc._id } );
    if( hasSubItem ) {
        return false;
    } else {
        return true;
    }
}

// Services by roleId
function roleServices( roleId ) {
    // Perform params checking
    try {
        check( roleId, String );
    } catch( error ) {
        return checkError( error );
    }

    if( roleId ) {
        // Get service items by roleId
        // Get serviceIds from Roles collection
        let serviceIds     = [];
        const roleServices = Roles.find( { roleGroup: roleId } ).fetch();
        roleServices.forEach( ( item ) => {
            serviceIds.push( item.roleService );
        } );

        // Get services information/records for the serviceIds
        return Services.find( { $in: [ serviceIds ] } ).fetch();
    }
}
