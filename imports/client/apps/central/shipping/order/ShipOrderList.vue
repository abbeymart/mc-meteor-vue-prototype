<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-th-list"/> {{mcLabel.shipOrderList}}</h4>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <table class="w3-table w3-striped w3-border w3-hoverable" id="mcShipList">
                <thead>
                <tr class="w3-red">
                    <th scope="col">{{mcLabel.orderNumber}}</th>
                    <th scope="col">{{mcLabel.shipAmount}}</th>
                    <th scope="col">{{mcLabel.payCustomer}}</th>
                    <th scope="col">{{mcLabel.shipAddress}}</th>
                    <th scope="col">{{mcLabel.shipDate}}</th>
                    <th scope="col">{{mcLabel.payStatus}}</th>
                    <th scope="col">{{mcLabel.detail}}</th>
                    <!--<th scope="col">{{mcLabel.delete}}</th>-->
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in shipItems" :key="item._id" @click.prevent="viewItem(item)">
                    <td>{{item.shipOrder}}</td>
                    <td>{{item.shipAmount}}</td>
                    <td>{{item.shipFor}}</td>
                    <td>{{item.shipTo}}</td>
                    <td>{{shippedDate(item.shipDate)}}</td>
                    <td>{{item.shipStatus}}</td>
                    <td>
                        <a id="editItem" href="#" @click.prevent="viewItem(item)">{{mcLabel.detail}}
                            <i class="glyphicon glyphicon-edit"/>
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
    import { mcMessage } from '/imports/lib/locales/getMessage';

    const moment = require( 'moment' );

    export default {
        name      : 'shipOrderList',
        components: {},
        data() {
            return {
                mcLabel      : '',
                isMessage    : false,
                pageMessage  : '',
                shipItems    : [],
                userItems    : [],
                productItems : [],
                orderItems   : [],
                itemParams   : {},
                tradeCurrency: 'US$',
                itemId       : '',
                currentItem  : '',
                isAdmin      : false,
                isSave       : false,
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
                    // shipping
                    Meteor.call( 'getShip', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'ShippingError: Retry.';
                        } else if( result.code === 'success'
                        ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.shipItems = this.$lo.sortBy( result.value, 'shipOrder' ).filter( ( item ) => {
                                return item.isActive === true;
                            } );
                        }
                        else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                    // products
                    Meteor.call( 'getProduct', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'ProductError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage    = false;
                            this.pageMessage  = 'Items available';
                            this.productItems = this.$lo.sortBy( result.value, 'productName' );
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
            shippedDate(shipDate){
                return moment( shipDate ).format( "YYYY-MMM-DD" );
            },
            shortDesc ( item ) {
                // set the short description for item.desc
                return this.$utils.shortString( item, this.$constant.getShortDesc() );
            },
            viewItem( item ) {
                // Set current item
                this.$store.dispatch('central/setShipOrderItem', item);
                // Route to detail page
                this.$router.push( { name: 'shipOrderDetail' } );
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
            const userItem = this.$store.getters['central/getCurrentUser'];
            if( userItem ) {
                this.isAdmin = userItem.isAdmin;
            }
            // Fetch items from the server, based on role assignment / authorization
            this.fetchData();
        },
        updated() {
            $( '#mcShipList' ).DataTable( {
                destroy     : true,
                "pagingType": "full_numbers",
            } );
        }
    }
</script>