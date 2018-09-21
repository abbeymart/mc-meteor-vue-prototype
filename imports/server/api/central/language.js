/**
 * Created by abbeymart on 2017-09-08
 * Language API - REST-Full services
 */
import { Meteor } from 'meteor/meteor';
import { apiUtils } from '/imports/server/api/shared/apiUtils';
import { mcMessage } from '/imports/lib/locales/getMessage';
import { unAuthorized } from '/imports/server/methods/central/shared/utils';

// Listen to incoming HTTP requests (can only be used on the server)
WebApp.connectHandlers.use( '/api/language', ( req, res, next ) => {
    // get / set request inputs
    const token         = req.body.token || req.params.token || req.headers.token || '',
          itemParams    = req.body.itemParams || req.params.itemParams || req.headers.itemParams || {},
          currentItemId = req.body.itemId || req.params.itemId || req.headers.itemId || '',
          skip          = req.body.skip || req.params.skip || req.headers.skip || 0,
          limit         = req.body.limit || req.params.limit || req.headers.limit || 10000;

    // security checks: ensure valid token
    if( !apiUtils.authentication( token ) ) {
        return apiUtils.response( res, 401, unAuthorized() );
    }

    // Allow CORS (cross origin resource sharing
    apiUtils.corsAccess( res );

    // determine req-method (get, save (insert/update -post/put) or delete),
    // call Meteor-method, handle errors and return JSON response/value (JSON.stringify)

    let result = '';

    switch(req.method) {
        case 'GET':
            result = Meteor.call( 'getLang', itemParams, currentItemId, token, skip, limit );
            // check result and perform next action or send error message
            if( !_.isEmpty( result ) ) {
                apiUtils.response( res, result.resCode, result );
            } else {
                apiUtils.response( res, 404, `${mcMessage.noInfo}` );
            }
            break;
        case 'POST':
        case 'PUT':
            result = Meteor.call( 'saveLang', itemParams, currentItemId, token );
            // check result and perform next action or send error message
            if( !_.isEmpty( result ) ) {
                apiUtils.response( res, result.resCode, result );
            } else {
                apiUtils.response( res, 404, `${mcMessage.noInfo}` );
            }
            break;
        case 'DELETE':
            result = Meteor.call( 'removeLang', currentItemId, token, );
            if( !_.isEmpty( result ) ) {
                apiUtils.response( res, result.resCode, result );
            } else {
                apiUtils.response( res, 404, `${mcMessage.noInfo}` );
            }
            break;
        default:
            apiUtils.response( res, 404, `${mcMessage.noInfo}` );
    }
} );
