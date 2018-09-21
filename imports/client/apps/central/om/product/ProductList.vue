<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-th-list"/> {{mcLabel.productList}}</h4>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <table class="w3-table w3-striped w3-border w3-hoverable" id="mcProductList">
                <thead>
                <tr class="w3-red">
                    <th scope="col">{{mcLabel.productName}}</th>
                    <th scope="col">{{mcLabel.cat}}</th>
                    <th scope="col">{{mcLabel.group}}</th>
                    <th scope="col">{{mcLabel.cost}}</th>
                    <th scope="col">{{mcLabel.location}}</th>
                    <th scope="col">{{mcLabel.addWish}}</th>
                    <th scope="col">{{mcLabel.addCart}}</th>
                    <th scope="col">{{mcLabel.update}}</th>
                    <th scope="col">{{mcLabel.delete}}</th>
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
                        <!--action: add-to-cart / wish-list on select or click-->
                        <div>
                            <select class="form-control" v-model="wishFolder" id="wishFolder"
                                    v-on:change="addWishItem(item)">
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
                                    v-on:change="addCartItem(item)">
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
                    <td>
                        <a id="deleteItem" href="#" @click.prevent="deleteItem(item)">
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
    import { Session } from 'meteor/session';
    import { mcMessage } from '/imports/lib/locales/getMessage';
    import { validateProduct, validateTrade, validateWish, validateCart } from '/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    export default {
        name      : 'orderProductList',
        components: {},
        data() {
            return {
                mcLabel      : {},
                mcConstant   : {},
                isMessage    : false,
                pageMessage  : '',
                productItems : [],
                codeItems    : [],
                orderCatItems: [],
                locationItems: [],
                itemParams   : {},
                itemQuantity : 1,
                itemId       : '',
                currentItem  : '',
                wishFolder   : '',
                cartFolder   : '',
                isSave       : false,
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
            itemQuantities() {
                let qValue       = [];
                // return 1 to the maximum/available product quantities
                const startValue = 1;
                // TODO: get the least of maximum-allowed or available product quantities, from products
                const endValue   = 10; // maximum-allowed or available product quantities
                for( let i = startValue; i <= endValue; i++ ) {
                    qValue.push( i );
                }
                return qValue;
            },
        },
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
                            this.locationItems = this.$lo.sortBy( result.value, 'locationName' ).filter( ( item ) => {
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
                            this.codeItems   = this.$lo.sortBy( result.value, 'codeName' ).filter( ( item ) => {
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
                            this.langItems   = this.$lo.sortBy( result.value, 'langName' ).filter( ( item ) => {
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
            shortDesc( item ) {
                // set the short description for item.desc
                return this.$utils.shortString( item, this.$constant.getShortDesc() );
            },
            catName( itemId ) {
                const itemInfo = this.orderCatItems.find( ( item ) => {
                    return (item._id === itemId && item.catGroup === 'Product');
                } );
                return itemInfo ? itemInfo.catName : 'n/a';
            },
            itemCost( item ) {
                return `${item.productCurrency}${item.productCost}`;
            },
            itemLocation( itemLoc ) {
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
                this.$store.dispatch( 'central/setProductItem', item );
                // Route to detail page
                this.$router.push( { name: 'orderProductDetail' } );
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
            addWishItem( item ) {
                // Add to wish-list
                let currentWishId = '';
                let wish          = {
                    wishProduct    : item._id,
                    wishProductName: item.productName,
                    wishFolder     : this.wishFolder,
                    wishPriority   : 'Medium',
                    wishUrl        : '',
                    wishQuantity   : this.itemQuantity || 1,
                    wishPurchased  : 0,
                    wishDesc       : '',
                    wishOwner      : this.$store.getters[ 'central/getUserItem' ]._id,
                    isActive       : true,
                };

                // cast number items
                wish.wishQuantity  = Number( wish.wishQuantity );
                wish.wishPurchased = Number( wish.wishPurchased );

                // validate inputs
                let errors = validateWish( wish );
                if( errors.wishProduct || errors.wishProductName || errors.wishFolder || errors.wishPriority || errors.wishUrl || errors.wishQuantity || errors.wishDesc ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveWishItem', wish, currentWishId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage   = true;
                                const wishBox    = this.orderCatItems.find( ( item ) => {
                                    return (item._id === wish.wishFolder && item.catGroup === 'Wish');
                                } );
                                this.pageMessage = `${result.code}: ${result.value} |  ${wish.wishQuantity} of ${item.productName} added to ${wishBox.catName}`;
                            }
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = 'inputs-errors: ' + JSON.stringify( errors );
                    }
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Please login';
                }

            },
            addCartItem( item ) {
                // Add to cart
                let currentCartId = '';
                let cart          = {
                    tradeProduct    : item._id,
                    tradeProductName: item.productName,
                    tradeGroup      : 'B2C',
                    tradeFolder     : this.cartFolder,
                    tradeQuantity   : this.itemQuantity || 1,
                    tradeStatus     : 'CartTrade',
                    tradeOwner      : this.$store.getters[ 'central/getUserItem' ]._id,
                    tradeDesc       : '',
                    tradeShipping   : '',
                    tradePayment    : '',
                    isActive        : true,
                };

                // cast/format number parameters
                cart.tradeQuantity = Number( cart.tradeQuantity );

                // validate inputs
                let errors = validateTrade( cart );
                if( errors.tradeProduct || errors.tradeGroup || errors.tradeFolder || errors.tradeQuantity || errors.tradeStatus || errors.tradeOwner || errors.tradeDesc || errors.tradeShipping || errors.tradePayment ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveTradeItem', cart, currentCartId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage   = true;
                                const cartBox    = this.orderCatItems.find( ( item ) => {
                                    return (item._id === cart.tradeFolder && item.catGroup === 'Cart');
                                } );
                                this.pageMessage = `${result.code}: ${result.value} |  ${cart.tradeQuantity} of ${item.productName} added to ${cartBox.catName}`;
                            }
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = 'inputs-errors: ' + JSON.stringify( errors );
                    }
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Please login';
                }
            },
            bookItem( itemId ) {
                // TODO: bookmark item | add to favourites (browser)
                console.log( 'book item' );
                // Get/Set URL information for the current page
                this.$store.dispatch( 'central/setProductUrl', window.location.href + '/' + this.itemId );
                // Session.set( 'productUrl', window.location.href + '/' + this.itemId );
                // Go to send page and send the page URL to specified email address
                console.log( Session.get( 'productUrl' ) );
            },
            defaultCartFolder() {
                const cartName = this.mcConstant.getDefaultCart();
                const cartInfo = this.orderCatItems.find( ( item ) => {
                    return ( item.catName === cartName && item.catGroup === 'Wish');
                } );
                return cartInfo ? cartInfo._id : '';
            },
            defaultWishFolder() {
                const wishName = this.mcConstant.getDefaultWish();
                const wishInfo = this.orderCatItems.find( ( item ) => {
                    return ( item.catName === wishName && item.catGroup === 'Folder');
                } );
                return wishInfo ? wishInfo._id : '';
            },
        },
        created() {
            this.mcLabel    = this.$label;
            this.mcConstant = this.$constant;
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
