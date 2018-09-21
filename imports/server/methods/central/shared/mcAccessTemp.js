/**
 * Created by abbeymart on 2016-08-18.
 * Authentication and authorization functions
 * 1. Verify user account registration prior to login
 * 2. Password, Username and Email resets
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods( {
    // User registration verification email
    // Call from the recently created user account function
    verifyUserEmail( userId, email = '' ) {
        "use strict";
        try {
            Accounts.sendVerificationEmail( userId );
            return {
                msgSuccess: true,
                message   : "Verification email sent, check your email to verify your account before login"
            };
        }
        catch( error ) {
            return error.reason + ": Could not sent verification message";
        }
    },

    verifyRegEmail() {
        "use strict";

    }

} );


export function changePassword( userId, newPassword ) {
    // Check currentUser login
    const  currentUser = Meteor.userId();

    try {
        if (currentUser) {
            Accounts.setPassword( userId, newPassword );
            return {
                msgSuccess: true,
                message   : "Password changed successfully"
            };
        }
    }
    catch( error ) {
        return error.reason + ": Could not sent verification message";
    }
}

export function changeUsername( userId, newUsername ) {
    // Check currentUser login

    const  currentUser = Meteor.userId();

    try {
        if (currentUser) {
            Accounts.setPassword( userId, newUsername);
            return {
                msgSuccess: true,
                message   : "Password changed successfully"
            };
        }
    }
    catch( error ) {
        return error.reason + ": Could not sent verification message";
    }
}

export function changeEmail( userId, newEmail ) {
    // Check currentUser login

    const  currentUser = Meteor.userId();

    try {
        if (currentUser) {
            Accounts.setPassword( userId, newEmail);
            return {
                msgSuccess: true,
                message   : "Password changed successfully"
            };
        }
    }
    catch( error ) {
        return error.reason + ": Could not sent verification message";
    }
}
