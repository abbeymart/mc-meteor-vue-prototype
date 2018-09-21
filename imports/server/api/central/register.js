/**
 * Created by abbeymart on 2017-09-11
 */
import { Meteor } from 'meteor/meteor';
import { apiUtils } from '/imports/server/api/shared/apiUtils';
import { mcMessage } from '/imports/lib/locales/getMessage';
import _ from 'lodash';

// Listen to incoming HTTP requests (can only be used on the server)
WebApp.connectHandlers.use( '/api/register', ( req, res, next ) => {
    // get / set request inputs
    const regParams = {
        username       : req.body.username || req.params.username || req.headers.username || '',
        password       : req.body.password || req.params.password || req.headers.password || '',
        userEmail      : req.body.userEmail || req.params.userEmail || req.headers.userEmail|| '',
        firstName      : req.body.firstName || req.params.firstName || req.headers.firstName|| '',
        lastName       : req.body.lastName || req.params.lastName || req.headers.lastName || '',
        userLang       : req.body.userLang || req.params.userLang || req.headers.userLang||  '',
        confirmPassword: req.body.confirmPassword || req.params.confirmPassword || req.headers.confirmPassword ||  '',
        recoveryEmail  : req.body.recoveryEmail || req.params.recoveryEmail || req.headers.recoveryEmail ||  '',
        userAcceptTerm : req.body.userAcceptTerm || req.params.userAcceptTerm || req.headers.userAcceptTerm ||  false,
    };
    // Allow CORS (cross origin resource sharing
    apiUtils.corsAccess( res );

    // call Meteor-method, handle errors and return JSON response/value (JSON.stringify)
    // POST request:
    if( req.method === 'POST' ) {
        const result = Meteor.call( 'registerUser', regParams );
        // check result and perform next action or send error message
        if( !_.isEmpty(result)) {
            apiUtils.response( res, result.resCode, result );
        } else {
            apiUtils.response( res, 404, `${mcMessage.noInfo}` );
        }
    }else {
        const msg = `${mcMessage.postRequired}`;
        apiUtils.response( res, 401, msg );
    }
} );
