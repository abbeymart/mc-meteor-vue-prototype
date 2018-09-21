/**
 * Created by saturnbay on 2015-01-20 | Updated/re-designed: Feb-24-2017
 * mConnect activities for sales/services request/trading delegation
 * ACTIVITIES:
 * categories: Finance, HR, Project, Sales-Services, Operation etc. (standardCodes)
 * actions: buy, sell, request, review, inform, contribute, recommend, approve (standardCodes)
 * activities: cat, name, desc, min, max, unit, max-level/action for fulfillment >> other lower-levels/actions are
 * permitted on the activity by assignment
 * ASSIGNMENT:
 * activity-level-actions: actId, [level, action, partyCount???] group-level????
 * assignments: act, level, actions(true/false), actGroup by OU (scope)
 * group-user assignments: actGroup, user... store as part of userProfile
 * ===
 * ACTIONS | TASKS: sample product/service requests / orders / payments / shippings, linked activity Action/Request-id
 * (service-request), current-step, next-step, status... FUNCTIONS: Permitted actions based on delegation for an
 * activity or a service-request
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { validateAct, validateActLevel } from '/imports/lib/utils/ValidateRecord';
import removeRecord from './shared/removeRecord';
import saveRecord, { saveSubRecord } from './shared/saveRecord';
import getRecord from './shared/getRecord';
import { checkError, validateError } from './shared/utils';
import { Activities, ActLevels, GroupLevels, Tasks } from '/imports/collections/Pam';

Meteor.methods( {
    getAct( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Activities', { collParams, currentDocId, token } );
    },
    // insert / update method:
    saveAct( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                actCat  : String,
                actTitle: String,
                actMin  : Number,
                actMax  : Number,
                actUnit : String,
                actLevel: String,
                actDesc : String,
                actLang : String,
                isActive: Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateAct( collParams );
        if( errors.actTitle || errors.actCat || errors.actLang || errors.actMin || errors.actMax || errors.actLevel || errors.actDesc ) {
            return validateError( errors );
        }

        // Insert: check if duplicate record exists
        const duplicateDoc = Activities.findOne( {
            actCat  : collParams.actCat,
            actTitle: collParams.actTitle,
            actLang : collParams.actLang
        } ) ? true : false;

        // Update: check if another record name exists
        const docNotUnique = Activities.findOne( {
            _id     : {
                $ne: currentDocId
            },
            actCat  : collParams.actCat,
            actTitle: collParams.actTitle,
            actLang : collParams.actLang
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Activities', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeAct( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Activities', currentDocId, token );
    },

    getActLevel( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'ActLevels', { collParams, currentDocId, token } );
    },
    // insert / update method:
    saveActLevel( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        // console.log(collParams);
        try {
            check( collParams, {
                act          : String,
                level        : String,
                group        : String,
                scope        : String,
                desc         : String,
                canBuy       : Boolean,
                canSell      : Boolean,
                canRequest   : Boolean,
                canInform    : Boolean,
                canContribute: Boolean,
                canRecommend : Boolean,
                canApprove   : Boolean,
                isActive     : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateActLevel( collParams );
        if( errors.act || errors.level || errors.group || errors.desc ) {
            return validateError( errors );
        }

        // Insert: check if duplicate record exists
        const duplicateDoc = ActLevels.findOne( {
            act  : collParams.act,
            level: collParams.level,
            group: collParams.group,
        } ) ? true : false;

        // Update: check if another record name exists
        const docNotUnique = ActLevels.findOne( {
            _id  : {
                $ne: currentDocId
            },
            act  : collParams.act,
            level: collParams.level,
            group: collParams.group,
        } ) ? true : false;

            // console.log(collParams, currentDocId, duplicateDoc, docNotUnique);

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'ActLevels', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    saveActLevel1( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                level        : String,
                action       : String,    // [{level, action},... ]
                actionParties: Number,
                levelDesc    : String,
                isActive     : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateAct( collParams );
        if( errors.actName || errors.actCat || errors.actLang || errors.actMin || errors.actMax || errors.actLevel || errors.actDesc ) {
            return validateError( errors );
        }

        const subItem = {
            refLevel: {}
        };

        // Call saveRecord method to create new or update existing record
        return saveSubRecord( 'Activities', collParams, currentDocId, token );
    },
    removeActLevel( currentDocId, token = '' ) {

        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'ActLevels', currentDocId, token );
    },

    getGroupLevel( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'GroupLevels', { collParams, currentDocId, token } );
    },
    // insert / update method:
    saveGroupLevel( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                actCat  : String,
                actTitle: String,
                actMin  : String,
                actMax  : String,
                actUnit : String,
                actLevel: String,
                actDesc : String,
                actLang : String,
                isActive: Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateAct( collParams );
        if( errors.actName || errors.actCat || errors.actLang || errors.actMin || errors.actMax || errors.actLevel || errors.actDesc ) {
            return validateError( errors );
        }

        // Insert: check if duplicate record exists
        const duplicateDoc = GroupLevels.findOne( {
            actCat  : collParams.actCat,
            actTitle: collParams.actTitle,
            actLang : collParams.actLang
        } ) ? true : false;

        // Update: check if another record name exists
        const docNotUnique = GroupLevels.findOne( {
            _id     : {
                $ne: currentDocId
            },
            actCat  : collParams.actCat,
            actTitle: collParams.actTitle,
            actLang : collParams.actLang
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'GroupLevels', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeGroupLevel( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'GroupLevels', currentDocId, token );
    },

    getTask( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Tasks', { collParams, currentDocId, token } );
    },
    // insert / update method:
    saveTask( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                actName : String,
                actCat  : String,
                actMin  : String,
                actMax  : String,
                actUnit : String,
                actLevel: String,
                actDesc : String,
                actLang : String,
                isActive: Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateAct( collParams );
        if( errors.actName || errors.actCat || errors.actLang ) {
            return validateError( errors );
        }

        // Insert: check if duplicate record exists for the same ownerId (user, organization, contact)
        const duplicateDoc = Tasks.findOne( {
            actTask  : collParams.actTask,
            actStatus: collParams.actStatus
        } ) ? true : false;

        // Update: check if another record name exists for the same ownerId (user, organization, contact)
        const docNotUnique = Tasks.findOne( {
            _id      : {
                $ne: currentDocId
            },
            actTask  : collParams.actTask,
            actStatus: collParams.actStatus
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Tasks', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeTask( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Tasks', currentDocId, token );
    }
} );

