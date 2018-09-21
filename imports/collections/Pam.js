/**
 * Created by abbeymart on 2016-02-27.
 * Planning and Activities Management collections: define and restrict access
 */
import { Mongo } from 'meteor/mongo';

"use strict";

// Activities collection
export const Activities = new Mongo.Collection( 'activities' );
Activities.deny( {
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

export const ActLevels = new Mongo.Collection( 'actLevels' );
ActLevels.deny( {
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

export const GroupLevels = new Mongo.Collection( 'groupLevels' );
GroupLevels.deny( {
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

export const Tasks = new Mongo.Collection( 'tasks' );
Tasks.deny( {
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

// Events collection
export const Events = new Mongo.Collection( 'events' );
Events.deny( {
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

// Schedules collection
export const Schedules = new Mongo.Collection( 'schedules' );
Schedules.deny( {
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
