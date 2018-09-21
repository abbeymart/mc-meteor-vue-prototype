/**
 * Created by abbeymart on 2016-01-26.
 * Shared save method to create/update record/documents (server side)
 * Mar-13-2016: completed and tested successfully :)
 * include optional client selected roleId  and token (for API access)
 */

// Import required module/function(s)
import { check } from 'meteor/check';
import getCollectionName from '/imports/lib/utils/getCollectionName';
import { createLog, updateLog } from './translog';
import { mcMessage } from '/imports/lib/locales/getMessage';
import { mcConstant } from '/imports/lib/locales/getConstant';
import { AccessKeys, Users } from '/imports/collections/Central';
import _ from 'lodash';
import { checkError, unAuthorized, tokenExpired, notFound, success } from './utils';

// Save (insert / update) record
/**
 *
 * @param coll: Collection name
 * @param collParams: Collection parameters (key : value)
 * @param currentDocId: Current record/document ID, for existing record to be updated
 * @param duplicateDoc: Check existence of duplicate record/document (for insert/create)
 * @param docNotUnique: Check uniqueness of record/document (for update)
 * @param token:
 * @returns {*}: Return different messages for insert and/or update action
 */

export default function( coll, collParams, currentDocId, duplicateDoc, docNotUnique, token = '' ) {
    // Check the attributes formats, using the try catch to track any errors
    try {
        check( coll, String );
        check( collParams, Object );
        check( currentDocId, String );
        check( duplicateDoc, Boolean );
        check( docNotUnique, Boolean );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    // Get the current user ID and information
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

    // Get userInfo to determine the admin status, prior to delete/remove action
    if( userId ) {
        userInfo = Users.findOne( { _id: userId } );
    }

    // @TODO: Get user role assignment(s), by user selected or default roleId
    // Requires Grants (grandUser, grantGroup) and StandardCodes (codeName for grantGroup) collections
    // Get the currentUserRole (chosen/set at login)
    // const userRole = Grants.findOne({grantUser: userId, isActive: true});
    // const userRoles = StandardCodes.find({_id: userRole.grantGroup});

    // Determine / Get the collection name
    const collName = getCollectionName( coll );

    // Update existing document/record, insert a new document/record
    if( currentDocId ) {

        // Get current document to determine/control access permissions
        // @TODO: update changePermitted condition, include collection/package role assignment
        // currentUser/userId role assignment for the collection (collName)
        const currentDoc      = collName.findOne( { _id: currentDocId } ),
              changePermitted = (
                  (userId && userId === currentDoc.createdBy) || (userInfo.isAdmin)
              ) ? true : false;

        if( changePermitted ) {
            if( docNotUnique ) {
                return {
                    code   : 'duplicate',
                    resCode: 403,
                    value  : mcMessage.docDuplicate
                };
            }
            else {
                const docParams = _.extend( collParams, {
                    updatedBy  : userId,
                    updatedDate: new Date()
                } );
                try {
                    const docId = collName.update( { _id: currentDocId }, { $set: docParams } );
                    // Log transactions (old/new records - currentDoc / docParams) in auditLog (update-type)
                    // check the audit-log settings - to perform audit-log
                    if( mcConstant.getLogUpdate() ) {
                        updateLog( coll, currentDoc, docParams, userId );
                    }
                    return {
                        code   : 'updated',
                        docId  : docId,
                        resCode: 200,
                        value  : `${docId}: Updated document / record.`
                    };
                }
                catch( error ) {
                    return {
                        code   : 'updateError',
                        resCode: 403,
                        value  : error.reason + ': ' + mcMessage.updateErrorMessage
                    };
                }
            }
        } else {
            return {
                code   : 'updateDenied',
                resCode: 403,
                value  : mcMessage.updateNotAuthorized
            };
        }
    }

    if( !duplicateDoc ) {
        // insert a new record
        const docParams = _.extend( collParams, {
            createdBy  : userId,
            createdDate: new Date()
        } );
        try {
            const docId = collName.insert( docParams );
            // Log transactions (new records - docParams) in auditLog (insert-type)
            // check the audit-log settings - to perform audit-log
            if( mcConstant.getLogCreate() ) {
                createLog( coll, docParams, userId );
            }
            return {
                code   : 'inserted',
                docId  : docId,
                resCode: 200,
                value  : `${docId}: New document/record created.`
            };
        } catch( error ) {
            return {
                code   : 'insertError',
                resCode: 403,
                value  : error.reason + ': ' + mcMessage.insertErrorMessage
            };
        }
    }
    else {
        return {
            code   : 'exist',
            resCode: 403,
            value  : 'Document/record exists.'
        };
    }
}

// TODO: revisit
export function saveSubRecord( coll, subDoc, docId, token = '' ) {
    // Check the attributes formats, using the try catch to track any errors
    try {
        check( coll, String );
        check( docId, String );
        check( subDoc, Object );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    // Get the current user ID and information
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

    // Get userInfo to determine the admin status, prior to delete/remove action
    if( userId ) {
        userInfo = Users.findOne( { _id: userId } );
    }

    // @TODO: Get user role assignment(s), by user selected or default roleId
    // Requires Grants (grandUser, grantGroup) and StandardCodes (codeName for grantGroup) collections
    // Get the currentUserRole (chosen/set at login)
    // const userRole = Grants.findOne({grantUser: userId, isActive: true});
    // const userRoles = StandardCodes.find({_id: userRole.grantGroup});

    // Determine / Get the collection name
    const collName = getCollectionName( coll );

    // Update existing document/record, insert a new document/record
    if( docId ) {
        // Get current document to determine/control access permissions
        // @TODO: update changePermitted logic, based on ownDocument & role assignment
        const currentDoc      = collName.findOne( { _id: docId } ),
              changePermitted = (
                  (userId && userId === currentDoc.createdBy) || (userInfo.isAdmin)
              ) ? true : false;

        if( changePermitted ) {
            const docParams = _.extend( subDoc, {
                updatedBy  : userId,
                updatedDate: new Date()
            } );
            try {
                const docId = collName.update( { _id: docId }, { $set: docParams }, true );
                // Log transactions (old/new records - currentDoc / docParams) in auditLog (update-type) | check
                // the audit-log settings - to perform audit-log
                if( mcConstant.getLogUpdate() ) {
                    updateLog( coll, currentDoc, docParams );
                }
                return {
                    code   : 'updated',
                    resCode: 200,
                    value  : `${docId}: Saved / Updated document / record.`
                };
            }
            catch( error ) {
                return {
                    code   : 'updateError',
                    resCode: 403,
                    value  : error.reason + ': ' + mcMessage.updateErrorMessage
                };
            }
        } else {
            return {
                code   : 'updateDenied',
                resCode: 403,
                value  : mcMessage.updateNotAuthorize
            };
        }
    } else {
        return {
            code   : 'idError',
            resCode: 403,
            value  : `Main document/ID not specified`
        };
    }
}
