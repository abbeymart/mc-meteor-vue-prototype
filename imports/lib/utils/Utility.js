/**
 * Created by saturnbay on 15-05-10.
 * Self contained utility functions
 * Utility functions, with few exceptions, will return {result, message}
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { mcPlural } from '../locales/getPlural';
import { mcMessage } from '../locales/getMessage';
import { Users, Raacis, Grants, Locations } from '/imports/collections/Central';
import { Products } from '/imports/collections/Asset';
import { Orders } from '/imports/collections/Mpe';
import axios from 'axios';

const numFormat = require( 'numeral' );

// use as a plugin, for global usage

export const utils = {
    userLogin() {
        "use strict";
    },
    isUpdate() {
        "use strict";
        // Determine the save method (create or update)
        // create: for new record, currentId =''
        // update: for existing record, currentId = 'abc12960...'
    },
    currentUser() {
        "use strict";
    },
    setLoginName( userName, expire ) {
        localStorage.setItem( 'loginName', userName );
        localStorage.setItem( 'loginNameExpire', expire );
    },
    removeLoginName() {
        localStorage.removeItem( 'loginName' );
        localStorage.removeItem( 'loginNameExpire' );
    },
    getLoginName() {
        const user   = localStorage.getItem( 'loginName' ),
              expire = localStorage.getItem( 'loginNameExpire' );
        if( !user || !expire ) {
            return null;
        }
        if( Date.now() > parseInt( expire ) ) {
            this.removeLoginName();
            return null;
        }
        return user;
    },
    shortString( str, maxLength ) {
        "use strict";
        return str.length > maxLength ? str.substr( 0, maxLength ) + '...' : str.toString();
    },
    userIdentity() {     // optional use, when this.userId should be hidden or not feasible?
        "use strict";
        const self = this;
        return self.userId || Meteor.userId();
    },
    adminUser() {
        "use strict";
        // get the user admin status from the users collection
        const userInfo = Meteor.user(),
              isAdmin  = userInfo.isAdmin;
        if( userInfo._id && isAdmin ) {
            return {
                result : true,
                message: "Admin user"
            };
        }
        return {
            result : false,
            message: "Not an admin user"
        };
    },
    adminUserGroup() {
        "use strict";
        // Determine the group that the user administer to determine the user that can be administered
    },
    activeUserGroup() {
        "use strict";
        const self      = this;
        let activeGroup = Persons.findOne( { userId: self.userId, isActive: 'Yes' }, { fields: 'activeGroup' } );
        return activeGroup;
    },
    userRoles() {
        "use strict";
        const self       = this;
        let currentRoles = Roles.find( { userId: self.userId, isActive: 'Yes' } );
        return currentRoles;
    },
    userLocationInfo() {
        "use strict";
        let userLocation = {};
        // Obtain user login IP information
        return userLocation;
    },
    userIpAddress() {
        "use strict";
        // Get the current user IP address Information
        // @TODO: fix the ajax/promised undefined return error
        axios.get( 'http://ipinfo.io', ( data ) => {
            /*
             {
             "ip": "99.235.164.225",
             "hostname": "CPE788df7b31a63-CM788df7b31a60.cpe.net.cable.rogers.com",
             "city": "Etobicoke",
             "region": "Ontario",
             "country": "CA",
             "loc": "43.7432,-79.5876",
             "org": "AS812 Rogers Cable Communications Inc.",
             "postal": "M9V"
             }
             */
            return data;
        } ).then( ( info ) => {
            return info;
        } ).catch( ( error ) => {
            return "Error fetching ip-address information: " + error;
        } );
    },
    userBrowser() {
        "use strict";
        // push each browser property, as key/value pair, into userBrowser array variable
        return navigator.userAgent;
    },
    currentUrlInfo( pathLoc ) {
        // this function returns the parts (array) and lastIndex of a URL/pathLocation
        let parts = '';
        let lastIndex;
        if( pathLoc ) {
            parts     = pathLoc.toString().split( '://' )[ 1 ].split( '/' );
            // get the last index
            lastIndex = parts.lastIndexOf( 'new' ) || parts.lastIndexOf( 'detail' ) || parts.lastIndexOf( 'list' );
            return {
                parts,
                lastIndex,
            };
        }
        return {
            parts,
            lastIndex,
        };
    },
    // Check if user already exist, for new registration
    /**
     * Check if login userName exist
     * @param userName, email
     * @returns {any}
     */
    userExist( userName, email ) {
        "use strict";
        const userExist = Users.findOne( { $or: { username: userName, email: email } } );
        if( userExist ) {
            return {
                result : true,
                message: 'User already exist, try another username / email'
            };

        } else {
            return {
                result : true,
                message: 'No existing user with same username or email address'
            };
        }
    },
    // Get full name
    getFullName( firstName, middleName, lastName ) {
        "use strict";
        return (firstName + ' ' + middleName + ' ' + lastName);
    },
    // Get first, middle and last names
    getNames( fullName ) {
        "use strict";
        // Return firstName, middleName and lastName based on fullName components ([0],[1],[2])
    },
    /**
     * Converting from one measure to another
     * @param {String} convertFrom
     * @param {String} convertTo
     * @param {number} convertFromValue
     * @returns {number}
     */
    conversionResult( convertFrom, convertTo, convertFromValue ) {
        "use strict";
        // Check parameters
        try {
            check( {
                convertFrom     : String,
                convertTo       : String,
                convertFromValue: Number
            } );
        } catch( error ) {
            return (error.reason + ':' + mcMessage.paramErrorMessage);
        }
        // Get the conversion value from the Converts collection
        const convertInfo = Converts.findOne( { convertFrom: convertFrom, convertTo: convertTo } );

        // Calculate the new value
        if( convertInfo ) {
            return (convertFromValue * convertInfo.convertValue);
        }
    },
    pluralize( n, itemName, itemPlural = '' ) {
        // @TODO: retrieve plural for itemName from language dictionary {name: plural}
        let itemNamePlural = '';
        if( !itemPlural ) {
            itemNamePlural = mcPlural[ itemName ];
        } else {
            itemNamePlural = itemPlural;
        }
        let result = `${n} ${itemName}`;
        if( n > 1 ) {
            result = `${n} ${itemName}${itemNamePlural}`;
        }
        return result;
    },
    // Validation utility functions: return status (true/false) and corresponding default message as object
    /**
     * Trim the begining and ending spaces
     * @param infoData
     * @returns {XML|Chartist.Svg|string|void|*}
     */
    trimInput: function( infoData ) {
        "use strict";
        return infoData.replace( '/^\s*|\s*$/g', "" );
    },
    /**
     * Check if new user password met required password rule
     * @param password
     * @returns {*}
     * Strong passwords with min 6 - max 15 characters length, at least one uppercase letter,
     * one lowercase letter, one number, one special character (all, not just defined),
     * space is not allowed.
     */
    validatePassword( password ) {
        "use strict";
        const testPattern  = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9\S]{6,15}$/;
        const testPassword = testPattern.test( password );

        if( testPassword ) {
            return {
                result : true,
                message: 'Password accepted'
            };
        } else {
            return {
                result : false,
                message: 'Password not accepted. ' +
                         'Password should be 6 (minimum) to 15 (maximum) characters length, ' +
                         'containing at least one uppercase letter, one lowercase letter, one number, ' +
                         'and one special character. Space is not allowed.'
            };
        }
    },
    /**
     * Check if password is right for existing user
     * @param userName
     * @param password
     * @returns {any}
     */
    validLogin( userName, password ) {
        "use strict";
        return Users.findOne( { user: userName }, { password: password } );
    },

    // Check for valid phone
    // Phone number with optional leading 1-9, optional area code,
    // and optional delimiters (hyphen, space or period)
    validatePhone( phoneNumber ) {
        "use strict";
        let testPattern = /^([1-9]{1,3})?[-\. ]?(\(\d{3}\)?[-\. ]?|\d{3}?[-\. ]?)?\d{3}?[-\. ]?\d{4}$/;
        return testPattern.test( phoneNumber )
    },

    // Email validation
    // Pattern to verify email addresses. Take a look at match / not match. It works very well.
    // E-mail, email, mail, e-mail address, email address, mail address.
    validateEmail( email ) {
        "use strict";
        const testPattern = /^[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,6}$/;
        const testEmail   = testPattern.test( email );

        if( testEmail ) {
            return {
                result : true,
                message: 'Email accepted'
            };
        } else {
            return {
                result : false,
                message: 'Email is not accepted. ' +
                         'Email should contain only letters, numbers, -, ., _ only, and valid domain name with 2 - 6 letters' +
                         ' extension).'
            };
        }
    },
    // First / Middle / Last / Full names validation
    validateName( name ) {
        "use strict";
    },
    // Full names validation
    validateFullName( fullname ) {
        "use strict";
    },
    // URL validation
    validateURL( mcURL ) {
        "use strict";
        const testPattern = /[a-zA-Z]/;
        return testPattern.test( mcURL );
    },
    // Date validation - based on standard formats
    validateDate( mcDate ) {
        "use strict";
        const testPattern = /[a-zA-Z]/;
        return testPattern.test( mcDate );
    },
    validateString( infoItem ) {
        "use strict";
        const testPattern = /[a-zA-Z]/;
        return testPattern.test( infoItem );
    },
    isEmpty( infoItem ) {
        "use strict";
        return infoItem === '';
    },
    isNull( infoItem ) {
        "use strict";
        return infoItem === null;
    },
    isEven( num ) {
        return Number.isFinite( num ) && (num % 2 === 0);
    },
    isOdd( num ) {
        return Number.isFinite( num ) && (num % 2 !== 0);
    },
    isPrime() {

    },
    activityPermitted( taskService, taskRole ) {
        "use strict";
        // Check Raaci assignment for a user, based on current task type
        // Determine user group and raaci assignment
        const self      = this;
        const userGroup = Grants.findOne( { grantUser: self.userId } ).grantGroup;
        return Raacis.findOne( {
            raaciService: taskService,
            raaciGroup  : userGroup,
            raaciRole   : taskRole
        } ) ? true : false;
    },
    taskPermitted() {
        "use strict";
        // Determine user group and raaci assignment
        const self      = this;
        const userGroup = Grants.findOne( { grantUser: self.userId } ).grantGroup;
        // Return the permitted actions: create, read, update and delete
        return Roles.findOne( {
            roleGroup: userGroup
        } );
    },
    activityLog() {
        "use strict";
    },
    stateName( stateCode ) {
        const state = Locations.findOne( { _id: stateCode } );
        return state ? state.locationName : '';
    },
    countryName( countryCode ) {
        const country = Locations.findOne( { _id: countryCode } );
        return country ? country.locationName : '';
    },
    formatNum( num ) {
        // return two decimal-place formatted numbers/currencies
        return numFormat( num ).format( '0,0.00' );
    },
    productName( itemId ) {
        const product = Products.findOne( { _id: itemId } );
        return product ? product.productName : 'n/a';
    },
    productCost( itemId ) {
        const product = Products.findOne( { _id: itemId } );
        return product ? this.formatNum( product.productCost ) : 0.00;
    },

};
