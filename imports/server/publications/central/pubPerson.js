/**
 * Created by saturnbay on 2015-01-20.
 * Publish user information based on permission levels
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import getPubRecord from '../../methods/central/shared/getPubRecord';
import { checkError } from '../../methods/central/shared/utils';
import _ from 'lodash';
import { Persons, Users, Contacts, Raacis, Roles, Grants, Activities } from "/imports/collections/Central";

// Define publicly available fields to be published for all users
Users.publicFields = {
    username: 1,
    emails  : 1,
    profile : 1
};

Users.adminFields = {
    username: 1,
    emails  : 1,
    profile : 1
};

// Publish login user basic information: for login user only
Meteor.publish( "userData", function() {
    if( this.userId ) {
        return Users.find( { _id: this.userId } );
    } else {
        this.ready();
    }
} );

// Publish users-list information (read-only / specific fields only) to retrieve user not login
Meteor.publish( "userEmailVerification", function( userName = '' ) {
    try {
        check( userName, String );
    } catch( error ) {
        return (error.reason);
    }

    if( userName ) {
        return Users.find( { username: userName } );
    } else {
        this.ready();
    }
} );

// @TODO: Publish registered users information for admin users only by admin group
Meteor.publish( 'userAll', function() {
    // @TODO: publish documents/records based on role / group-permissions
    // 1. Check logged-in user admin status / group: isAdmin / Admin
    // 2. Publish documents/records based on role / group-permissions
    return Users.find( {} );
} );

// Extended user information & roles information

// Publish extend user information (persons)
Meteor.publish( 'personAll', (collParams = {}, currentDocId = '', token = '') => {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Persons', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'personAllActive', (collParams = {}, currentDocId = '', token = '') => {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    // extend collParams
    collParams = _.extend( collParams, {
        isActive: true,
    } );

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Persons', { collParams, currentDocId, token, userId } );
} );


// Publish contacts
Meteor.publish( 'contactAll', (collParams = {}, currentDocId = '', token = '') => {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Contacts', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'contactAllActive', (collParams = {}, currentDocId = '', token = '') => {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    // extend collParams
    collParams = _.extend( collParams, {
        isActive: true,
    } );

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Contacts', { collParams, currentDocId, token, userId } );
} );


// RAACI publications
Meteor.publish( 'raaciAll', function(collParams = {}, currentDocId = '', token = '') {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Raacis', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'raaciAllActive', function(collParams = {}, currentDocId = '', token = '') {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    // extend collParams
    collParams = _.extend( collParams, {
        isActive: true,
    } );

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Raacis', { collParams, currentDocId, token, userId } );
} );

// Publish roles
Meteor.publish( 'roleAll', (collParams = {}, currentDocId = '', token = '') => {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Roles', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'roleAllActive', (collParams = {}, currentDocId = '', token = '') => {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    // extend collParams
    collParams = _.extend( collParams, {
        isActive: true,
    } );

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Roles', { collParams, currentDocId, token, userId } );
} );

// Publish grants
Meteor.publish( 'grantAll', (collParams = {}, currentDocId = '', token = '') => {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Grants', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'grantAllActive', (collParams = {}, currentDocId = '', token = '') => {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    // extend collParams
    collParams = _.extend( collParams, {
        isActive: true,
    } );

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Grants', { collParams, currentDocId, token , userId} );
} );

// Publish activities
Meteor.publish( 'actAll', (collParams = {}, currentDocId = '', token = '') => {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Activities', { collParams, currentDocId, token, userId } );
} );

Meteor.publish( 'actAllActive', (collParams = {}, currentDocId = '', token = '') => {
    try {
        check( collParams, Object );
        check( currentDocId, String );
        check( token, String );
    } catch( error ) {
        return checkError( error );
    }

    // extend collParams
    collParams = _.extend( collParams, {
        isActive: true,
    } );

    const userId = this.userId || '';
    // Get items, for authenticated / authorized user, by token
    return getPubRecord( 'Activities', { collParams, currentDocId, token, userId } );
} );
