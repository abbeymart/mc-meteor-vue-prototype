/**
 * Created by abbeymart on 2017-02-12.
 * Errors' formatting functions
 */

import { mcMessage } from '/imports/lib/locales/getMessage';

export function checkError( error ) {
    return {
        code   : 'paramsError',
        resCode: 406,
        value  : error + ': ' + mcMessage.paramErrorMessage
    };
}

export function validateError( errors ) {
    return {
        code   : 'paramsError',
        resCode: 406,
        value  : errors + ' : ' + mcMessage.validateInputs
    };
}

export function tokenExpired() {
    return {
        code   : 'tokenExpired',
        resCode: 401,
        value  : 'Unauthorized. Token / Access-key has expired. Please login again.'
    };
}

export function unAuthorized() {
    return {
        code   : 'unAuthorized',
        resCode: 401,
        value  : `Authentication needed to access this resource. Provide correct access-key or login again :: ${mcMessage.authErrorMessage}`
    };
}

export function notFound() {
    return {
        code   : 'notFound',
        resCode: 404,
        value  : `${mcMessage.noRecord} :: No item(s) found.`
    };
}

export function success( value ) {
    return {
        code   : 'success',
        resCode: 200,
        value  : value
    };
}

export function removeDenied() {
    return {
        code   : 'removedDenied',
        resCode: 401,
        value  : mcMessage.removeDenied
    };
}

export function notRemoved() {
    return {
        code   : 'notRemoved',
        resCode: 200,
        value  : error + ': ' + 'Error deleting record/document. Please retry'
    };
}

export function removed() {
    return {
        code   : 'removed',
        resCode: 200,
        value  : mcMessage.recordDeleted
    };
}

export function subItems(  ) {
    return {
        code   : 'subItems',
        resCode: 401,
        value  : mcMessage.subItems
    };
}

export function duplicateRec(  ) {
    return {
        code   : 'duplicate',
        resCode: 403,
        value  : mcMessage.docDuplicate
    };
}

export function updated(  ) {
    return {
        code   : 'updated',
        resCode: 200,
        value  : `${docId}: Updated document / record.`
    };
}

export function updateError(  ) {
    return {
        code   : 'updateError',
        resCode: 403,
        value  : error.reason + ': ' + mcMessage.updateErrorMessage
    };
}

export function updateDenied(  ) {
    return {
        code   : 'updateDenied',
        resCode: 403,
        value  : mcMessage.updateNotAuthorize
    };
}

export function inserted(  ) {
    return {
        code   : 'inserted',
        resCode: 200,
        value  : `${docId}: New document/record created.`
    };
}

export function insertError(  ) {
    return {
        code   : 'insertError',
        resCode: 403,
        value  : error.reason + ': ' + mcMessage.insertErrorMessage
    };
}

export function recExist() {
    return {
        code   : 'exist',
        resCode: 403,
        value  : 'Document/record exists.'
    };
}
