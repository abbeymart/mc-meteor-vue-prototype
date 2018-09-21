/**
 * Created by abbeymart on 2016-02-27.
 * Assets Management collections: define and restrict access
 */
import { Mongo } from 'meteor/mongo';

"use strict";

// Categories collection
export const Categories = new Mongo.Collection( 'categories' );
Categories.deny( {
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

// Discounts collection
export const Discounts = new Mongo.Collection( 'discounts' );
Discounts.deny( {
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

// Features collection
export const Features = new Mongo.Collection( 'features' );
Features.deny( {
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


// Prices collection
export const Prices = new Mongo.Collection( 'prices' );
Prices.deny( {
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

// Products collection
export const Products = new Mongo.Collection( 'products' );
Products.deny( {
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

// Product Images collection
export const ProductDocuments = new Mongo.Collection( 'productDocuments' );
ProductDocuments.deny( {
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

// Product Reviews collection
export const ProductReviews = new Mongo.Collection( 'productReviews' );
ProductReviews.deny( {
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

// Inventories collection
export const Inventories = new Mongo.Collection( 'inventories' );
Inventories.deny( {
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
