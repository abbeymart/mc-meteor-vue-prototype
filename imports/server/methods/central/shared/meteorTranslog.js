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
import { mcMessage } from '/imports/lib/locales/getMessage';
import { mcConstant } from "/imports/lib/locales/getConstant";
import { Audits } from '/imports/collections/Central';

// Get current user ID and set current date
const actionDate = new Date(),
      actionLang = getCurrentLanguage();

export function searchLog( coll, searchKey ) {
    "use strict";
    const actionType = mcConstant.getSearchLogType(),
          userId     = Meteor.userId();

    // Check the parameters format and log record
    try {
        check( coll, String );
        check( searchKey, String );
        Audits.insert( {
            collName  : coll,
            keyword   : searchKey,
            actionType: actionType,
            actionLang: actionLang,
            actionBy  : userId,
            actionDate: actionDate
        } );
    } catch( error ) {
        throw new Meteor.Error( 'searchLogError', error.reason + ':' + mcMessage.paramErrorMessage );
    }
}

export function createLog( coll, collParams ) {
    "use strict";
    const actionType = mcConstant.getCreateLogType(),
          userId     = Meteor.userId();
    // Check the parameters format and log record
    try {
        check( coll, String );
        check( collParams, Object );
        Audits.insert( {
            collName  : coll,
            collValues: collParams,
            actionType: actionType,
            actionLang: actionLang,
            actionBy  : userId,
            actionDate: actionDate
        } );
    } catch( error ) {
        throw new Meteor.Error( 'createLogError', error.reason + ':' + mcMessage.paramErrorMessage );
    }
}

export function updateLog( coll, collOldParams, collNewParams ) {
    "use strict";
    const actionType = mcConstant.getUpdateLogType(),
          userId     = Meteor.userId();
    // Check the parameters format and log record
    try {
        check( coll, String );
        check( collOldParams, Object );
        check( collNewParams, Object );
        Audits.insert( {
            collName     : coll,
            collOldValues: collOldParams,
            collNewValues: collNewParams,
            actionType   : actionType,
            actionLang   : actionLang,
            actionBy     : userId,
            actionDate   : actionDate
        } );
    } catch( error ) {
        throw new Meteor.Error( 'updateLogError', error.reason + ':' + mcMessage.paramErrorMessage );
    }
}

export function removeLog( coll, collParams ) {
    "use strict";
    const actionType = mcConstant.getRemoveLogType(),
          userId     = Meteor.userId();
    // Check the parameters format
    try {
        check( coll, String );
        check( collParams, Object );
        Audits.insert( {
            collName  : coll,
            collValues: collParams,
            actionType: actionType,
            actionLang: actionLang,
            actionBy  : userId,
            actionDate: actionDate
        } );
    } catch( error ) {
        throw new Meteor.Error( 'removeLogError', error.reason + ':' + mcMessage.paramErrorMessage );
    }
}

// Client-side accessible audit functions (loginLog and logoutLog):
Meteor.methods( {
    loginLog( loginParams ) {
        "use strict";
        const actionType = mcConstant.getLoginType(),
              userId     = Meteor.userId();
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
            Audits.insert( {
                collValues: loginParams,
                actionType: actionType,
                actionLang: actionLang,
                actionBy  : userId,
                actionDate: actionDate
            } );
        } catch( error ) {
            throw new Meteor.Error( 'loginLogError', error.reason + ':' + mcMessage.paramErrorMessage );
        }
    },
    logoutLog( logoutParams ) {
        "use strict";
        const actionType = mcConstant.getLogoutType(),
              userId     = Meteor.userId();
        // Check the parameters format
        try {
            check( logoutParams, {
                logoutId      : String,
                logoutUsername: String,
                logoutDate    : Date,
                logoutIp      : String
            } );
            Audits.insert( {
                collValues: logoutParams,
                actionType: actionType,
                actionLang: actionLang,
                actionBy  : userId,
                actionDate: actionDate
            } );
        } catch( error ) {
            throw new Meteor.Error( 'logoutLogError', error.reason + ':' + mcMessage.paramErrorMessage );
        }
    },
    searchLog( coll, searchKey ) {
        "use strict";
        const actionType = mcConstant.getSearchLogType(),
              userId     = Meteor.userId();
        // Check the parameters format and log record
        try {
            check( coll, String );
            check( searchKey, String );
            Audits.insert( {
                collName  : coll,
                keyword   : searchKey,
                actionType: actionType,
                actionLang: actionLang,
                actionBy  : userId,
                actionDate: actionDate
            } );
        } catch( error ) {
            throw new Meteor.Error( 'searchLogError', error.reason + ':' + mcMessage.paramErrorMessage );
        }
    },
    stateInfo( serviceItem, stateId, stateInfo ) {
        "use strict";
        try {
            check( serviceItem, String );
            check( stateId, String );
            check( stateInfo, Object );
        } catch( error ) {
            throw new Meteor.Error( 'inputError', error.reason + ':' + mcMessage.paramErrorMessage );
        }
        // Store the state information in the data-store, include date/time and version

    },
} );
