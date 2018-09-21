/**
 * Created by abbeymart on 2017-01-09.
 * Get collection(s) records for a token/userId by role assignment
 * inputs: token* and/or userId
 */
// Import required module(s)
import { check } from 'meteor/check';
import { searchLog } from './translog';
import { mcConstant } from '/imports/lib/locales/getConstant';
import getCollectionName from '/imports/lib/utils/getCollectionName'
import { AccessKeys, Roles, Users } from "/imports/collections/Central";
import _ from 'lodash';

export default function( coll, { collParams = {}, currentDocId = '', token = '', userId = '', extQuery = {} } ) {
    // Check the attributes formats, using the try catch to track any errors
    try {
        check( coll, String );
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
        check( userId, String );
        check( extQuery, Object );
    } catch( error ) {
        return [];
    }

    // console.log(collParams, 'getPubRecord');

    // Get the current user ID and information (from meteor login session, if applicable)
    // let userId = this.userId || '';

    // Check authentication:
    if( !userId && !token ) {
        // no loginToken / userId, can't be authorized
        return [];
    }

    // validate token access
    if( token ) {
        const tokenInfo = AccessKeys.findOne( { token: token } );
        if( tokenInfo ) {
            userId = tokenInfo.userId;
            if( Date.now() > parseInt( tokenInfo.expire ) ) {
                // login token has expired, require login/new token
                return [];
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


        // include search info (params, keywords etc.) in audit-log
        // check the audit-log settings - to perform audit-log
        if( mcConstant.getLogRead() && !(_.isEmpty(collParams)) ) {
            searchLog( coll, collParams, userId );
        }

        // Get permitted items (single, conditional or multiple items)

        // For admin user returns all records. Otherwise, returns permitted records or owned records
        if( userInfo && userInfo.isAdmin ) {
            if( currentDocId ) {
                // Get the specific item
                return collName.find( { _id: currentDocId }, extQuery );
            } else if( collParams ) {
                // Get conditional items
                return collName.find( collParams, extQuery );
            } else {
                // Get all items
                return collName.find( {}, extQuery );
            }
        } else if( userRole && roleServices && coll === 'Services' ) {
            // Get permitted service-items
            if( currentDocId ) {
                // Get the specific permitted-item
                if( roleServices.includes( currentDocId ) ) {
                    return collName.find( { _id: currentDocId }, extQuery );
                }
            } else if( collParams ) {
                // Get conditional permitted-items
                return collName.find( { _id: { $in: roleServices }, collParams }, extQuery );
            } else {
                // Get all permitted-items
                return collName.find( { _id: { $in: roleServices } }, extQuery );
            }
        } else {
            if( currentDocId ) {
                // Get the specific owned-item
                return collName.find( { _id: currentDocId, createdBy: userId }, extQuery );
            } else if( collParams ) {
                // Get conditional owned-items
                const docParams = _.extend( collParams, {
                    createdBy: userId
                } );
                return collName.find( docParams, extQuery );
            } else {
                // Get all owned-items
                return collName.find( { createdBy: userId }, extQuery );
            }
        }
    } else {
        // no loginToken / userId, return []
        return [];
    }
}
