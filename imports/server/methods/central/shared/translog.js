/**
 * Created by abbeymart on 2016-02-14.
 * Log transactions activities - search/keywords, update and remove activities
 * Insert task is implicitly logged (createdBy) in the data-store
 */
// Steps:
// Prior to taken action: search, update or remove (action types)
// Receive collName and changed collAttributes values {key:value} from the activity function
// Store changed records, including actionBy, actionDate, ip-address?) in the audit-log collection

// Import required module/function(s)
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import getCurrentLanguage from "/imports/lib/utils/Language";
import { mcConstant } from "/imports/lib/locales/getConstant";
import { Audits } from '/imports/collections/Central';
import { checkError } from './utils';

// Get current user ID and set current date
const actionDate = new Date(),
      actionLang = getCurrentLanguage();

export function searchLog( coll, searchParams, actionBy = '' ) {
    const actionType = mcConstant.getSearchLogType();
    // Check the parameters format and log record
    try {
        check( coll, String );
        check( searchParams, Object );
        check( actionBy, String );
        Audits.insert( {
            collName    : coll,
            searchParams: searchParams,
            actionType  : actionType,
            actionLang  : actionLang,
            actionBy    : Meteor.userId() || actionBy,
            actionDate  : actionDate
        } );
    } catch( error ) {
        checkError( error );
    }
}

export function createLog( coll, collParams, actionBy = '' ) {
    const actionType = mcConstant.getCreateLogType();
    // Check the parameters format and log record
    try {
        check( coll, String );
        check( collParams, Object );
        check(actionBy, String);
        Audits.insert( {
            collName  : coll,
            collValues: collParams,
            actionType: actionType,
            actionLang: actionLang,
            actionBy  : Meteor.userId() || actionBy,
            actionDate: actionDate
        } );
    } catch( error ) {
        checkError( error );
    }
}

export function updateLog( coll, collOldParams, collNewParams, actionBy = '' ) {
    const actionType = mcConstant.getUpdateLogType();
    // Check the parameters format and log record
    try {
        check( coll, String );
        check( collOldParams, Object );
        check( collNewParams, Object );
        check(actionBy, String);
        Audits.insert( {
            collName     : coll,
            collOldValues: collOldParams,
            collNewValues: collNewParams,
            actionType   : actionType,
            actionLang   : actionLang,
            actionBy     : Meteor.userId() || actionBy,
            actionDate   : actionDate
        } );
    } catch( error ) {
        checkError( error );
    }
}

export function removeLog( coll, collParams, actionBy = '' ) {
    const actionType = mcConstant.getRemoveLogType();
    // Check the parameters format
    try {
        check( coll, String );
        check( collParams, Object );
        check(actionBy, String);
        Audits.insert( {
            collName  : coll,
            collValues: collParams,
            actionType: actionType,
            actionLang: actionLang,
            actionBy  : Meteor.userId() || actionBy,
            actionDate: actionDate
        } );
    } catch( error ) {
        checkError( error );
    }
}

export function loginLog( loginParams, actionBy = '' ) {
    const actionType = mcConstant.getLoginType();
    // Check the parameters format
    try {
        check( loginParams, {
            loginId      : String,
            loginUsername: String,
            loginDate    : Date,
            loginIp      : String,
            loginGeo     : Object,
            loginBrowser : String,
            loginProtocol: String,
            loginHost    : String
        } );
        check(actionBy, String);
        Audits.insert( {
            collValues: loginParams,
            actionType: actionType,
            actionLang: actionLang,
            actionBy  : Meteor.userId() || actionBy,
            actionDate: actionDate
        } );
    } catch( error ) {
        checkError( error );
    }
}

export function logoutLog( logoutParams, actionBy = '' ) {
    const actionType = mcConstant.getLogoutType();
    // Check the parameters format
    try {
        check( logoutParams, {
            logoutId      : String,
            logoutUsername: String,
            logoutDate    : Date,
            logoutIp      : String
        } );
        check(actionBy, String);
        Audits.insert( {
            collValues: logoutParams,
            actionType: actionType,
            actionLang: actionLang,
            actionBy  : Meteor.userId() || actionBy,
            actionDate: actionDate
        } );
    } catch( error ) {
        checkError( error );
    }
}

// Client-side accessible audit functions (loginLog and logoutLog):
Meteor.methods( {
    loginLog( loginParams, actionBy = '' ) {
        const actionType = mcConstant.getLoginType();
        // Check the parameters format
        try {
            check( loginParams, {
                loginId      : String,
                loginUsername: String,
                loginDate    : Date,
                loginIp      : String,
                loginBrowser : String,
                loginProtocol: String,
                loginHost    : String
            } );
            check(actionBy, String);
            Audits.insert( {
                collValues: loginParams,
                actionType: actionType,
                actionLang: actionLang,
                actionBy  : Meteor.userId() || actionBy,
                actionDate: actionDate
            } );
        } catch( error ) {
            checkError( error );
        }
    },
    logoutLog( logoutParams, actionBy = '' ) {
        const actionType = mcConstant.getLogoutType();
        // Check the parameters format
        try {
            check( logoutParams, {
                logoutId      : String,
                logoutUsername: String,
                logoutDate    : Date,
                logoutIp      : String
            } );
            check(actionBy, String);
            Audits.insert( {
                collValues: logoutParams,
                actionType: actionType,
                actionLang: actionLang,
                actionBy  : Meteor.userId() || actionBy,
                actionDate: actionDate
            } );
        } catch( error ) {
            checkError( error );
        }
    },
    searchLog( coll, searchKey, actionBy = '' ) {
        const actionType = mcConstant.getSearchLogType();
        // Check the parameters format and log record
        try {
            check( coll, String );
            check( searchKey, String );
            check(actionBy, String);
            Audits.insert( {
                collName  : coll,
                keyword   : searchKey,
                actionType: actionType,
                actionLang: actionLang,
                actionBy  : Meteor.userId() || actionBy,
                actionDate: actionDate
            } );
        } catch( error ) {
            checkError( error );
        }
    },
    stateInfo( serviceItem, stateId, stateInfo ) {
        try {
            check( serviceItem, String );
            check( stateId, String );
            check( stateInfo, Object );
        } catch( error ) {
            checkError( error );
        }
        // Store the state information (persist) in the data-store, include date/time and version

    },
} );
