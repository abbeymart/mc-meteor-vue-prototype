/**
 * Created by abbeymart on 2017-09-10
 */
import { Meteor } from 'meteor/meteor';
import { apiUtils } from '/imports/server/api/shared/apiUtils';
import { mcMessage } from '/imports/lib/locales/getMessage';

// Listen to incoming HTTP requests (can only be used on the server).
WebApp.connectHandlers.use( '/api/login', ( req, res, next ) => {
    // console.log(req.body);
    // get login-parameters
    const loginParams = {
        username : req.body.username || req.params.username || req.headers.username || '',
        password : req.body.password || req.params.password || req.headers.password || '',
        logParams: req.body.logParams || req.params.logParams || req.headers.logParams || {},
    };

    // validate username and password
    if( loginParams.username === '' || loginParams.password === '' ) {
        const msg = `${mcMessage.loginRequired} | ${mcMessage.passwordRequired}`;
        return apiUtils.response( res, 401, msg );
    }

    // Allow CORS (cross origin resource sharing)
    apiUtils.corsAccess( res );

    // call Meteor-method, handle errors and return JSON response/value (JSON.stringify)
    // GET or POST request:
    if( req.method === 'GET' || req.method === 'POST' ) {
        const result = Meteor.call( 'loginUser', loginParams );
        // check result and perform next action or send error message
        if( !_.isEmpty( result ) ) {
            apiUtils.response( res, result.resCode, result );
        } else {
            apiUtils.response( res, 404, `${mcMessage.noInfo}` );
        }
    } else {
        const msg = `${mcMessage.getPostRequired}`;
        apiUtils.response( res, 401, msg );
    }
} );
