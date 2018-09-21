/**
 * Created by abbeymart on 2017-01-10.
 */
import { Random } from 'meteor/random';

export const resolvers = {
    Query: {
        user( root, args, context ) {
            // Only return the current user, for security
            if( context.userId === args.id ) {
                return context.user;
            }
        },
    },
    User : {
        emails      : ( { emails } ) => emails,
        randomString: () => Random.id(),
    }
};
