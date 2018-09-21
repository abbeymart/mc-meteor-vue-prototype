/**
 * Created by saturnbay on 2014-11-26.
 * Update by abbeymart on 2016-10-01 | 2017-02-27
 * mConnect user-to-user messages tracking package:
 * Items: subject, desc, createdBy, createdDate, isActive, status (draft, sent/date etc.),
 * recipients [public, admin, user-group, user], responses...
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { validateMessage } from '/imports/lib/utils/ValidateRecord';
import removeRecord from './shared/removeRecord';
import saveRecord from './shared/saveRecord';
import { Messages } from '/imports/collections/Central';
import getRecord from './shared/getRecord';
import { checkError, validateError } from './shared/utils';
const sanitizeHtml = require( 'sanitize-html' );

import { Email } from 'meteor/email';

Meteor.methods( {
    getMessage( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Messages', { collParams, currentDocId, token } );
    },
    // insert / update method:
    saveMessage( collParams, currentDocId, token = '' ) {

        // console.log(collParams);

        // Check the attributes formats
        try {
            check( collParams, {
                msgTitle       : String,
                msgBody        : String,
                msgDesc        : String,
                msgCat         : String,
                msgStatus      : String,
                msgSendToStatus: String,
                msgPriorStatus : String,
                msgPrivacy     : String,
                msgSender      : String,
                msgReceiver    : String,
                msgLang        : String,
                parentId       : String,
                isActive       : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError(error);
        }

        // Sanitize contentDesc (server side)
        collParams.msgDesc = sanitizeHtml( collParams.msgDesc );

        // Check mandatory data items, checked also on the client side
        const errors = validateMessage( collParams );
        if( errors.msgTitle || errors.msgBody || errors.msgCat || errors.msgStatus || errors.msgSender || errors.msgLang ) {
            return validateError(errors);
        }

        // Insert: check if duplicate record exists, for a user within the same category and language
        const duplicateDoc = Messages.findOne( {
            msgTitle : collParams.msgTitle,
            msgSender: collParams.msgSender,
            msgCat   : collParams.msgCat,
            msgLang  : collParams.msgLang
        } ) ? true : false;

        // Update: check if another record name exist, for a user within the same category and language
        const docNotUnique = Messages.findOne( {
            _id      : {
                $ne: currentDocId
            },
            msgTitle : collParams.msgTitle,
            msgSender: collParams.msgSender,
            msgCat   : collParams.msgCat,
            msgLang  : collParams.msgLang
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Messages', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    deleteMessage( currentDocId, token = '' ) {
        // NOT used (saveMsg used instead / called from the client side)
        const msgAction    = 'Deleted',
              duplicateDoc = false,
              docNotUnique = false,
              collParams   = { msgStatus: msgAction };

        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
        } catch( error ) {
            return checkError(error);
        }

        // // @TODO: Update the msgStatus to 'Deleted', using the saveRecord method
        // return Messages.update({_id: currentDocId}, {$update: {msgStatus: msgAction}});
        return saveRecord( 'Messages', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeMessage( currentDocId, token = '' ) {

        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
        } catch( error ) {
            return checkError(error);
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Messages', currentDocId, token );
    },
    // TODO: send email to external receivers
    sendEmailMessage( to, from, subject, text ) {

        check( [ to, from, subject, text ], [ String ] );

        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        this.unblock();

        Email.send( {
            to     : to,
            from   : from,
            subject: subject,
            text   : text
        } );
    },
    // TODO: receive external validated email messages and store in the messages collection
    receiveEmailMessage( to, from, subject, text ) {
        check( [ to, from, subject, text ], [ String ] );

        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        this.unblock();

        Email.send( {
            to     : to,
            from   : from,
            subject: subject,
            text   : text
        } );
    }
} );
