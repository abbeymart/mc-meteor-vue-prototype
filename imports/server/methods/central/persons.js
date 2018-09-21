/**
 * Created by saturnbay on 2014-11-02.
 * Person collection/function maintains the extended attributes for registered users (Meteor.users)
 * Functions: user registration, login, logout, password reset etc.
 *
 */
// Import required module(s)
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';
import { validateUser, validateProfile } from '/imports/lib/utils/ValidateRecord';
import removeRecord from './shared/removeRecord';
import { createLog, updateLog, loginLog, logoutLog } from './shared/translog';
import { mcMessage } from '/imports/lib/locales/getMessage';
import { mcConstant } from '/imports/lib/locales/getConstant';
import { utils } from '/imports/lib/utils/Utility';
import { Users, AccessKeys } from '/imports/collections/Central';
import { checkError, validateError, unAuthorized, tokenExpired, notFound, success } from './shared/utils';
import _ from 'lodash';

Meteor.methods( {
    registerUser( collParams ) {
        "use strict";
        // Backend attributes / formats checking
        try {
            check( collParams, {
                username       : String,
                password       : String,
                userEmail      : String,
                firstName      : String,
                lastName       : String,
                userLang       : String,
                confirmPassword: String,
                recoveryEmail  : String,
                userAcceptTerm : Boolean
            } );
        } catch( error ) {
            return checkError( error );
        }

        // validate inputs (backend): required / formatted
        const errors = validateUser( collParams );
        if( errors.username || errors.password || errors.userEmail || errors.userLang || errors.firstName || errors.lastName || errors.recoveryEmail || errors.userAcceptTerm || errors.confirmPassword ) {
            return validateError( errors );
        }
        // Set default language, if non was selected
        if( !collParams.userLang ) {
            collParams.userLang = 'en-US';
        }
        // Define options parameter for the Meteor.create(options, callback) function
        let options = {
            username: collParams.username,
            password: collParams.password,
            email   : collParams.userEmail,
            profile : {
                firstName    : collParams.firstName,
                lastName     : collParams.lastName,
                userLang     : collParams.userLang,
                recoveryEmail: collParams.recoveryEmail,
                acceptTerm   : collParams.userAcceptTerm,
            }
        };
        // Register new user, if created by another user (e.g. admin)
        if( this.userId ) {
            options = _.extend( options, {
                createdBy  : this.userId,
                createdDate: new Date()
            } );
        }

        try {
            // create a new user record
            const docId = Accounts.createUser( options );
            if( docId ) {
                // Log transactions (new records - docParams) in auditLog (insert-type)
                // TODO: check the audit-log settings - (true/false) to determine logging action
                // exclude password from the options or set to non-valid value
                options.password = '*****no-show*****';
                createLog( 'Users', options );
                // send verification email
                const verifyEmail = Meteor.call( 'verifyRegistration', options.username );

                // TODO: review content of the verifyEmail object

                // send response to client
                return {
                    code   : 'success',
                    resCode: 200,
                    value  : verifyEmail,
                };
            }
        }
        catch( error ) {
            return {
                code   : 'insertError',
                resCode: 503,
                value  : `${error.reason}: ${mcMessage.insertErrorMessage}`
            };
        }
    },
    loginUser( loginParams ) {
        "use strict";
        // Backend attributes / formats checking
        // console.log(loginParams);
        try {
            check( loginParams, {
                username : String,
                password : String,
                logParams: Object,
            } );
        } catch( error ) {
            return checkError( error );
        }

        // TODO: check for email (ending in like ' @abc.com'), else use username
        const username = loginParams.username,
              password = loginParams.password;

        if( !username ) {
            return {
                code   : 'missingLoginName',
                resCode: 406,
                value  : 'Username is required. Please specify a username.'
            };
        } else if( !password ) {
            return {
                code   : 'missingPassword',
                resCode: 406,
                value  : 'Password is required. Please specify a password.'
            };
        } else {

            // make sure the user exists
            // TODO: find user for username and/or email, as login-name
            const user = Users.findOne( { username: username } );
            if( !user ) {
                return {
                    code   : 'userNotFound',
                    resCode: 404,
                    value  : `User ${username} not found`
                };
            }

            // validate password
            if( !user.services || !user.services.password ) {
                return {
                    code   : 'noPassword',
                    resCode: 404,
                    value  : error + ': User has no password set.'
                };
            }

            // check non secure-remote-passwords
            if( !user.services.password.srp ) {
                // Meteor 0.8.2+
                const passwordCheckResult = Accounts._checkPassword( user, password );
                if( passwordCheckResult.error ) {
                    return {
                        code   : 'incorrectPassword',
                        resCode: 401,
                        value  : 'Incorrect password.'
                    };
                }
            }

            // check if user email / account has been verified, after registration
            const userInfo = Users.findOne( { username: loginParams.username } ) || '';
            if( userInfo ) {
                if( !userInfo.emails[ '0' ].verified ) {
                    // resend verifyRegistration email
                    const verifyUser = Meteor.call( 'verifyRegistration', loginParams.username );
                    if( verifyUser.code === 'success' ) {
                        return {
                            code   : 'notVerified',
                            resCode: 200,
                            value  : 'You must verify your email before login. Check your email and verify'
                        };
                    }
                    return {
                        code   : verifyUser.code,
                        resCode: 406,
                        value  : verifyUser.value
                    };
                }
            }
            // generate a session token for the client
            const stampedLoginToken = Accounts._generateStampedLoginToken();

            // hashed token (optional, to be reviewed)
            // const hashToken  = Accounts._hashStampedToken( stampedLoginToken.token );

            const expireDate = Date.now() + mcConstant.getLoginTimeout();   // 24 hours (default)

            // include the userId and expiry for the token
            const stampedToken = _.extend( stampedLoginToken, {
                expire: expireDate,
                userId: user._id,
            } );

            AccessKeys.upsert( { userId: user._id }, stampedToken );

            // audit-log for login, extend loginParams with userId/username
            // dependent on audit-log setting (i.e. log: *true / false)
            const auditLogParams = _.extend( loginParams.logParams, {
                loginId      : user._id,
                loginUsername: user.username,
            } );
            // update user-profile loginDate
            Users.update( { _id: userInfo._id }, { $set: { 'profile.loginDate': new Date() } } );
            // audit-log login-action
            if( mcConstant.getLogLogin() ) {
                loginLog( auditLogParams, user._id );
            }

            // send the session userId, token and expire time back to the user
            return {
                code      : 'success',
                resCode   : 200,
                loginToken: stampedToken.token,
                when      : stampedToken.when,
                expire    : stampedToken.expire,
            };
        }
    },
    logoutUser( token ) {
        // Backend attributes / formats checking
        try {
            check( token, String );
        } catch( error ) {
            return {
                code   : 'paramsError',
                resCode: 406,
                value  : error + ': ' + mcMessage.paramErrorMessage
            };
        }
        // Get the current user ID and information
        let userId = this.userId || '';

        // Check authentication:
        if( !userId && !token ) {
            // no loginToken / userId, can't be authorized
            return {
                code   : 'unauthorized',
                resCode: 401,
                value  : 'Authentication needed to access this resource. Provide correct access-key or login again'
            };
        }
        // validate token access
        if( token ) {
            const tokenInfo = AccessKeys.findOne( { token: token } );
            if( tokenInfo ) {
                // determine userId
                userId = tokenInfo.userId;
            }
        }
        if( userId ) {
            try {
                // userInfo
                const userInfo = Users.findOne( { _id: userId } );
                if( userInfo ) {
                    const logoutParams = {
                        logoutId      : userInfo._id,
                        logoutUsername: userInfo.username,
                        logoutDate    : new Date(),
                        logoutIp      : 'n/a'
                    };
                    // audit-log logout action
                    if( mcConstant.getLogLogout() ) {
                        logoutLog( logoutParams, userId );
                    }
                    // update user-profile logoutDate
                    Users.update( { _id: userId }, { $set: { 'profile.logoutDate': logoutParams.logoutDate } } );
                    // remove token from AccessKeys
                    AccessKeys.remove( { userId: userId } );
                    return {
                        code   : 'success',
                        resCode: 200,
                        value  : 'Logout task completed successfully'
                    };
                }
            } catch( error ) {
                return {
                    code   : 'error',
                    resCode: 403,
                    value  : `${error}: unable to perform logout task`
                };
            }
        } else {
            return {
                code   : 'unauthorized',
                resCode: 401,
                value  : 'Unauthorized. Token / Access-key required.'
            };
        }
    },
    currentUserInfo( token = '' ) {
        // Backend attributes / formats checking
        try {
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get the current user ID and information
        let userId = this.userId || '';

        // Check authentication:
        if( !userId && !token ) {
            // no loginToken / userId, can't be authorized
            return unAuthorized();
        }

        // validate token access
        if( token ) {
            const tokenInfo = AccessKeys.findOne( { token: token } );
            if( tokenInfo ) {
                // determine userId
                userId = tokenInfo.userId;
                if( Date.now() > parseInt( tokenInfo.expire ) ) {
                    // login token has expired, require login/new token
                    return tokenExpired();
                }
            }
        }

        // current user information/record, exclude security information
        if( userId ) {
            // verify user access level /role, for security reasons
            const currentUser = Users.findOne( { _id: userId } );
            let userInfo      = '';

            // check role (e.g. isAdmin)
            if( currentUser.isAdmin ) {
                userInfo = Users.findOne( { _id: userId } );
            } else {
                // filter fields for security reasons
                userInfo = Users.findOne( { _id: userId }, { fields: { username: 1, profile: 1, emails: 1 } } );
            }

            // Check result and perform next action or send error message
            if( userInfo ) {
                return {
                    code   : 'success',
                    resCode: 200,
                    value  : userInfo
                };
            } else {
                return {
                    code   : 'Not-Found',
                    resCode: 404,
                    value  : 'No item(s) found.'
                };
            }

        } else {
            return unAuthorized();
        }
    },
    getUser( token = '' ) {
        // Return current user record or all users for the admin user
        // Backend attributes / formats checking
        try {
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // current userId
        let userId = this.userId || '';

        // current user information/record, exclude security information
        if( token ) {
            const userActive = AccessKeys.findOne( { token: token } );
            if( userActive ) {
                userId = userActive.userId;
                // check token expiry
                if( Date.now() > parseInt( userActive.expire ) ) {
                    // login token has expired, require login/new token
                    return tokenExpired();
                }
            }
            // filter fields for security reasons
            const currentUser = Users.findOne( { _id: userId } );

            let userInfo = '';

            // check role (e.g. isAdmin) | TODO: include filter based on role assignment
            if( currentUser.isAdmin ) {
                userInfo = Users.find( {} ).fetch();
            } else {
                // filter fields for security reasons
                userInfo = Users.find( { _id: userId }, { fields: { username: 1, profile: 1, emails: 1 } } ).fetch();
            }

            // Check result and perform next action or send error message
            if( userInfo ) {
                return {
                    code   : 'success',
                    resCode: 200,
                    value  : userInfo
                };
            } else {
                return {
                    code   : 'Not-Found',
                    resCode: 404,
                    value  : 'No item(s) found.'
                };
            }

        } else {
            return unAuthorized();
        }
    },
    getUserText( token = '' ) {
        // Return current user record or all users for the admin user
        // Backend attributes / formats checking
        try {
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // current userId
        let userId = this.userId || '';

        // current user information/record, exclude security information
        if( token ) {
            const userActive = AccessKeys.findOne( { token: token } );
            if( userActive ) {
                userId = userActive.userId;
                // check token expiry
                if( Date.now() > parseInt( userActive.expire ) ) {
                    // login token has expired, require login/new token
                    return tokenExpired();
                }
            }
            // filter fields for security reasons
            const currentUser = Users.findOne( { _id: userId } );

            let userInfo = '';

            // check role (e.g. isAdmin) | TODO: include filter based on role assignment
            if( currentUser.isAdmin ) {
                userInfo = Users.find( {} ).fetch();
            } else {
                // filter fields for security reasons
                userInfo = Users.find( { _id: userId }, { fields: { username: 1, profile: 1, emails: 1 } } ).fetch();
            }

            // Check result and perform next action or send error message
            if( userInfo ) {
                return {
                    code   : 'success',
                    resCode: 200,
                    value  : userInfo
                };
            } else {
                return {
                    code   : 'Not-Found',
                    resCode: 404,
                    value  : 'No item(s) found.'
                };
            }

        } else {
            return unAuthorized();
        }
    },
    getUserAll( token = '' ) {
        // Return records for all users
        // Backend attributes / formats checking
        // TODO: review security consideration
        try {
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // current userId
        let userId = this.userId || '';

        // current user information/record, exclude security information
        if( token ) {
            const userActive = AccessKeys.findOne( { token: token } );
            if( userActive ) {
                userId = userActive.userId;
                // check token expiry
                if( Date.now() > parseInt( userActive.expire ) ) {
                    // login token has expired, require login/new token
                    return tokenExpired();
                }
            }

            let userInfo = '';

            userInfo = Users.find( {}, { fields: { username: 1, profile: 1, } } ).fetch();

            // Check result and perform next action or send error message
            if( userInfo ) {
                return {
                    code   : 'success',
                    resCode: 200,
                    value  : userInfo
                };
            } else {
                return {
                    code   : 'Not-Found',
                    resCode: 404,
                    value  : 'No item(s) found.'
                };
            }

        } else {
            return unAuthorized();
        }
    },
    getSeller( token = '' ) {
        // Return records for all users
        // Backend attributes / formats checking
        // TODO: review security consideration
        try {
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // current userId
        let userId = this.userId || '';

        // current user information/record, exclude security information
        if( token ) {
            const userActive = AccessKeys.findOne( { token: token } );
            if( userActive ) {
                userId = userActive.userId;
                // check token expiry
                if( Date.now() > parseInt( userActive.expire ) ) {
                    // login token has expired, require login/new token
                    return tokenExpired();
                }
            }

            let userInfo = '';

            userInfo = Users.find( { isSeller: true }, { fields: { username: 1, profile: 1, } } ).fetch();

            // Check result and perform next action or send error message
            if( userInfo ) {
                return {
                    code   : 'success',
                    resCode: 200,
                    value  : userInfo
                };
            } else {
                return {
                    code   : 'Not-Found',
                    resCode: 404,
                    value  : 'No item(s) found.'
                };
            }

        } else {
            return unAuthorized();
        }
    },
    findUser( docId, token = '' ) {
        // Return current user record or all users for the admin user
        // Backend attributes / formats checking
        try {
            check( docId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // current userId
        let userId = this.userId || '';

        // current user information/record, exclude security information
        if( token ) {
            const userActive = AccessKeys.findOne( { token: token } );
            if( userActive ) {
                userId = userActive.userId;
                // check token expiry
                if( Date.now() > parseInt( userActive.expire ) ) {
                    // login token has expired, require login/new token
                    return tokenExpired();
                }
            }
            // const currentUser = Users.findOne( { _id: userId } );

            // filter fields for security reasons
            const userInfo = Users.findOne( { _id: docId }, { fields: { username: 1, profile: 1, emails: 1 } } );

            // Check result and perform next action or send error message
            if( userInfo ) {
                return {
                    code   : 'success',
                    resCode: 200,
                    value  : userInfo
                };
            } else {
                return {
                    code   : 'Not-Found',
                    resCode: 404,
                    value  : 'No item(s) found.'
                };
            }
        } else {
            return unAuthorized();
        }
    },
    updateUser( collParams, currentDocId, token = '' ) {
        // Backend attributes / formats checking
        try {
            check( collParams, {
                username     : String,
                userEmail    : String,
                firstName    : String,
                lastName     : String,
                userLang     : String,
                recoveryEmail: String,
                isActive     : Boolean,
                isAdmin      : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // validate inputs (backend): required / formatted
        const errors = validateProfile( collParams );
        if( errors.username || errors.userEmail || errors.userLang || errors.firstName || errors.lastName || errors.recoveryEmail ) {
            return validateError( errors );
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
                // determine userId
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

        // Get info of the user/record being updated, for transaction-log
        const currentUserInfo = Users.findOne( { _id: currentDocId }, {
            fields: {
                username : 1,
                profile  : 1,
                emails   : 1,
                isActive : 1,
                createdBy: 1,
                isAdmin  : 1
            }
        } );

        // prevent changes by non-admin users: maintain current settings for isAdmin and isActive
        if( !userInfo.isAdmin ) {
            collParams.isActive = currentUserInfo.isActive;
            collParams.isAdmin  = currentUserInfo.isAdmin;
        }

        // Set default language, if non was selected
        if( !collParams.userLang ) {
            collParams.userLang = 'en-US';
        }

        // Insert: check if duplicate record exists
        const duplicateDoc = Users.findOne( {
            $or: [ { username: collParams.username }, { emails: { [0]: collParams.email } } ]
        } ) ? true : false;

        // Update: check if another document/record with the same/changed name exist, to avoid duplicate name
        const docNotUnique = Users.findOne( {
            _id: { $ne: currentDocId },
            $or: [ { username: collParams.username }, { emails: { [0]: collParams.userEmail } } ]
        } ) ? true : false;

        // Define options parameter for user profile update
        const options = {
            username: collParams.username,
            isActive: collParams.isActive,
            isAdmin : collParams.isAdmin,
            profile : {
                firstName    : collParams.firstName,
                lastName     : collParams.lastName,
                userLang     : collParams.userLang,
                recoveryEmail: collParams.recoveryEmail,
            }
        };
        // @TODO: Create separate function/package to change username, emails, password...
        // Update existing document/record, insert a new document/record
        if( currentDocId ) {
            // Get current document to determine/control access permissions
            // @TODO: update changePermitted logic, based on role assignment
            const changePermitted = ( (userId && userId === currentUserInfo.createdBy) || (userInfo.isAdmin) ) ? true : false;

            if( changePermitted ) {
                if( docNotUnique ) {
                    return {
                        code   : 'duplicate',
                        resCode: 403,
                        value  : mcMessage.docDuplicate
                    };
                }
                else {
                    const updateParams = _.extend( options, {
                        updatedBy  : userId,
                        updatedDate: new Date()
                    } );
                    try {
                        const docId = Users.update( { _id: currentDocId }, { $set: updateParams } );
                        // Log transactions (old/new records - currentDoc / docParams) in auditLog (update-type)
                        // @TODO: Check the audit-log settings - global/collection (true/false) to determine logging
                        // status
                        updateLog( 'Users', currentUserInfo, updateParams );
                        return {
                            code   : 'updated',
                            resCode: 200,
                            value  : `${docId}: Updated document / record.`
                        };
                    }
                    catch( error ) {
                        return {
                            code   : 'error',
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
        } else {
            return {
                code   : 'updateDenied',
                resCode: 403,
                value  : `${mcMessage.updateNotAuthorized} missing document/record ID.`
            };
        }
    },
    saveUserRole( collParams, token = '' ) {
        // Backend attributes / formats checking
        try {
            check( collParams, {
                grantUser: String,
                grantRole: String,
            } );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // validate inputs (backend): required / formatted
        const errors = validateProfile( collParams );
        if( errors.grantRole || errors.grantUser ) {
            return validateError( errors );
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
                // determine userId
                userId = tokenInfo.userId;
                if( Date.now() > parseInt( tokenInfo.expire ) ) {
                    // login token has expired, require login/new token
                    return tokenExpired();
                }
            }
        }

        if( userId ) {
            // get user information: for permission status and audit-log
            userInfo              = Users.findOne( { _id: userId }, {
                fields: {
                    username : 1,
                    profile  : 1,
                    emails   : 1,
                    isActive : 1,
                    createdBy: 1,
                    isAdmin  : 1
                }
            } );
            // determine/control access permissions (admin or privileged users only)
            const changePermitted = ( userInfo.isAdmin ) ? true : false;

            if( changePermitted ) {
                try {
                    const docId = Users.update( { _id: collParams.grantUser },
                        {
                            $set: { "profile.defaultRole": collParams.grantRole }
                        } );
                    // Log transactions (old / new/changed records)
                    // check the audit-log settings - to perform audit-log
                    if( mcConstant.getLogUpdate() ) {
                        updateLog( 'Users', userInfo, collParams );
                    }
                    return {
                        code   : 'updated',
                        resCode: 200,
                        value  : `${docId}: Updated document / record.`
                    };
                } catch( error ) {
                    return {
                        code   : 'error',
                        resCode: 403,
                        value  : error.reason + ': ' + mcMessage.updateErrorMessage
                    };
                }
            } else {
                return {
                    code   : 'updateDenied',
                    resCode: 403,
                    value  : mcMessage.updateNotAuthorized
                };
            }
        } else {
            return unAuthorized();
        }
    },
    removeUser( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Users', currentDocId, token );
    },
    verifyRegistration( userLoginName = '', token = '' ) {
        // Backend attributes / formats checking
        try {
            check( userLoginName, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Determine userId from userLoginName or token
        let userId;
        if( userLoginName ) {
            userId = Users.findOne( { username: userLoginName } )._id || '';
        } else if( token ) {
            userId = AccessKeys.findOne( { token: token } ).userId || '';
        } else {
            userId = this.userId || '';
        }

        // Send verification email
        try {
            if( userId ) {
                Accounts.sendVerificationEmail( userId );
                return {
                    code   : 'success',
                    resCode: 200,
                    value  : 'Verification email sent/resent. Check your email and verify prior to login'
                }
            } else {
                return unAuthorized();
            }
        }
        catch( error ) {
            return {
                code : 'notVerified',
                code : 403,
                value: `${error}: Could not send verification email. Valid user/login-name is required.`
            };
        }
    },
    changeUserPassword( newPassword, token ) {
        // check token
        try {
            check( newPassword, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // validate inputs (backend): required / formatted
        const validPass = utils.validatePassword( newPassword );
        if( !validPass ) {
            return {
                code   : 'invalidPassword',
                resCode: 406,
                value  : validPass.message
            };
        }

        // Get the current user ID and information
        let userId = this.userId || '';

        // Check authentication:
        if( !userId && !token ) {
            // no loginToken / userId, can't be authorized
            return unAuthorized();
        }

        // validate token access
        if( token ) {
            const tokenInfo = AccessKeys.findOne( { token: token } );
            if( tokenInfo ) {
                // determine userId
                userId = tokenInfo.userId;
                if( Date.now() > parseInt( tokenInfo.expire ) ) {
                    // login token has expired, require login/new token
                    return tokenExpired();
                }
            }
        }
        // set password, wrap in a try/catch block to handle any error
        try {
            Accounts.setPassword( userId, newPassword );
            // remove the token on the server to force re-login on the client-side
            AccessKeys.remove( { token: token } );
            return {
                code   : 'success',
                resCode: 200,
                value  : 'Password changed / reset. Please login again.'
            };
        } catch( error ) {
            return {
                code   : 'error',
                resCode: 401,
                value  : 'Unable to change/reset password. Please try again.'
            };
        }
    },
    sendResetPasswordEmail( userLoginName = '', userEmail = '', token = '' ) {
        // Backend attributes / formats checking
        try {
            check( userLoginName, String );
            check( userEmail, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Determine userId from userLoginName or token
        let userId;
        if( userLoginName ) {
            userId = Users.findOne( { username: userLoginName } )._id || '';
        } else if( token ) {
            userId = AccessKeys.findOne( { token: token } ).userId || '';
        } else if( userEmail ) {
            userId = Users.findOne( { emails: { ['0']: { address: userEmail } } } )._id || '';
        } else {
            userId = this.userId || '';
        }

        // Send verification email
        try {
            if( userId ) {
                Accounts.sendResetPasswordEmail( userId );
                return {
                    code   : 'success',
                    resCode: 200,
                    value  : 'Verification email sent/resent. Check your email and verify prior to login.'
                }
            } else {
                return unAuthorized();
            }
        }
        catch( error ) {
            return {
                code : 'notVerified',
                code : 403,
                value: `${error}: Could not send verification email. Provide valid User/Login-name or Email, or Register.`
            };
        }
    },
    userEmailVerified( userLoginName = '', token = '' ) {
        // Backend attributes / formats checking
        try {
            check( userLoginName, String );
        } catch( error ) {
            return checkError( error );
        }

        // Verify if user email has been verified
        if( userLoginName ) {
            const userInfo = Users.findOne( { username: userLoginName } );
            return userInfo.emails[ '0' ].verified ? true : false;
        }
    },
    recoverUsername( userEmail ){
        "use strict";
        // check input parameters
        try {
            check( userEmail, String );
        } catch( error ) {
            return checkError( error );
        }
        // determine username based on the input parameters
        let userName = '';

        // Recover, return username information or, TODO: send to registered email-address
        if( userEmail ) {
            // const userName = Accounts.findUserByEmail(userEmail).username;
            const userName = Users.findOne( { "emails.address": userEmail } ).username;
            if( userName ) {
                return {
                    code   : 'success',
                    resCode: 401,
                    value  : `Username is ${userName}`
                };
            } else {
                return {
                    code   : 'notFound',
                    resCode: 404,
                    value  : 'User name/information not found for the specified registered email address'
                };
            }
        } else {
            return {
                code   : 'unauthorized',
                resCode: 401,
                value  : 'Valid registered email address is required.'
            };
        }

    },
    changeUsername( newUsername, token ) {
        "use strict";
        try {
            check( newUsername, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // Determine userId from userLoginName or token
        let userId, userName;
        if( token ) {
            const currentId = AccessKeys.findOne( { token: token } ).userId || '';
            if( currentId ) {
                const userInfo = Users.findOne( { _id: currentId } );
                userId         = userInfo._id || '';
                userName       = userInfo.username || '';
            }

        } else {
            const currentId = this.userId || '';
            if( currentId ) {
                const userInfo = Users.findOne( { _id: currentId } );
                userId         = userInfo._id || '';
                userName       = userInfo.username || '';
            }
        }

        // Change username
        try {
            if( userId ) {
                Accounts.setUsername( userId, newUsername );
                return {
                    code   : 'success',
                    resCode: 200,
                    value  : `Username changed: from ${userName} to ${newUsername}`
                }
            }
        }
        catch( error ) {
            return {
                code   : 'error',
                resCode: 403,
                value  : `${error}: Could not change username. Please retry.`
            };
        }
    },
    isAdminUser( currentUserId, token = '' ) {
        // Backend attributes / formats checking
        try {
            check( currentUserId, String );
        } catch( error ) {
            return checkError( error );
        }

        if( currentUserId === Meteor.userId() ) {
            return Meteor.user().isAdmin;
        }
        return false;
    },
    sendUserEmail( collParams, token = '' ){
        // check all arguments are strings.
        // console.log( collParams );
        try {
            check( collParams, {
                msgTo     : String,
                msgFrom   : String,
                msgSubject: String,
                msgText   : String,
            } );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // Let other method calls from the same client start running, without
        // waiting for the email sending to complete.
        // this.unblock();

        // Determine userId from token
        let userId;
        if( token ) {
            userId = AccessKeys.findOne( { token: token } ).userId || '';
        } else {
            userId = this.userId || '';
        }

        // Send item-email
        try {
            if( userId ) {
                // Determine sending (from) userEmail address
                const userInfo     = Users.findOne( { _id: userId } );
                collParams.msgFrom = userInfo.emails[ '0' ].address || collParams.msgFrom;
                // send email
                const to           = collParams.msgTo,
                      from         = collParams.msgFrom,
                      subject      = collParams.msgSubject,
                      text         = collParams.msgText;
                Email.send( { to, from, subject, text } );
                return {
                    code   : 'success',
                    resCode: 200,
                    value  : `Email (message) sent: from ${collParams.msgFrom} to ${collParams.msgTo}`
                }
            } else {
                return unAuthorized();
            }
        } catch( error ) {
            return {
                code   : error.code,
                resCode: 406,
                value  : error.message,
            };
        }
    },
} );
