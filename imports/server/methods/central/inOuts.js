/**
 * Created by saturnbay on 2014-12-25.
 * Inputs and Outputs for all use cases/function objects
 * @TODO: Revisit to develop as a complete package, linking services-items-policies (as part of analysis)
 * Info: serviceId, ioName, ioDesc, ioCat(input/output), isRequired (yes/no => true/false),
 * ioType (alphanumeric, text, number, date, boolean, array, document. mixed etc.), minLength, maxLength,
 * fromValue, toValue, isActive, createdBy, createdDate etc.
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { mcMessage } from '/imports/lib/locales/getMessage';
import { validateInOut } from '/imports/lib/utils/ValidateRecord';
import removeRecord from "./shared/removeRecord";
import {InOuts} from "/imports/collections/Central";

Meteor.methods( {
    // insert / update method:
    saveInOut( ioAttributes ) {
        // Check the attributes formats
        // @TODO: include all required variables in the UI and helper
        check( this.userId, String );
        check( ioAttributes, {
            ioName: String,
            ioDesc: String,
            ioCat: String,
            ioType: String,
            ioLang: String,
            isRequired: String,
            isActive: String,
            serviceId: String,
            minLength: Number,
            maxLength: Number,
            fromValue: Number,
            toValue: Number
        } );

        var user = Meteor.user();

        // Check mandatory data items , checked also on the client side
        // @TODO: update validation function for inout
        var errors = validateRecord( 'InOuts', ioAttributes );
        if ( errors.ioName || errors.ioCat || errors.ioType || errors.ioLang )
            throw new Meteor.Error( 'invalid-entry', "You must provide name, description, type and language" );

        // Check if a document with the same serviceName and serviceType exists and item(s) changed, call update method
        // (i.e. re-save), otherwise insert new document/record (save-new)
        var docWithSameInfo = InOuts.findOne( {
            ioName: ioAttributes.ioName,
            ioCat: ioAttributes.ioCat,
            ioType: ioAttributes.ioType
        } );

        // Update existing document/record, insert a new document/record
        if ( docWithSameInfo ) {

            var docParams = _.extend( ioAttributes, {
                updatedBy: user._id,
                updatedDate: new Date()
            } );
            try {
                var docId = InOuts.update( { _id: docWithSameInfo._id }, { $set: docParams } );
                return {
                    updateStatus: true,
                    _id: docId
                };
            }
            catch ( error ) {
                throwError( error.reason );
            }
        }
        else {
            // insert a new record

            var docParams = _.extend( ioAttributes, {
                createdBy: user._id,
                createdDate: new Date()
            } );

            try {
                var docId = InOuts.insert( docParams );
                return {
                    insertSuccess: true,
                    _id          : docId
                };
            }
            catch ( error ) {
                throwError( error.reason );
            }
        }
    },
    checkInOut( docName ) {
        check( docName, String );

        var docExist = InOuts.findOne( { ioName: docName } );

        if ( docExist ) {
            return {
                docExists: true
            };
        }
    },
    removeInOut( ioAttributes ) {
        // check if record exist (or with no sub-item) to determine if remove is required/permissible
        // check on the client and/or server side

        var docWithSameInfo = InOuts.findOne( {
            ioName: ioAttributes.ioName,
            ioType: ioAttributes.ioType
        } );

        if ( docWithSameInfo ) {
            var docId = InOuts.remove( docWithSameInfo._id );
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



