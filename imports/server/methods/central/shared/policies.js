/**
 * Created by saturnbay on 15-05-10.
 * Policy functions for mConnect transactions - solutions, packages, functions and data
 * @TODO, Steps:
 * 1. Define services (Services collection)
 * 2. Define policies (& sub-policies) by business units (StandardCodes collection)
 * 3. Assign service to policy / policies (PServices collection)
 * 4. Define policy rules: include items and groups (AND/OR... relatedTo-item/groupId, multi-group)
 * Policy business unit > category > group > 1 (single-item) or multiple items
 * @TODO: Algorithm for the policy status, as the pre-condition for service delivery (revisit)
 * policy definitions : service-request provide inputs (as defined by applicable policy/policies)
 */
// Import required modules
import { Meteor } from 'meteor/meteor';
import { Policies } from '/imports/collections/Central';
import { mcMessage } from '/imports/lib/locales/getMessage';

// Service-policy mapping/processing algorithm
let policyGroups        = [], // For combined policy items (AND/OR | (AND)OR(AND))
    policyItems         = [], // For separate policy items
    policyGroupsPassed  = '',
    policyItemsPassed   = '',
    initialPolicyPassed = true,
    policyPassed        = false;

// Function to be used to validate service policy
function ServicePolicyPassed( serviceItem, serviceItemParams, serviceItemPolicy ) {
    "use strict";
    // Check the parameters
    try {
        check( serviceItem, String );
        check( serviceItemParams, Object );
        check( serviceItemPolicy, String );
    } catch( error ) {
        return Meteor.Error( error.reason + ':' + mcMessage.paramErrorMessage );
    }

    // Get service policy items (for combined/group and separate items)
    const pItems = Policies.find( { policyGroup: serviceItemPolicy } );
    if( pItems ) {
        pItems.forEach( ( pItem ) => {
            // @TODO: policy with grouped items
            // Check if the pItem has child/children or is a child, OR part of group definition
            const pItemChild = Policies.findOne( { policyParent: pItem._id } );
            if( pItemChild || pItem.policyParent ) {
                // Store the pItems into the policyGroups
                policyGroups.push( pItem );
            }
            // Separate items (non-grouped item)
            policyItems.push( pItem );
        } )
    }

    // @TODO: For policy group-items (AND / OR) and multi-groups ((AND)|OR|(AND))
    if( policyGroups ) {
        policyGroups.forEach( ( pGroup ) => {
            // Get policy items
            const pItems = Policies.find( { policyGroup: pGroup.pserviceGroup } );

            let pGroupPassed = '',
                pItemName    = '',
                pItemValue   = '',
                pGroupItems  = [];

            // @TODO: Determine if serviceItemRequest passed the rule defined by pItem(s)
            pItems.forEach( ( pItem ) => {
                const pItemName     = pItem.policyItem,
                      pItemOperator = pItem.policyItemOperator;
                // @TODO: build the rule for serviceItemRequest, based on policy item definitions
                // i.e. pItemName, pItemOperator, pItemRelation, pItemRelationName, pItemValue
                // For separate items with values (=, !=, <, >, <=, >=)
                switch( pItemOperator ) {
                    case '=': {
                        serviceItemParams[ pItemName ] === pItem.policyItemValue ? true : false;
                    }

                }

                // For item combinations (ORs and ANDs) organized by group

                pGroupItems.push( pItemName );
            } );

            // Push each group result into the policy Group passed variable (policyGroupsPassed)
            policyGroupsPassed.push( pGroupPassed );
        } );
    }

    // For separate service-policy items, non-grouped/non-combined
    if( policyItems ) {
        let itemsPassed = [];
        policyItems.forEach( ( pItem ) => {
            const pItemName     = pItem.policyItem,
                  pItemOperator = pItem.policyItemOperator;
            // @TODO: build the rule for serviceItemRequest, based on policy item definitions
            // i.e. pItemName, pItemOperator, pItemRelation, pItemRelationName, pItemValue
            // For separate items with values (=, !=, <, >, <=, >=)
            switch( pItemOperator ) {
                case '=': {
                    serviceItemParams[ pItemName ] === pItem.policyItemValue ? true : false;

                }
            }
            // For item combinations (ORs and ANDs) organized by group
            itemsPassed.push( pItemName );
        } );
        policyGroupsPassed.push( itemsPassed );
    }

    // Check if all the policy groups and items passed
    if( policyGroupsPassed ) {
        policyGroupsPassed.forEach( ( pPassed, i ) => {
            //If all pPassed is true, return true otherwise false
            policyPassed = initialPolicyPassed && pPassed[ i ];
        } );
    }

    // Validate/compare servicePolicyItems with the policyItems defined for a policy group items

    // Return policyPassed
    return policyPassed;
}

export default ServicePolicyPassed;
