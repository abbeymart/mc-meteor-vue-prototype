<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-th-list"/> {{mcLabel.inventoryList}}</h4>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <table class="w3-table w3-striped w3-border w3-hoverable" id="mcPriceList">
                <thead>
                <tr class="w3-red">
                    <th scope="col">{{mcLabel.productName}}</th>
                    <th scope="col">{{mcLabel.quantity}}</th>
                    <th scope="col">{{mcLabel.location}}</th>
                    <th scope="col">{{mcLabel.dateAdded}}</th>
                    <th scope="col">{{mcLabel.update}}</th>
                    <!--<th scope="col">{{mcLabel.delete}}</th>-->
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in inventoryItems" :key="item._id" @click.prevent="updateItem(item)">
                    <td>{{productName( item.invProduct )}}</td>
                    <td>{{item.invQuantity}}</td>
                    <td>{{locationName( item.invStore )}}</td>
                    <td>{{invDate( item.createdDate )}}</td>
                    <td>
                        <a id="editItem" href="#" @click.prevent="updateItem(item)">{{mcLabel.detail}}
                            <i class="glyphicon glyphicon-edit"/>
                        </a>
                    </td>
                    <!--<td>-->
                        <!--<a id="deleteItem" href="#" @click.prevent="deleteItem(item)">-->
                            <!--{{mcLabel.delete}}<i class="glyphicon glyphicon-remove-circle"/>-->
                        <!--</a>-->
                    <!--</td>-->
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
    import _ from 'lodash';
    const moment = require( 'moment' );

    export default {
        name      : 'orderInventoryList',
        components: {},
        data() {
            return {
                mcLabel       : '',
                isMessage     : false,
                pageMessage   : '',
                inventoryItems: [],
                codeItems     : [],
                orderCatItems : [],
                locationItems : [],
                productItems  : [],
                itemParams    : {},
                itemId        : '',
                currentItem   : '',
                isSave        : false,
            }
        },
        computed  : {
            wishFolders() {
                return this.orderCatItems.filter( ( item ) => {
                    return (item.catGroup === 'Wish');
                } );
            },
            cartFolders() {
                return this.orderCatItems.filter( ( item ) => {
                    return (item.catGroup === 'Cart');
                } );
            },
        },
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
                            this.locationItems = _.sortBy( result.value, 'locationName' ).filter( ( item ) => {
                                return item.isActive === true;
                            } );
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                    // get standard code items
                    Meteor.call( 'getCode', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'CodeError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.codeItems   = _.sortBy( result.value, 'codeName' ).filter( ( item ) => {
                                return item.isActive === true;
                            } );
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                    // languages
                    Meteor.call( 'getLang', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'LanguageError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.langItems   = _.sortBy( result.value, 'langName' ).filter( ( item ) => {
                                return item.isActive === true;
                            } );
                        } else {
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
                            this.productItems = _.sortBy( result.value, 'productName' );
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                    // prices
                    Meteor.call( 'getInventory', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'InventoryError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage      = false;
                            this.pageMessage    = 'Items available';
                            this.inventoryItems = _.sortBy( result.value, 'createdDate' );
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
            recordCount() {
                Meteor.call( 'collCount', 'Prices', ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'CountError: Retry.';
                    } else {
                        this.itemsCount = result;
                    }
                } );
            },
            shortDesc ( item ) {
                // set the short description for item.desc
                return this.$utils.shortString( item, this.$constant.getShortDesc() );
            },
            invDate( itemDate ) {
                return moment( itemDate ).format();
//                return moment( itemDate ).format( "YYYY-MM-DD, h:mm:ss a"  );
            },
            productName ( itemId ) {
                const itemInfo = this.productItems.find( ( item ) => {
                    return (item._id === itemId);
                } );
                return itemInfo ? itemInfo.productName : 'n/a';
            },
            locationName ( itemId ) {
                const itemInfo = this.locationItems.find( ( item ) => {
                    return (item._id === itemId);
                } );
                return itemInfo ? itemInfo.locationName : 'n/a';
            },
            updateItem( item ) {
                // Set current item
                this.$store.dispatch('central/setInventoryItem', item);
                // Route to detail page
                this.$router.push( { name: 'orderInventoryDetail' } );
            },
            deleteItem( item ) {
                // TODO: remove/disable delete/remove method
                const userToken = this.$auth.getToken();
                if( confirm( this.$message.confirmDelete ) ) {
                    const itemId = item._id;
                    if( !itemId ) {
                        this.isMessage   = false;
                        this.pageMessage = mcMessage.itemMissing;
                    }
                    // Meteor method
                    if( userToken ) {
                        Meteor.call( 'removeInventory', itemId, userToken, ( error, result ) => {
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

            },
        },
        created() {
            this.mcLabel = this.$label;
            // get records count
            this.recordCount();
            // Fetch items from the server, based on role assignment / authorization
            this.fetchData();
        },
        updated() {
            $( '#mcPriceList' ).DataTable( {
                destroy     : true,
                "pagingType": "full_numbers",
            } );
        }
    }
</script>
