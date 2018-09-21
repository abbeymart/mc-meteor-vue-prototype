/**
 * Created by abbeymart on 2016-02-17.
 * Central (Shared services) collections: define object, structure and restrict access
 */
import { Mongo } from 'meteor/mongo';

// TODO: access-control, determine login state & get access-key/id
const userAccessId = 'test_id_info';
const userAllowed  = true;

// AccessKeys collection | Deny all client-side insert, update and remove tasks
export const AccessKeys = new Mongo.Collection( 'accessKeys' );
AccessKeys.deny( {
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

// Addresses collection | Deny all client-side insert, update and remove tasks
export const Addresses = new Mongo.Collection( 'addresses' );
Addresses.deny( {
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

// Assignments collection
export const Assignments = new Mongo.Collection( 'assignments' );
Assignments.deny( {
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

// Audits collection
export const Audits = new Mongo.Collection( 'audits' );
Audits.deny( {
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

// Contacts collection | Deny all client-side insert, update and remove tasks
export const Contacts = new Mongo.Collection( 'contacts' );
Contacts.deny( {
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

// Contents collection
export const Contents = new Mongo.Collection( 'contents' );
Contents.deny( {
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

// Converts (conversion) collection
export const Converts = new Mongo.Collection( 'converts' );
Converts.deny( {
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

// Currency collection
export const Currencies = new Mongo.Collection( 'currencies' );
Currencies.deny( {
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

// Delegations collection
export const Delegations = new Mongo.Collection( 'delegations' );
Delegations.deny( {
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

// Documents collection
export const Documents = new Mongo.Collection( 'documents' );
Documents.deny( {
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

// Images store management
const createThumb     = function( fileObj, readStream, writeStream ) {
    // Transform the image into a 10x10px thumbnail
    gm( readStream, fileObj.name() ).resize( '10', '10' ).stream().pipe( writeStream );
};
const imageManipulate = new FS.Store.GridFS( "thumbs", { transformWrite: createThumb } );

// const imageStore    = new FS.Store.FileSystem( 'images' );
const imageStore    = new FS.Store.GridFS( 'images' );
export const Images = new FS.Collection( 'images', {
    stores: [ imageStore ]
} );

Images.allow( {
    insert: function( userId, doc ) {
        // the user must be logged in, and the document must be owned by the user
        // return (userId && doc.createdBy === userId);
        if( userAllowed ) {
            return true;
        } else {
            return false;
        }
    },
    update: function( userId, doc, fields, modifier ) {
        // can only change your own documents
        // return doc.createdBy === userId;
        if( userAllowed ) {
            return true;
        } else {
            return false;
        }
    },
    remove: function( userId, doc ) {
        // can only remove your own documents
        // return doc.createdBy === userId;
        if( userAllowed ) {
            return true;
        } else {
            return false;
        }
    },
    download() {
        if( userAllowed ) {
            return true;
        } else {
            return false;
        }
    }
} );

// Documents (non-image) store management
const docStore    = new FS.Store.GridFS( 'docs' );
export const Docs = new FS.Collection( 'docs', {
    stores: [ docStore ]
} );

Docs.allow( {
    insert: function( userId, doc ) {
        // the user must be logged in, and the document must be owned by the user
        // return (userId && doc.createdBy === userId);
        if( userAllowed ) {
            return true;
        } else {
            return false;
        }
    },
    update: function( userId, doc, fields, modifier ) {
        // can only change your own documents
        // return doc.createdBy === userId;
        if( userAllowed ) {
            return true;
        } else {
            return false;
        }
    },
    remove: function( userId, doc ) {
        // can only remove your own documents
        // return doc.createdBy === userId;
        if( userAllowed ) {
            return true;
        } else {
            return false;
        }
    },
    download() {
        if( userAllowed ) {
            return true;
        } else {
            return false;
        }
    }
} );

// Error list collection
export const Emans = new Mongo.Collection( 'emans' );
Emans.deny( {
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

// Error log collection
export const ELogs = new Mongo.Collection( 'elogs' );
ELogs.deny( {
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

// Error log collection
export const Folders = new Mongo.Collection( 'folders' );
Folders.deny( {
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

// Grant (access/roles assignment) log collection
export const Grants = new Mongo.Collection( 'grants' );
Grants.deny( {
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

// Service component input/outputs collection
export const InOuts = new Mongo.Collection( 'inOuts' );
InOuts.deny( {
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

// Issues (& risks) collection
export const Issues = new Mongo.Collection( 'issues' );
Issues.deny( {
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

// Label collection
export const Labels = new Mongo.Collection( 'labels' );
Labels.deny( {
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

// Define language collection
export const Languages = new Mongo.Collection( 'languages' );
Languages.deny( {
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

// Locations collection
export const Locations = new Mongo.Collection( 'locations' );
Locations.deny( {
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

// Messages collection
export const Messages = new Mongo.Collection( 'messages' );
Messages.deny( {
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

// Organizations collection
export const Organizations = new Mongo.Collection( 'organizations' );
Organizations.deny( {
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

// Payments collections
export const PayProviders = new Mongo.Collection( 'payProviders' );
PayProviders.deny( {
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
export const Payments = new Mongo.Collection( 'payments' );
Payments.deny( {
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

export const Refunds = new Mongo.Collection( 'refunds' );
Refunds.deny( {
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

// Persons collection, extend users collection, linked by  userId from Meteor.user()
export const Persons = new Mongo.Collection( 'persons' );
Persons.deny( {
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

// Phones collection
export const Phones = new Mongo.Collection( 'phones' );
Phones.deny( {
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

// Policies collection
//  @TODO: reflect/research effective policy definitions/conditions mapping/development
export const Policies = new Mongo.Collection( 'policies' );
Policies.deny( {
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

// Policy-Services collection
export const PServices = new Mongo.Collection( 'pservices' );
PServices.deny( {
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

// Roles collection
export const Raacis = new Mongo.Collection( 'raacis' );
Raacis.deny( {
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

// Roles collection
export const Roles = new Mongo.Collection( 'roles' );
Roles.deny( {
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

// Services collection
export const Services = new Mongo.Collection( 'services' );
Services.deny( {
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

export const Settings = new Meteor.Collection( 'settings' );
Settings.deny( {
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

// Shipping collections
export const ShipProviders = new Mongo.Collection( 'shipProviders' );
ShipProviders.deny( {
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

export const ShipCosts = new Mongo.Collection( 'shipCosts' );
ShipCosts.deny( {
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

export const Shippings = new Mongo.Collection( 'shippings' );
Shippings.deny( {
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

export const ShipOrders = new Mongo.Collection( 'shipOrders' );
ShipOrders.deny( {
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

// Standard Categories collection
export const StandardCategories = new Mongo.Collection( 'standardCategories' );
StandardCategories.deny( {
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

// Standard Codes collection
export const StandardCodes = new Mongo.Collection( 'standardCodes' );
StandardCodes.deny( {
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

// Todos collection
export const Taxes = new Mongo.Collection( 'taxes' );
Taxes.deny( {
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

// Todos collection
export const Todos = new Mongo.Collection( 'todos' );
Todos.deny( {
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

// Users collection (Meteor.users()) - optional
export const Users = Meteor.users;
Users.deny( {
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

Meteor.users.deny( {
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
