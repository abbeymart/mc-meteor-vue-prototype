/**
 * Created by abbeymart on 2017-01-10.
 */
import { createApolloServer } from 'meteor/apollo';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import cors from 'cors';

import { typeDefs } from '/imports/api/schemas';
import { resolvers } from '/imports/api/resolvers';

const schema = makeExecutableSchema( {
    typeDefs,
    resolvers,
} );


//Fix CORS issue
const whitelist   = [
    // Allow domains here
    'http://localhost:8080',
];
const corsOptions = {
    origin( origin, callback ){
        const originIsWhitelisted = whitelist.indexOf( origin ) !== -1;
        callback( null, originIsWhitelisted );
    },
    credentials: true
};

createApolloServer( {
    schema,
    graphiql: true,
    pretty  : true,
} );

// graphQLServer.use( cors( corsOptions ) );
