/**
 * Created by abbeymart on 2016-10-29.
 */

import { Mongo } from 'meteor/mongo';

// Invoices collection
export const Invoices = new Mongo.Collection( 'invoices' );
Invoices.deny( {
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

// Receipts collection
export const Receipts = new Mongo.Collection( 'receipts' );
Receipts.deny( {
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

