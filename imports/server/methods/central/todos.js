/**
 * Created by saturnbay on 2014-12-14.
 */
// Import required module(s)
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { validateTodo, validateAssign } from '/imports/lib/utils/ValidateRecord';
import saveRecord from './shared/saveRecord';
import removeRecord from './shared/removeRecord';
import getRecord from './shared/getRecord';
import { checkError, validateError } from './shared/utils';
import { mcMessage } from '/imports/lib/locales/getMessage';
import { Todos, Assignments } from "/imports/collections/Central";

Meteor.methods( {
    getTodo( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Todos', { collParams, currentDocId, token } );
    },
    // insert / update method:
    saveTodo( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        // Storing date in long format:
        collParams.todoStart = new Date( collParams.todoStart );
        collParams.todoEnd   = new Date( collParams.todoEnd );

        try {
            check( collParams, {
                todoName      : String,
                todoDesc      : String,
                todoType      : String,
                todoService   : String,
                parentId      : String,
                todoLang      : String,
                todoLikelihood: String,
                todoImpact    : String,
                todoAssignment: String,
                todoStart     : Date,
                todoEnd       : Date,
                todoUpdate  : String,
                todoStatus    : String,
                isActive      : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items , checked also on the client side
        const errors = validateTodo( collParams );
        if( errors.todoName || errors.todoDesc || errors.todoType || errors.todoLang || errors.todoUpdate ) {
            return validateError( errors );
        }

        // Save method check, for new document/record:
        // Check if a duplicate document with the same todoName, todoType, todoLang and todoService exists, for save
        // method, to ensure uniqueness
        const duplicateDoc = Todos.findOne(
            {
                todoName   : collParams.todoName,
                todoType   : collParams.todoType,
                todoLang   : collParams.todoLang,
                todoService: collParams.todoService
            }
        ) ? true : false;

        // Update method check, for existing record:
        // Check if other document with the same / changed name exist, to avoid duplicate name
        const docNotUnique = Todos.findOne(
            {
                _id        : { $ne: currentDocId },
                todoName   : collParams.todoName,
                todoType   : collParams.todoType,
                todoLang   : collParams.todoLang,
                todoService: collParams.todoService
            }
        ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Todos', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeTodo( currentDocId, token = '' ) {

        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return (error.reason + ': ' + mcMessage.paramErrorMessage);
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Todos', currentDocId, token );
    },
    getAssign( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Assignments', { collParams, currentDocId, token } );
    },
    saveAssign( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                assignTodo  : String,
                assignUser  : String,
                assignEffort: Number,
                assignUnit  : String,
                assignDesc  : String,
                isActive    : Boolean,
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return (error.reason + ':' + mcMessage.paramErrorMessage);
        }

        // Check mandatory data items , checked also on the client side
        const errors = validateAssign( collParams );
        if( errors.assignTodo || errors.assignUser ) {
            return validateError( errors );
        }

        // Save method check, for new document/record:
        // Check if a duplicate document with the same todoName, todoType, todoLang and todoService exists, for save
        // method, to ensure uniqueness
        const duplicateDoc = Assignments.findOne(
            {
                assignService: collParams.assignService,
                assignTodo   : collParams.assignTodo,
                assignUser   : collParams.assignUser
            }
        ) ? true : false;

        // Update method check, for existing record:
        // Check if other document with the same / changed name exist, to avoid duplicate name
        const docNotUnique = Assignments.findOne(
            {
                _id          : { $ne: currentDocId },
                assignService: collParams.assignService,
                assignTodo   : collParams.assignTodo,
                assignUser   : collParams.assignUser
            }
        ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Assignments', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeAssign( currentDocId, token = '' ) {

        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Assignments', currentDocId, token );
    }
} );
