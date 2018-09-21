/**
 * Created by abbeymart on 2016-09-28.
 * Application state management - simple and versatile (review / finalise)
 * 1. states storage (local, in-memory* and/or persistence)
 * 2. scope: enterprise(mc), solution(central), package(lang) and function(langList)
 * 3. info: scope, stateName(var), stateData [{}], date/time stamp, createdBy, version, expire etc.
 * 4. security: allow update/delete by owner/session-Id (createdBy) only
 * 4. multiple records storage for capturing history (immutable for uniqueness), perform undo action
 */
// Required imports
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { mcMessage } from '/imports/lib/locales/getMessage';
// import { ownsDocCreated } from './authorize';
import _ from 'lodash';

// Client-side state collection/store: in-memory, stored values reset on page refresh
export const ClientStates = new Mongo.Collection( 'clientStates', { connection: null } );
ClientStates.deny( {
    remove() {
        return true;
    }
} );

// Client-side state activities, temporary/in-memory: insert / update (upsert) new/existing state
// include userId(createdBy)/paramName for data identification
export const saveState = function( state ) {
    "use strict";
    // console.log(state);
    // Check the attributes formats, using the try catch to track any errors
    try {
        check( state, Object );
    } catch( error ) {
        return (error.reason + ':' + mcMessage.paramErrorMessage);
    }
    // console.log(state);

    // Extend state information with date/time stamp, unique ID...
    const userId  = Meteor.userId();
    let docParams = _.extend( state, {
        createdBy  : userId,
        createdDate: new Date()
    } );

    // check if record exist - update, !exist - insert
    const currentRec = ClientStates.findOne( { name: state.name } );
    console.log( currentRec );

    // In-memory local states storage
    try {
        if( currentRec ) {
            const docId = ClientStates.update( { name: state.name }, docParams );
            return {
                message: "State record saved (updated) successfully",
                _id    : docId
            };
        }
        const docId = ClientStates.insert( docParams );
        return {
            message: "State record saved (created) successfully",
            _id    : docId
        };
    }
    catch( error ) {
        return (error.reason + ': ' + mcMessage.insertErrorMessage);
    }
};

export const getState = function( param ) {
    return ClientStates.findOne( { name: param } );
};

// TODO: Client-side state activities, persistent (localStorage / webDB?)
// Client-side states persistent storage: localStorage

// TODO: optional sever-side states collection/store: persistent
// reference key/Id stored on the client-side
export const ServerStates = new Mongo.Collection( 'serverStates' );
ServerStates.deny( {
    insert() {
        return true;
    },
    update() {
        return true;
    },
    remove() {
        return true;
    }
} );

// @TODO: get state information - most recent or historical (list)
