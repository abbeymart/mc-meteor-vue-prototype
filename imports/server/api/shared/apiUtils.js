/**
 * Created by abbeymart on 2017-01-04.
 * API utility/common functions for mConnect REST/web services
 */
import { AccessKeys } from '/imports/collections/Central';

export const apiUtils = {
    authentication( token ) {
        if( token ) {
            const getUser = AccessKeys.findOne( { token: token }, { fields: { userId: 1 } } );
            if( getUser ) {
                return getUser.userId;
            }
            return false;
        }
        return false;
    },
    connection( request ) {
        const getRequestContents = apiUtils.getRequestContents( request ),
              apiKey             = getRequestContents.api_key,
              validUser          = apiUtils.authentication( apiKey );

        if( validUser ) {
            delete getRequestContents.api_key;
            return { owner: validUser, data: getRequestContents };
        }
        return { error: 401, message: "Invalid API key." };
    },
    handleRequest( context, resource, method ) {
        const connection = apiUtils.connection( context.request );
        if( !connection.error ) {
            apiUtils.corsAccess( context.response );
            apiUtils.methods[ resource ][ method ]( context, connection );
        } else {
            apiUtils.response( context, 401, connection );
        }
    },
    corsAccess( res ) {
        res.setHeader( "Campaigns-Type", "application/json" );
        res.setHeader( "Access-Control-Allow-Origin", "*" );
        // res.setHeader( 'Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS' );
        res.setHeader( "Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept" );
    },
    getRequestContents( request ) {
        switch( request.method ) {
            case "GET":
                return request.query;
            case "POST":
            case "PUT":
            case "DELETE":
                return request.body;
        }
    },
    hasData( data ) {
        return Object.keys( data ).length > 0;
    },
    response( res, statusCode, data ) {
        res.setHeader( 'Content-Type', 'application/json' );
        // res.statusCode = 200; // express-js
        res.writeHead( statusCode );
        res.end( JSON.stringify( data ) );
    },
    validate( data, pattern ) {
        return Match.test( data, pattern );
    },
};
