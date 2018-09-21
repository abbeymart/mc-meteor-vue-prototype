/**
 * Created by saturnbay on 2015-12-11.
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Activities } from "/imports/collections/Pam";

// Define publicly available fields to be published for all users
Activities.publicFields = {
    contentCode: 1,
    contentName: 1,
    contentDesc: 1,
    contentLang: 1
};

// Publish all active/inactive information for admin users
// Already published from pubService.js file
// Meteor.publish( 'actAll', function() {
//     return Activities.find();
// } );
//
// //Publish active contents for all users
// Meteor.publish( 'actAllActive', function() {
//     // publish to all active addresses
//     return Activities.find( { isActive: true } );
// } );

