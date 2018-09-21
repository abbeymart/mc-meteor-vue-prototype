/**
 * Created by abbeymart on 2017-01-05.
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import Auth from '../plugins/Auth';

const API_URL    = process.env.API;
const LOGIN_URL  = API_URL + 'login';
const SIGNUP_URL = API_URL + 'register';

const router = new VueRouter();

Vue.use( Auth );

export default {

    login( context, creds, redirect ) {
        // TODO: use axios
        axios.post( LOGIN_URL, creds )
            .then( response => {
                // TODO: wrap in try/catch block for additional error checking
                context.$auth.setToken(response.data.loginToken, response.data.expire );
                if( redirect ) {
                    router.go( redirect );
                }
            } )
            .catch( error => {
                console.log( error )
            } );
    },

    signup( context, creds, redirect ) {
        axios.post( SIGNUP_URL, creds )
            .then( response => {
                // TODO: wrap in try/catch block for additional error checking
                context.$auth.setToken(response.data.loginToken, response.data.expire );
                if( redirect ) {
                    router.go( redirect );
                }
            } ).catch( error => {
            console.log( error )
        } );
    },

    logout() {
        localStorage.removeItem( 'authToken' );
        this.user.authenticated = false;
    },

    checkAuth() {
        const jwt = localStorage.getItem( 'authToken' );
        if( jwt ) {
            this.user.authenticated = true;
        }
        else {
            this.user.authenticated = false;
        }
    },

    getAuthHeader() {
        return {
            'Authorization': 'Bearer ' + localStorage.getItem( 'authToken' )
        }
    },

    // TODO: server-side actions, client-proxies:

    verifyUserEmail( userId, email = '' ) {
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

    changePassword( userId, newPassword ) {
        // Check currentUser login
        const currentUser = Meteor.userId();
        try {
            if( currentUser ) {
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
    },

    resetPassword( userId, newPassword ) {
        // Check currentUser login
        const currentUser = Meteor.userId();
        try {
            if( currentUser ) {
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
    },

    // Server-side action, client-proxy
    changeUsername( userId, newUsername ) {
        // Check currentUser login
        const currentUser = Meteor.userId();
        try {
            if( currentUser ) {
                Accounts.setPassword( userId, newUsername );
                return {
                    msgSuccess: true,
                    message   : "Password changed successfully"
                };
            }
        }
        catch( error ) {
            return error.reason + ": Could not sent verification message";
        }
    },

    changeEmail( userId, newEmail ) {
        // Check currentUser login
        const currentUser = Meteor.userId();
        try {
            if( currentUser ) {
                Accounts.setPassword( userId, newEmail );
                return {
                    msgSuccess: true,
                    message   : "Password changed successfully"
                };
            }
        }
        catch( error ) {
            return error.reason + ": Could not sent verification message";
        }
    },

}
