/**
 * Created by abbeymart on 2017-01-09.
 * Get collection(s) records for a token/userId by role assignment
 * inputs: token* and/or userId
 */
// Import required module(s)
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { searchLog } from './translog';
import { mcConstant } from '/imports/lib/locales/getConstant';
import getCollectionName from '/imports/lib/utils/getCollectionName'
import { AccessKeys, Grants, Roles, Users } from "/imports/collections/Central";
import { checkError, unAuthorized, tokenExpired, notFound, success } from './utils';
import _ from 'lodash';

export default function( coll, { collParams = {}, currentDocId = '', token = '', skip = 0, limit = 100000 } ) {
    // Check the attributes formats, using the try catch to track any errors
    try {
        check( coll, String );
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
        check( skip, Number );
        check( limit, Number );
    } catch( error ) {
        return checkError( error );
    }

    // console.log(collParams, 'getRecord');

    // Get the current user ID and information (from meteor login session, if applicable)
    let userId = Meteor.userId() || '';

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

    // Get the collection name-reference
    const collName = getCollectionName( coll );

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

        // Get permitted items (single, conditional or multiple items)
        let items = [];

        // For admin user returns all records. Otherwise, returns permitted records or owned records
        // include search info (params, keywords etc.) in audit-log
        // check the audit-log settings - to perform audit-log
        if( mcConstant.getLogRead() && !(_.isEmpty(collParams)) ) {
            searchLog( coll, collParams, userId );
        }

        if( userInfo && userInfo.isAdmin ) {
            if( currentDocId ) {
                // Get the specific item
                items = collName.findOne( { _id: currentDocId } );
                // console.log(items);
            } else if( collParams ) {
                // Get conditional items
                items = collName.find( collParams, { skip: skip, limit: limit } ).fetch();
            } else {
                // Get all items
                items = collName.find( {}, { skip: skip, limit: limit } ).fetch();
            }
        } else if( userRole && roleServices && coll === 'Services' ) {
            // TODO: update for all collections
            // Get permitted service-items
            if( currentDocId ) {
                // Get the specific permitted-item
                if( roleServices.includes( currentDocId ) ) {
                    items = collName.findOne( { _id: currentDocId } );
                }
            } else if( collParams ) {
                // Get conditional permitted-items
                items = collName.find( { _id: { $in: roleServices }, collParams }, {
                    skip : skip,
                    limit: limit
                } ).fetch();
            } else {
                // Get all permitted-items
                items = collName.find( { _id: { $in: roleServices } }, { skip: skip, limit: limit } ).fetch();
            }
        } else {
            if( currentDocId ) {
                // Get the specific owned-item
                items = collName.findOne( { _id: currentDocId, createdBy: userId });
            } else if( collParams ) {
                // Get conditional owned-items
                const docParams = _.extend( collParams, {
                    createdBy: userId
                } );
                items           = collName.find( docParams, { skip: skip, limit: limit } ).fetch();
            } else {
                // Get all owned-items
                items = collName.find( { createdBy: userId }, { skip: skip, limit: limit } ).fetch();
            }
        }

        // if (items.length <= 1) {
        //     console.log(items, collParams, skip, limit, coll);
        // }

        // Check result and perform next action or send error message
        if( items && items.length > 0 ) {
            return success( items );
        } else {
            return notFound();
        }
    } else {
        // no loginToken / userId, can't be authorized
        return unAuthorized();
    }
}
