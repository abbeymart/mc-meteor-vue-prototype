/**
 * Created by abbeymart on 2017-04-01.
 * Get collection(s) records count
 */
// Import required module(s)
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import getCollectionName from '/imports/lib/utils/getCollectionName'
import { checkError } from './utils';

Meteor.methods( {
    collCount( coll ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( coll, String );
        } catch( error ) {
            return checkError( error );
        }
        // Get the collection name-reference
        const collName = getCollectionName( coll );

        // Get the collection items count
        if( collName ) {
            return collName.find( {} ).count();
        }
        return 0;
    },
    collActiveCount( coll ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( coll, String );
        } catch( error ) {
            return checkError( error );
        }
        // Get the collection name-reference
        const collName = getCollectionName( coll );

        // Get the collection items count
        if( collName ) {
            return collName.find( {isActive: true} ).count();
        }
        return 0;
    }
} );

export default function( coll ) {
    // Check the attributes formats, using the try catch to track any errors
    try {
        check( coll, String );
    } catch( error ) {
        return checkError( error );
    }

    // Get the collection name-reference
    const collName = getCollectionName( coll );

    // Get the collection items count
    if( collName ) {
        return collName.find( {} ).count();
    }
    return 0;
}
