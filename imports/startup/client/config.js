/**
 * Created by saturnbay on 2014-11-04.
 * Account authentication settings
 * @TODO: set global account registration verification, loginTimeout etc.
 */
// const cloudinary = require('cloudinary');
// import { Accounts } from 'meteor/accounts-base';
//
// Accounts.config( {
//
// } );

// Login required settings
Accounts.ui.config( {
    passwordSignupFields: 'USERNAME_AND_EMAIL'
} );

// Flash Messages global settings
// FlashMessages.configure({
//     autoHide: true,
//     hideDelay: 5000,
//     autoScroll: true
// });

// @TODO: Geolocation settings
// Geolocation.currentLocation();

// CLoudinary: documents / images access configuration
// cloudinary.config( {
//     cloud_name: 'sample',
//     api_key   : '874837483274837',
//     api_secret: 'a676b67565c6767a6767d6767f676fe1'
// } );

