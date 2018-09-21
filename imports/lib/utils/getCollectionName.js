/**
 * Created by abbeymart on 2016-02-13.
 * Determine/set collection name based on the calling function-method request
 */
// Import required modules
import * as central from "/imports/collections/Central";
import * as asset from "/imports/collections/Asset";
import * as mpe from "/imports/collections/Mpe";
import * as pam from "/imports/collections/Pam";
import * as fin from "/imports/collections/Finance";

export default function( coll ) {
    "use strict";

    // Check the attributes formats, using the try catch to track any errors
    try {
        check( coll, String );
    } catch( error ) {
        return error.reason;
    }

    // Determine collection name
    let collName;

    // CENTRAL COLLECTIONS
    if( coll === 'Addresses' ) {
        collName = central.Addresses;
    }
    if( coll === 'Assignments' ) {
        collName = central.Assignments;
    }
    if( coll === 'Audits' ) {
        collName = central.Audits;
    }
    if( coll === 'Contacts' ) {
        collName = central.Contacts;
    }
    if( coll === 'Contents' ) {
        collName = central.Contents;
    }
    if( coll === 'Converts' ) {
        collName = central.Converts;
    }
    if( coll === 'Currencies' ) {
        collName = central.Currencies;
    }
    if( coll === 'Delegations' ) {
        collName = central.Delegations;
    }
    if( coll === 'Documents' ) {
        collName = central.Documents;
    }
    if( coll === 'Emans' ) {
        collName = central.Emans;
    }
    if( coll === 'Elogs' ) {
        collName = central.ELogs;
    }
    if( coll === 'Folders' ) {
        collName = central.Folders;
    }
    if( coll === 'Grants' ) {
        collName = central.Grants;
    }
    if( coll === 'Images' ) {
        collName = central.Images;
    }
    if( coll === 'InOuts' ) {
        collName = central.InOuts;
    }
    if( coll === 'Issues' ) {
        collName = central.Issues;
    }
    if( coll === 'Labels' ) {
        collName = central.Labels;
    }
    if( coll === 'Languages' ) {
        collName = central.Languages;
    }
    if( coll === 'Locations' ) {
        collName = central.Locations;
    }
    if( coll === 'Messages' ) {
        collName = central.Messages;
    }
    if( coll === 'Organizations' ) {
        collName = central.Organizations;
    }
    if( coll === 'PayProviders' ) {
        collName = central.PayProviders;
    }
    if( coll === 'Payments' ) {
        collName = central.Payments;
    }
    if(coll === 'Refunds'){
        collName = central.Refunds;
    }
    if( coll === 'Persons' ) {
        collName = central.Persons;
    }
    if( coll === 'Phones' ) {
        collName = central.Phones;
    }
    if( coll === 'Policies' ) {
        collName = central.Policies;
    }
    if( coll === 'PServices' ) {
        collName = central.PServices;
    }
    if( coll === 'Raacis' ) {
        collName = central.Raacis;
    }
    if( coll === 'Roles' ) {
        collName = central.Roles;
    }
    if( coll === 'Services' ) {
        collName = central.Services;
    }
    if( coll === 'Settings' ) {
        collName = central.Settings;
    }
    if( coll === 'ShipProviders' ) {
        collName = central.ShipProviders;
    }
    if( coll === 'ShipCosts' ) {
        collName = central.ShipCosts;
    }
    if( coll === 'Shippings' ) {
        collName = central.Shippings;
    }
    if( coll === 'ShipOrders' ) {
        collName = central.ShipOrders;
    }
    if( coll === 'StandardCategories' ) {
        collName = central.StandardCategories;
    }
    if( coll === 'StandardCodes' ) {
        collName = central.StandardCodes;
    }
    if( coll === 'Taxes' ) {
        collName = central.Taxes;
    }
    if( coll === 'Todos' ) {
        collName = central.Todos;
    }
    if( coll === 'Users' ) {
        collName = central.Users;
    }

    // ASSET COLLECTIONS
    if( coll === 'Categories' ) {
        collName = asset.Categories;
    }
    if( coll === 'Discounts' ) {
        collName = asset.Discounts;
    }
    if( coll === 'Features' ) {
        collName = asset.Features;
    }
    if( coll === 'Products' ) {
        collName = asset.Products;
    }
    if( coll === 'Prices' ) {
        collName = asset.Prices;
    }
    if( coll === 'ProductDocuments' ) {
        collName = asset.ProductDocuments;
    }
    if( coll === 'ProductReviews' ) {
        collName = asset.ProductReviews;
    }
    if( coll === 'Inventories' ) {
        collName = asset.Inventories;
    }

    // MPE COLLECTIONS
    if( coll === 'Carts' ) {
        collName = mpe.Carts;
    }
    if( coll === 'Orders' ) {
        collName = mpe.Orders;
    }
    if( coll === 'OrderCategories' ) {
        collName = mpe.OrderCategories;
    }
    if( coll === 'Trades' ) {
        collName = mpe.Trades;
    }
    if( coll === 'Wishes' ) {
        collName = mpe.Wishes;
    }


    // PAM COLLECTIONS
    if( coll === 'Activities' ) {
        collName = pam.Activities;
    }
    if( coll === 'ActLevels' ) {
        collName = pam.ActLevels;
    }
    if( coll === 'Events' ) {
        collName = pam.Events;
    }
    if( coll === 'GroupLevels' ) {
        collName = pam.GroupLevels;
    }
    if( coll === 'Schedules' ) {
        collName = pam.Schedules;
    }
    if( coll === 'Tasks' ) {
        collName = pam.Tasks;
    }


    // SDM COLLECTIONS


    // HCM COLLECTIONS


    // FINANCE COLLECTIONS
    if( coll === 'Invoices' ) {
        collName = fin.Invoices;
    }
    if( coll === 'Receipts' ) {
        collName = fin.Receipts;
    }


    // HMS COLLECTIONS

    return collName;
}
