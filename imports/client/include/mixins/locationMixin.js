/**
 * Created by abbeymart on 2017-09-02
 */

import { Meteor } from 'meteor/meteor';

export const locationMixin = {
    data() {
        return {
            locationItems: [],
            addressItems : [],
            phoneItems   : [],
        }
    },
    computed: {},
    methods : {
        getLocation() {
            // Get current logged-in user's token, for resource access
            const userToken     = this.$auth.getToken(),
                  queryParams   = {},
                  currentItemId = '';
            if( userToken ) {
                // addresses
                Meteor.call( 'getAddress', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'AddressError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage    = false;
                        this.pageMessage  = 'Items available';
                        const ownerType   = this.$store.getters[ 'central/getOwnerType' ] || '';
                        this.addressItems = this.$lo.sortBy( result.value, 'addressCountry' ).filter( ( item ) => {
                            return item.ownerType === ownerType;
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
                // locations
                Meteor.call( 'getLocation', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'LocationError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage     = false;
                        this.pageMessage   = 'Items available';
                        this.locationItems = this.$lo.sortBy( result.value, 'locationName' );
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
        this.getLocation();
    }
};
