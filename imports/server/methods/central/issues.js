/**
 * Created by saturnbay on 2014-12-14.
 * Items: issueName, issueDesc, issueType (issue, risk, task, incident, problem, change etc.), startDate, dueDate,
 * createdBy, createdDate, issueReport, issueStatus (open, closed...), assignedTo, completedDate, issueRemark
 *
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { mcMessage } from '/imports/lib/locales/getMessage';
import { validateIssue } from '/imports/lib/utils/ValidateRecord';
import removeRecord from "./shared/removeRecord";
import { Issues } from "/imports/collections/Central";

Meteor.methods( {

    // insert / update method:
    saveIssue( ioAttributes ) {

        // Check the attributes formats
        // @TODO: include all required variables in the UI and helper
        check( this.userId, String );
        check( ioAttributes, {
            issueName : String,
            issueDesc : String,
            ioCat     : String,
            ioType    : String,
            ioLang    : String,
            isRequired: String,
            isActive  : String,
            serviceId : String,
            minLength : Number,
            maxLength : Number,
            fromValue : Number,
            toValue   : Number
        } );

        var user = Meteor.user();

        // Check mandatory data items , checked also on the client side
        // @TODO: update validation function for inout
        var errors = validateRecord( 'Issues', ioAttributes );
        if( errors.ioName || errors.ioCat || errors.ioType || errors.ioLang )
            throw new Meteor.Error( 'invalid-entry', "You must provide name, description, type and language" );

        // Check if a document with the same serviceName and serviceType exists and item(s) changed, call update method
        // (i.e. re-save), otherwise insert new document/record (save-new)
        var docWithSameInfo = Issues.findOne( {
            ioName: ioAttributes.ioName,
            ioCat : ioAttributes.ioCat,
            ioType: ioAttributes.ioType
        } );

        // Update existing document/record, insert a new document/record
        if( docWithSameInfo ) {

            var docParams = _.extend( ioAttributes, {
                updatedBy  : user._id,
                updatedDate: new Date()
            } );
            try {
                var docId = Issues.update( { _id: docWithSameInfo._id }, { $set: docParams } );
                return {
                    updateStatus: true,
                    _id         : docId
                };
            }
            catch( error ) {
                throwError( error.reason );
            }
        }
        else {
            // insert a new record

            var docParams = _.extend( ioAttributes, {
                createdBy  : user._id,
                createdDate: new Date()
            } );

            try {
                var docId = Issues.insert( docParams );
                return {
                    insertSuccess: true,
                    _id          : docId
                };
            }
            catch( error ) {
                throwError( error.reason );
            }
        }
    },
    checkIssue: function( docName ) {
        check( docName, String );

        var docExist = Issues.findOne( { ioName: docName } );

        if( docExist ) {
            return {
                docExists: true
            };
        }
    },
    removeIssue( ioAttributes ) {

        // check if record exist (or with no sub-item) to determine if remove is required/permissible
        // check on the client and/or server side

        var docWithSameInfo = Issues.findOne( {
            ioName: ioAttributes.ioName,
            ioType: ioAttributes.ioType
        } );

        if( docWithSameInfo ) {
            var docId = Issues.remove( docWithSameInfo._id );
            return {
                _id: docId
            };
        }
        else {
            return {
                noRecord: true
            };
        }
    }
} );
