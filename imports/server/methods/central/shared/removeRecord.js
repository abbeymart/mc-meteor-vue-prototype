/**
 * Created by abbeymart on 2016-01-26.
 * Shared record / document remove method (server side)
 * Remove an existing record / document
 */
// Import required module/function(s)
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import getCollectionName from '/imports/lib/utils/getCollectionName';
import { removeLog } from './translog';
import { mcConstant } from '/imports/lib/locales/getConstant';
import { AccessKeys, Users } from '/imports/collections/Central';
import {
    checkError,
    removeDenied,
    notRemoved,
    removed,
    subItems,
    unAuthorized,
    tokenExpired,
    notFound,
    success
} from './utils';

/**
 * @param coll: Collection name
 * @param currentDocId: Current document ID for existing record/document to be deleted/removed
 * @param token:
 * @returns {*}: Return result messages for the delete/remove action
 */

export default function( coll, currentDocId, token = '' ) {
    // Check the attributes formats, using the try catch to track any errors
    try {
        check( coll, String );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    // Get current user ID
    let userId   = Meteor.userId() || '',
        userInfo = '';

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

    // Get info of the user performing the update to determine permission status (e.g. isAdmin)
    if( userId ) {
        userInfo = Users.findOne( { _id: userId } );
    }

    // Determine / Get the collection name
    const collName = getCollectionName( coll );

    if( currentDocId ) {
        // Get current document to determine/control access permissions
        // TODO: refactor role
        const currentDoc      = collName.findOne( { _id: currentDocId } );
        let removePermitted = false;
        if(currentDoc) {
            removePermitted = (
                (userId && userId === currentDoc.createdBy) || (userInfo.isAdmin)
            ) ? true : false;
        }

        // Check if current record contain sub-items to determine if remove is permissible
        const docWithSubItems = collName.findOne( { parentId: currentDocId } ) ? true : false;

        // Check permission:
        if( removePermitted ) {
            if( docWithSubItems ) {
                return subItems();
            } else {
                // Handle remove exception/error, if any (rare) or use try/catch block
                try {
                    collName.remove( { _id: currentDocId } );
                    // Log transactions (old/new records - currentDoc / docParams) in auditLog (remove-type)
                    // check the audit-log settings - to perform audit-log
                    if( mcConstant.getLogDelete() ) {
                        removeLog( coll, currentDoc, userId );
                    }
                    return removed();
                } catch( error ) {
                    return notRemoved();
                }
            }
        } else {
            return removeDenied();
        }
    }
    else {
        return notFound();
    }
}

// TODO: revisit/complete
export function removeSubRecord( coll, mainDocId, subDocId, token = '' ) {
    // Check the attributes formats, using the try catch to track any errors
    try {
        check( coll, String );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    // Get current user ID
    let userId   = this.userId || '',
        userInfo = '';

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

    // Get info of the user performing the update to determine permission status (e.g. isAdmin)
    if( userId ) {
        userInfo = Users.findOne( { _id: userId } );
    }

    // Determine / Get the collection name
    const collName = getCollectionName( coll );

    if( currentDocId ) {
        // Get current document to determine/control access permissions
        // TODO: refactor role
        const currentDoc      = collName.findOne( { _id: currentDocId } ),
              removePermitted = (
                  (userId && userId === currentDoc.createdBy) || (userInfo.isAdmin)
              ) ? true : false;

        // Check if current record contain sub-items to determine if remove is permissible
        const docWithSubItems = collName.findOne( { parentId: currentDocId } ) ? true : false;

        // Check permission:
        if( removePermitted ) {
            if( docWithSubItems ) {
                return subItems();
            } else {
                // Handle remove exception/error, if any (rare) or use try/catch block
                try {
                    collName.remove( { _id: currentDocId } );
                    // Log transactions (old/new records - currentDoc / docParams) in auditLog (remove-type)
                    // check the audit-log settings - to perform audit-log
                    if( mcConstant.getLogDelete() ) {
                        removeLog( coll, currentDoc );
                    }
                    return removed();
                } catch( error ) {
                    return notRemoved();
                }
            }
        } else {
            return removeDenied();
        }
    }
    else {
        return notFound();
    }
}

// TODO: remove multiple records