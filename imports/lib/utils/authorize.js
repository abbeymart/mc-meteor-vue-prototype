/**
 * Created by saturnbay on 2014-12-16. Updated: Dec-18-2016.
 * Access/permissions to resources (packages, functions, collections, methods, publications etc.)
 * Authorization levels: isAdmin, ownDocument and group (role assignment)
 * Resources access/permissions (implement at all entry points):
 * > UI (services/packages/menu-items and UI elements): isAdmin and group
 * > APIs, CRUD/methods, collections/publications: isAdmin, ownDocument and group
 * > Others: exceptions (write-once/read-only by users) - TBD
 * Notes:
 * user may have multiple roles (groups), but only one role may be active at a time.
 * @TODO: default role, set as part of users-profile, other roles may be selected after login
 * @TODO: control UI display based on permission(s)... control via publications/subscription
 * @TODO: control actions, CRUD, from the server side (publications & methods) - in progress
 */
// Required imports
// import { Meteor } from 'meteor/meteor';
// import { mcMessage } from '/imports/lib/locales/getMessage';
// import { mcConstant } from '/imports/lib/locales/getConstant';
import { AccessKeys, Users, Grants, Roles, Services } from '/imports/collections/Central';
import getCollectionName from '/imports/lib/utils/getCollectionName';

// TODO: standardize response as: success or error
// isAdmin: determine if the logged-in user is a system-admin/power user
export function isAdmin( token = '' ) {
    // Get current userId
    let userId = this.userId || '';

    // API access point
    if( token ) {
        const userInfo = AccessKeys.findOne( { token: token } );
        userId         = userInfo.userId;
        if( Date.now() > parseInt( userInfo.expire ) ) {
            // login token has expired, require login/new token
            return {
                code   : 'Token-Expired',
                resCode: 401,
                value  : 'Unauthorized. Token / Access-key has expired. Please login again.'
            };
        }
    }
    // Check admin status
    if( userId ) {
        return Users.findOne( { _id: userId } ).isAdmin;
    } else {
        return {
            code   : 'No-Access',
            resCode: 401,
            value  : 'Unauthorized. Access-key/User information not provided. Please login again.'
        };
    }

}

// ownDocument (created): determines if the logged-in user owns/created the document
export function ownsDocCreated( doc, token = '' ) {
    // Get current userId
    let userId = this.userId || '';

    // API access point
    if( token ) {
        const userInfo = AccessKeys.findOne( { token: token } );
        userId         = userInfo.userId;
        if( Date.now() > parseInt( userInfo.expire ) ) {
            // login token has expired, require login/new token
            return {
                code   : 'Token-Expired',
                resCode: 401,
                value  : 'Unauthorized. Token / Access-key has expired. Please login again.'
            };
        }
    }
    if( userId ) {
        // process action
        return ((this.userId && doc.createdBy === this.userId));
    }
}

// ownDocument (updated): determines if the logged-in user updated (most recent) the document
export function ownsDocUpdated( doc, token = '' ) {
    // Get current userId
    let userId = this.userId || '';

    // API access point
    if( token ) {
        const userInfo = AccessKeys.findOne( { token: token } );
        userId         = userInfo.userId;
        if( Date.now() > parseInt( userInfo.expire ) ) {
            // login token has expired, require login/new token
            return {
                code   : 'Token-Expired',
                resCode: 401,
                value  : 'Unauthorized. Token / Access-key has expired. Please login again.'
            };
        }
    }
    if( userId ) {
        // process action
        return ((this.userId && doc.updatedBy === this.userId));
    }
}

// Role/grant assignments
// grants: user assigned role(s)
// roles: services, and access levels (Create, Read, Update, Delete)

// Get user role(s) -- from grants collection
function grantedRoles( token = '' ) {
    // Get current userId
    let userId = this.userId || '';

    // API access point
    if( token ) {
        const userInfo = AccessKeys.findOne( { token: token } );
        userId         = userInfo.userId;
        if( Date.now() > parseInt( userInfo.expire ) ) {
            // login token has expired, require login/new token
            return {
                code   : 'Token-Expired',
                resCode: 401,
                value  : 'Unauthorized. Token / Access-key has expired. Please login again.'
            };
        }
    }
    if( userId ) {
        // returns granted role(s), roleIds, for the current user: object(1) or array(>1)
        return Grants.find( { grantUser: userId } ).fetch();
    } else {
        return {
            code   : 'Not-Authorized',
            resCode: 401,
            value  : 'Unauthorized. Token / Access-key required.'
        };
    }
}

// Get role assignments by role: services and access levels -- from roles and services collections
export function roleAssignments( role = '', token = '' ) {
    // Get current userId
    let userId = this.userId || '';

    // API access point
    if( token ) {
        const userInfo = AccessKeys.findOne( { token: token } );
        userId         = userInfo.userId;
        if( Date.now() > parseInt( userInfo.expire ) ) {
            // login token has expired, require login/new token
            return {
                code   : 'Token-Expired',
                resCode: 401,
                value  : 'Unauthorized. Token / Access-key has expired. Please login again.'
            };
        }
    }

    // current user role, selected or default
    let currentRole = role;
    if( userId ) {
        // determine the default role (TODO, defaultRole from users collection)
        currentRole = Users.findOne( { _id: userId } ).defaultRole;
    }

    /** Get services and action permitted [{ service: {}, action:{} },...], from Roles collection:
     * roleGroup(Id), serviceId, roleRead, roleCreate, roleUpdate, roleDelete (true/false) => user the
     * [serviceId] to extract service items from services collection (for UI-menu display) and the
     * roleAccess to perform CRUD operations.
     * */

    return Roles.find( { roleGroup: currentRole } ).fetch();
}

// Deny permission for document/record with one or more sub-item(s) - should be removed first
export function allowDelete( coll, doc ) {
    "use strict";
    const collection = getCollectionName( coll );

    const hasSubItem = collection.findOne( { parentId: doc._id } );
    if( hasSubItem ) {
        return false;
    } else {
        return true;
    }
}
