<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-th-list"/> {{mcLabel.orderPaysList}}</h4>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <table class="w3-table w3-striped w3-border w3-hoverable" id="mcPayList">
                <thead>
                <tr class="w3-red">
                    <th scope="col">{{mcLabel.orderNumber}}</th>
                    <th scope="col">{{mcLabel.email}}</th>
                    <th scope="col">{{mcLabel.amount}}</th>
                    <th scope="col">{{mcLabel.payStatus}}</th>
                    <th scope="col">{{mcLabel.payDate}}</th>
                    <th scope="col">{{mcLabel.desc}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in payItems" :key="item._id" @click.prevent="viewItem(item)">
                    <td>{{item.orderNumber}}</td>
                    <td>{{item.chargeInfo.email}}</td>
                    <td>{{valueAmount( item )}}</td>
                    <td>{{item.chargeInfo.paymentStatus}}</td>
                    <td>{{item.createdDate}}</td>
                    <td>{{item.chargeInfo.description}}</td>
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
    import { Session } from 'meteor/session';
    import { mcMessage } from '/imports/lib/locales/getMessage';
    import _ from 'lodash';

    export default {
        name      : 'orderPaymentList',
        components: {},
        data() {
            return {
                mcLabel      : '',
                isMessage    : false,
                pageMessage  : '',
                payItems     : [],
                locationItems: [],
                itemParams   : {},
                tradeCurrency: 'US$',
                itemId       : '',
                currentItem  : '',
                isAdmin      : false,
                isSave       : false,
            }
        },
        props     : {
            payType: {
                type   : String,
                default: ''
            }
        },
        computed  : {},
        methods   : {
            fetchData() {
                // Fetch items from the server, based on role assignment / authorization
                // Get current logged-in user's token, for resource access
                const userToken     = this.$auth.getToken(),
                      queryParams   = {},
                      currentItemId = '';
                // DDP || Meteor.method
                if( userToken ) {
                    // locations
                    Meteor.call( 'getLocation', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'LocationError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage     = false;
                            this.pageMessage   = 'Items available';
                            this.locationItems = _.sortBy( result.value, 'locationName' ).filter( ( item ) => {
                                return item.isActive === true;
                            } );
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                    // payments
                    Meteor.call( 'getPay', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'PaymentError: Retry.';
                        } else if( result.code === 'success'
                        ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.payItems    = result.value.filter( ( item ) => {
                                return (item.recordType === 'invoice-payment');
                            } );
                        }
                        else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Access-key missing or expired. Please login again.';
                }
            },
            paymentAddress( itemLoc ) {
                const country = this.locationItems.find( ( item ) => {
                    return item._id === itemLoc.addressCountry;
                } );
                const state   = this.locationItems.find( ( item ) => {
                    return item._id === itemLoc.addressState;
                } );
                return `${itemLoc.contactName}(${itemLoc.contactPhone}) | ${itemLoc.streetNumber} ${itemLoc.streetName}, ${itemLoc.addressCity}, ${state.locationName}, ${itemLoc.postalCode} ${country.locationName}`;
            },
            valueAmount( item ) {
                return `${item.chargeInfo.currency.toUpperCase()}${this.$num( item.chargeInfo.amount/100).format( '0,0.00' )}`;
            },
            customerName( item ) {
                const username = item;
                return username ? `${username.name} | ${username.email}` : 'n/a';
            },
            shortDesc( item ) {
                // set the short description for item.desc
                return this.$utils.shortString( item, this.$constant.getShortDesc() );
            },
            viewItem( item ) {
                // Set current item
                Session.set( 'currentPayItem', item );
                // Route to detail page
                this.$router.push( { name: 'payDetail' } );
            },
            deleteItem( item ) {
                const userToken = this.$auth.getToken();
                if( confirm( this.$message.confirmDelete ) ) {
                    const itemId = item._id;
                    if( !itemId ) {
                        this.isMessage   = false;
                        this.pageMessage = mcMessage.itemMissing;
                    }
                    // Meteor method
                    if( userToken ) {
                        Meteor.call( 'removePay', itemId, userToken, ( error, result ) => {
                                if( error ) {
                                    this.isMessage   = true;
                                    this.pageMessage = `${error}: Error deleting item. Please retry`;
                                }
                                this.isMessage   = true;
                                this.pageMessage = `${result.code}: ${result.value}`;
                            }
                        )
                        ;
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = 'Please login';
                    }
                }
            },
            updateItems( items ) {
                // update multiple selected items

            },
            deleteItems( items ) {
                // delete multiple selected items

            }
        },
        created() {
            this.mcLabel = this.$label;
            // get the isAdmin status for the current user (set from the main Header)
            if( Session.get( "currentUser" ) ) {
                this.isAdmin = Session.get( "currentUser" ).isAdmin;
            }
            // Fetch items from the server, based on role assignment / authorization
            this.fetchData();
        },
        updated() {
            $( '#mcPayList' ).DataTable( {
                destroy     : true,
                "pagingType": "full_numbers",
            } );
        }
    }
</script>