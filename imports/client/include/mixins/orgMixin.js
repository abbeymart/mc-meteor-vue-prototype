/**
 * Created by abbeymart on 2017-09-02
 */

import { Meteor } from 'meteor/meteor';
// import { Session } from 'meteor/session';
// import { validateLanguage } from '../../../lib/utils/ValidateRecord';

export const orgMixin = {
    data() {
        return {
            orgItems     : [],
        }
    },
    computed: {},
    methods : {
        getSecureOrg() {
            // Get current logged-in user's token, for resource access
            const userToken     = this.$auth.getToken(),
                  queryParams   = {},
                  currentItemId = '';
            if( userToken ) {
                // organizations
                Meteor.call( 'getOrg', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'OrganizationError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.orgItems    = this.$lo.sortBy( result.value, 'orgName' );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
            } else {
                this.isMessage   = true;
                this.pageMessage = 'Access-key missing or expired. Please login again.';
            }
        },
    },
    created() {
        // get / fetchData
        this.getSecureOrg();
    }
};
