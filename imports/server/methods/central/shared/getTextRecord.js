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

export default function( coll, { searchText = '', token = '', skip = 0, limit = 100000 } ) {
    // Check the attributes formats, using the try catch to track any errors
    try {
        check( coll, String );
        check( searchText, String );
        check( token, String );
        check( skip, Number );
        check( limit, Number );
    } catch( error ) {
        return checkError( error );
    }

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
        let userRole = '';
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
        let items = '';

        const collParams = {
            searchText: searchText,
        };

        // For admin user returns all records. Otherwise, returns permitted records or owned records
        // include search info (params, keywords etc.) in audit-log
        // check the audit-log settings - to perform audit-log
        if( mcConstant.getLogRead() && !(_.isEmpty( collParams )) ) {
            searchLog( coll, collParams, userId );
        }

        if( userInfo && userInfo.isAdmin ) {
            items = collName.find( { $text: { $search: searchText } }, { skip: skip, limit: limit } ).fetch();
        } else if( userRole && roleServices && coll === 'Services' ) {
            // TODO: update for all collections
            items = collName.find( { $text: { $search: searchText } }, { skip: skip, limit: limit } ).fetch();
        } else {
            items = collName.find( { createdBy: userId }, { $text: { $search: searchText } }, {
                skip : skip,
                limit: limit
            } ).fetch();
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
}
