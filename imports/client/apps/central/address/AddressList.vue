<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-th-list"/> {{mcLabel.addressList}}</h4>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <table class="w3-table w3-striped w3-border w3-hoverable" id="mcAddressList">
                <thead>
                <tr class="w3-red">
                    <th scope="col">{{mcLabel.fullName}}</th>
                    <th scope="col">{{mcLabel.addressType}}</th>
                    <th scope="col">{{mcLabel.address}}</th>
                    <th scope="col">{{mcLabel.addressOwner}}</th>
                    <th scope="col">{{mcLabel.lang}}</th>
                    <th scope="col">{{mcLabel.isActive}}</th>
                    <th scope="col">{{mcLabel.update}}</th>
                    <th scope="col">{{mcLabel.delete}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in addressItems" :key="item._id">
                    <td>{{item.contactName}}</td>
                    <td>{{item.addressType}}</td>
                    <td>{{addressInfo( item )}}</td>
                    <td>{{ownerName( item.ownerId )}}</td>
                    <td>{{langName( item.addressLang )}}</td>
                    <td>
                        <!--show/hide depending on active-state (Yes/No)-->
                        <span v-if="item.isActive">{{mcLabel.yes}}<i class="glyphicon glyphicon-check"/></span>
                        <span v-else>{{mcLabel.no}}<i class="glyphicon glyphicon-off"/></span>
                    </td>
                    <td>
                        <a id="editAddressItem" href="#" @click.prevent="updateItem(item)">
                            {{mcLabel.update}}<i class="glyphicon glyphicon-edit"/>
                        </a>
                    </td>
                    <td>
                        <a id="removeAddressItem" href="#" @click.prevent="deleteItem(item)">
                            {{mcLabel.delete}}<i class="glyphicon glyphicon-remove-circle"/>
                        </a>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<style>

</style>
<script>
    import { Meteor } from 'meteor/meteor';
    import { centralMixin } from '../../../include/mixins/centralMixin';
    import { locationMixin } from '../../../include/mixins/locationMixin';
    import { orgMixin } from '../../../include/mixins/orgMixin';

    export default {
        name      : 'addressList',
        components: {},
        mixins    : [
            centralMixin,
            locationMixin,
            orgMixin,
        ],
        data() {
            return {}
        },
        methods   : {
            fetchData() {
                // Get current logged-in user's token, for resource access
                const userToken     = this.$auth.getToken(),
                      queryParams   = {},
                      currentItemId = '';
                // DDP || Meteor.method
                if( userToken ) {
                    // addresses
                    Meteor.call( 'getAddress', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'AddressError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage    = false;
                            this.pageMessage  = 'Items available';
                            const ownerType   = Session.get( 'currentOwnerType' ) || '';
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
            addressInfo( item ) {
                // address information
                const state   = this.locationItems.find( rec => {
                          return rec._id === item.addressState;
                      } ),
                      country = this.locationItems.find( rec => {
                          return rec._id === item.addressCountry;
                      } );
                if( state && country ) {
                    return `${item.streetNumber} ${item.streetName}, ${item.addressCity}, ${state.locationName}, ${item.postalCode}, ${country.locationName}`;
                }
            },
            ownerName( itemId ) {
                const ownerType = this.$store.getters['central/getOwnerType'];
                if( ownerType === 'User' ) {
                    const userItem = this.userItems.find( ( item ) => {
                        return item._id === itemId;
                    } );
                    return userItem ? `${userItem.username} | ${userItem.profile.firstName} ${userItem.profile.lastName}` : 'n/a';
                }
                if( ownerType === 'Organization' ) {
                    const orgItem = this.orgItems.find( ( item ) => {
                        return item._id === itemId;
                    } );
                    return orgItem ? `${orgItem.orgName}` : 'n/a';
                }
            },
            updateItem( item ) {
                // Set current item
                this.$store.dispatch('central/setAddressItem', item);
                // route to currentOwnerType page
                const ownerType = this.$store.getters['central/getOwnerType'];
                if( ownerType === 'User' ) {
                    this.$router.push( { name: 'userAddressDetail' } );
                }
                if( ownerType === 'Organization' ) {
                    this.$router.push( { name: 'orgAddressDetail' } );
                }
            },
            updateItems( items ) {
                // update multiple selected items
            },
            deleteItem( item ) {
                // send current item Id to the local delete/remove method
                const userToken = this.$auth.getToken();
                // Meteor method
                if( confirm( this.$message.confirmDelete ) ) {
                    if( userToken ) {
                        Meteor.call( 'removeAddress', item._id, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error deleting item. Please retry`;
                            }
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = 'Please login';
                    }
                }
            },
            deleteItems( items ) {
                // delete multiple selected items
            }
        },

        updated() {
            $( '#mcAddressList' ).DataTable( {
                destroy     : true,
                "pagingType": "full_numbers",
            } );
        }
    }
</script>
