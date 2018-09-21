<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-th-list"/> {{mcLabel.productList}}</h4>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <!--product-image | product-info(name, category, price, author, seller, location...| actions(add-to-cart/wish lists...)-->
            <table class="w3-table w3-striped w3-border w3-hoverable" id="mcProductList">
                <thead>
                <tr class="w3-red">
                    <th scope="col">{{mcLabel.name}}</th>
                    <th scope="col">{{mcLabel.cat}}</th>
                    <th scope="col">{{mcLabel.group}}</th>
                    <th scope="col">{{mcLabel.cost}}</th>
                    <th scope="col">{{mcLabel.location}}</th>
                    <th scope="col">{{mcLabel.addWish}}</th>
                    <th scope="col">{{mcLabel.addCart}}</th>
                    <th scope="col">{{mcLabel.detail}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in productItems" :key="item._id">
                    <td>{{item.productName}}</td>
                    <td>{{catName( item.productCat )}}</td>
                    <td>{{item.productGroup}}</td>
                    <td>{{itemCost( item )}}</td>
                    <td>{{itemLocation( item )}}</td>
                    <td>
                        <div>
                            <!--<label for="wishFolder">{{mcLabel.addWish}}</label>-->
                            <select class="form-control" v-model="wishFolder" id="wishFolder"
                                    v-on:change="addWishItem(item._id)">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.wish}}</option>
                                <option v-for="wish in wishFolders" :value="wish._id">
                                    {{ wish.catName}}
                                </option>
                            </select>
                        </div>
                    </td>
                    <td>
                        <div>
                            <select class="form-control" v-model="cartFolder" id="cartFolder"
                                    v-on:change="addCartItem(item._id)">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.cart}}</option>
                                <option v-for="wish in cartFolders" :value="wish._id">
                                    {{ wish.catName}}
                                </option>
                            </select>
                        </div>
                    </td>
                    <td>
                        <a id="editItem" href="#" @click.prevent="updateItem(item)">{{mcLabel.detail}}
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
    import { Session } from 'meteor/session';
    import { mcMessage } from '/imports/lib/locales/getMessage';
    import _ from 'lodash';

    export default {
        name      : 'productSearchView',
        components: {},
        data() {
            return {
                mcLabel      : '',
                isMessage    : false,
                pageMessage  : '',
                productItems : [],
                codeItems    : [],
                orderCatItems: [],
                locationItems: [],
                itemParams   : {},
                itemId       : '',
                currentItem  : '',
                wishFolder   : '',
                cartFolder   : '',
                isSave       : false,
                itemsCounts  : 0,
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
                      currentItemId = '';

                let queryParams  = {},
                    searchText   = '',
                    searchParams = {};

                // extend queryParams for search action
                if( Session.get( 'mcSearchCat' ) === 'Services' && Session.get( 'mcSearchKey' ) ) {
                    searchText   = Session.get( 'mcSearchKey' );
                }
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
                    // order categories
                    Meteor.call( 'getOrderCat', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'OrderCategoryError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage     = false;
                            this.pageMessage   = 'Items available';
                            this.orderCatItems = _.sortBy( result.value, 'catName' );
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
                    if( searchText ) {
                        // products-text-search
                        Meteor.call( 'getProductText', searchText, userToken, ( error, result ) => {
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
                    } else {
                        // products
                        Meteor.call( 'getProduct', searchParams, currentItemId, userToken, ( error, result ) => {
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
                    }
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Access-key missing or expired. Please login again.';
                }
            },
            recordCount() {
                Meteor.call( 'collCount', 'Products', ( error, result ) => {
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
            catName ( itemId ) {
                const itemInfo = this.orderCatItems.find( ( item ) => {
                    return (item._id === itemId && item.catGroup === 'Product');
                } );
                return itemInfo ? itemInfo.catName : 'n/a';
            },
            itemCost( item ) {
                return `${item.productCurrency}${item.productCost}`;
            },
            itemLocation( itemLoc ){
                const country = this.locationItems.find( ( item ) => {
                    return item._id === itemLoc.productCountry;
                } );
                const state   = this.locationItems.find( ( item ) => {
                    return item._id === itemLoc.productState;
                } );
                return `${itemLoc.productCity}, ${state.locationName}, ${country.locationName}` || `${itemLoc.productCity}` || 'n/a';
            },
            updateItem( item ) {
                // Set current item
                Session.set( 'currentProductItem', item );
                // Route to detail page
                console.log('start view...');
                this.$router.push( { name: 'searchProductDetail' } );
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
                        Meteor.call( 'removeProduct', itemId, userToken, ( error, result ) => {
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
            addWishItem( itemId ){
                // TODO: Add to wishlist
                const wish = this.wishFolder;

            },
            addCartItem( itemId ){
                // TODO: Add to wishlist
                const cart = this.wishFolder;

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
            $( '#mcProductList' ).DataTable( {
                destroy     : true,
                "pagingType": "full_numbers",
            } );
        }
    }
</script>