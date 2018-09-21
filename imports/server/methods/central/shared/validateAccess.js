/**
 * Created by abbeymart on 2017-01-09.
 * Validate access by userId and/or token
 */
// Import required module(s)
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { AccessKeys } from "/imports/collections/Central";
import { checkError, unAuthorized, tokenExpired, success } from './utils';

export default function( token = '' ) {
    // Check the attributes formats, using the try catch to track any errors
    try {
        check( token, String );
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
    // return userId, for token and meteor-login access
    return success( userId );
}
