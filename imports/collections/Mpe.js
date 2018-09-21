/**
 * Created by abbeymart on 2016-08-18.
 * Marketplace Explorer collections
 * Deny all client-side insert, update and remove tasks
 */
import { Mongo } from 'meteor/mongo';

// Carts collection
export const Carts = new Mongo.Collection( 'carts' );
Carts.deny( {
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

// Orders collection
export const Orders = new Mongo.Collection( 'orders' );
Orders.deny( {
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

// OrderCategories collection
export const OrderCategories = new Mongo.Collection( 'orderCategories' );
OrderCategories.deny( {
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

// Trades collection: carts, orders...
export const Trades = new Mongo.Collection( 'trades' );
Trades.deny( {
    insert() {
        return true;
    },
    update() {
        return true;
    },
    remove() {
        return true;
    },
} );


// Wishes collection
export const Wishes = new Mongo.Collection( 'wishes' );
Wishes.deny( {
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

