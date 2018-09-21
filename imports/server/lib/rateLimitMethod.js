/**
 * Created by abbeymart on 2017-03-28.
 */
import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import _ from 'lodash';
import { Users } from '/imports/collections/Central';

DDPRateLimiter.setErrorMessage( ( { timeToReset } ) => {
    const time    = Math.ceil( timeToReset / 1000 );
    const seconds = time === 1 ? 'second' : 'seconds';
    return `Too many requests. Try again in ${time} ${seconds}.`;
} );

const fetchMethodNames = ( methods ) => _.pluck( methods, 'name' );

const assignLimits = ( { methods, limit, timeRange, userId } ) => {
    const methodNames = fetchMethodNames( methods );
    DDPRateLimiter.addRule( {
        type: 'method',
        userId() {
            return Users.findOne( {_id: userId} ).isAdmin === false;
        },
        name( name ) {
            return _.contains( methodNames, name );
        },
    }, limit, timeRange );
};

export const rateLimitMethod = ( options ) => assignLimits( options );
