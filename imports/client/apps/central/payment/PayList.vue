<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-th-list"/> {{mcLabel.payList}}</h4>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <table class="w3-table w3-striped w3-border w3-hoverable" id="mcPayList">
                <thead>
                <tr class="w3-red">
                    <th scope="col">{{mcLabel.desc}}</th>
                    <th scope="col">{{mcLabel.payAmount}}</th>
                    <th scope="col">{{mcLabel.payCustomer}}</th>
                    <th scope="col">{{mcLabel.payAddress}}</th>
                    <th scope="col">{{mcLabel.payDate}}</th>
                    <th scope="col">{{mcLabel.payStatus}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in payItems" :key="item._id" @click.prevent="viewItem(item)">
                    <td>{{item.chargeInfo.description}}</td>
                    <td>{{valueAmount( item )}}</td>
                    <td>{{customerName( item.chargeInfo.metadata )}}</td>
                    <td>{{paymentAddress( item.tradePayment.tradePayAddress )}}</td>
                    <td>{{item.createdDate}}</td>
                    <td>{{item.chargeInfo.outcome.network_status}} :: {{item.chargeInfo.outcome.seller_message}}</td>
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

    const numFormat = require( 'numeral' );

    export default {
        name      : 'payList',
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
            fetchData(){
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
                            this.locationItems = this.$lo.sortBy( result.value, 'locationName' ).filter( ( item ) => {
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
                                return (item.recordType === 'charge-test' || item.recordType === 'charge-live');
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
            valueAmount( item ) {
                return `${item.chargeInfo.currency.toUpperCase()}${numFormat( item.chargeInfo.amount/100 ).format( '0,0.00' )}`;
            },
            paymentAddress( itemLoc ){
                const country = this.locationItems.find( ( item ) => {
                    return item._id === itemLoc.addressCountry;
                } );
                const state   = this.locationItems.find( ( item ) => {
                    return item._id === itemLoc.addressState;
                } );
                return `${itemLoc.contactName}(${itemLoc.contactPhone}) | ${itemLoc.streetNumber} ${itemLoc.streetName}, ${itemLoc.addressCity}, ${state.locationName}, ${itemLoc.postalCode} ${country.locationName}`;
            },
            totalAmount( amount ){
                return amount / 100;
            },
            customerName( item ){
                const username = item;
                return username ? `${username.name} | ${username.email}` : 'n/a';
            },
            shortDesc ( item ) {
                // set the short description for item.desc
                return this.$utils.shortString( item, this.$constant.getShortDesc() );
            },
            viewItem( item ) {
                // Set current item
                Session.set( 'currentPayItem', item );
                // Route to detail page
                this.$router.push( { name: 'payView' } );
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
