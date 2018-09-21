<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4 class="col-sm-10 w3-left"><i class="glyphicon glyphicon-th-list"/>
                {{mcLabel.shopCart}} :: {{ folderName( currentTradeFolder ) }}</h4>
            <span class="col-sm-2">
                <div class="form-group">
                        <!--<label for="currentFolder">{{mcLabel.select}} {{mcLabel.cart}}</label>-->
                        <select class="form-control" v-model="currentTradeFolder" id="currentFolder">
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.cart}}</option>
                            <option v-for="item in cartFolders" :value="item._id">{{item.catName}} </option>
                        </select>
                </div>
            </span>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <!--cart-details (products cost, shipping, tax etc.) | checkout-->
            <div class="w3-container">
                <!--<div class="col-sm-2">-->
                <!--<h4>Cart-folders</h4>-->
                <!--</div>-->
                <div class="col-sm-9">
                    <!--<h4>Cart: {{ folderName( currentTradeFolder ) }}</h4>-->
                    <div>
                        <table class="w3-table w3-striped w3-border w3-hoverable" id="mcOrderCartList">
                            <thead v-if="isCartItems">
                            <tr class="w3-red">
                                <th scope="col">{{mcLabel.image}}</th>
                                <th scope="col">{{mcLabel.product}}</th>
                                <th scope="col">{{mcLabel.cost}}</th>
                                <th scope="col">{{mcLabel.quantity}}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="item in currentCartItems" :key="item._id">
                                <td>product-image</td>
                                <td>
                                    <b>{{productName( item.tradeProduct )}}</b>
                                    <br>
                                    {{shortDesc( item.tradeDesc )}}
                                    <br>
                                    <a id="editItem" href="#" @click.prevent="viewItem(item)">{{mcLabel.detail}} <i
                                            class="glyphicon glyphicon-edit"/>
                                    </a>
                                    |
                                    <a id="deleteItem" href="#" @click.prevent="deleteItem(item)">
                                        {{mcLabel.delete}} <i class="glyphicon glyphicon-remove-circle"/>
                                    </a>
                                    <a id="saveForLater" href="#" @click.prevent="saveForLater(item)">
                                        {{mcLabel.saveForLater}} <i class="glyphicon glyphicon-save-file"/>
                                    </a>
                                </td>
                                <td>{{productCost( item.tradeProduct )}}</td>
                                <td>
                                    <div>
                                        <input type="number" name="itemQuantity" placeholder="Enter/Select City"
                                               v-model="item.tradeQuantity" id="itemQuantity"
                                               v-on:change="updateCartItem(item)" debounce="500">
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div v-if="isCartItems">
                            <h4>
                                {{mcLabel.subTotal}} ({{productCount}} {{tradeItemLabel}}): {{tradeCurrency}}{{tradeCostLabel}}
                            </h4>
                        </div>
                        <hr>
                    </div>
                    <div v-if="!isCartItems">
                        <h4>{{mcLabel.shopCart}} :: {{ folderName( currentTradeFolder ) }} is empty </h4>
                    </div>
                    <hr>
                    <div>
                        <h4 v-if="isSaveItems"><i class="glyphicon glyphicon-th-list"/>
                            {{mcLabel.saveForLater}} :: {{ folderName( currentTradeFolder ) }}
                        </h4>
                        <table class="w3-table w3-striped w3-border w3-hoverable" id="mcLaterList">
                            <thead v-if="isSaveItems">
                            <tr class="w3-red">
                                <th scope="col">{{mcLabel.image}}</th>
                                <th scope="col">{{mcLabel.product}}</th>
                                <th scope="col">{{mcLabel.cost}}</th>
                                <th scope="col">{{mcLabel.quantity}}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="item in savedCartItems" :key="item._id">
                                <td>product-image</td>
                                <td>
                                    <b>{{productName( item.tradeProduct )}}</b>
                                    <br>
                                    {{shortDesc( item.tradeDesc )}}
                                    <br>
                                    <a id="viewItem" href="#" @click.prevent="viewItem(item)">{{mcLabel.detail}} <i
                                            class="glyphicon glyphicon-edit"/>
                                    </a>
                                    |
                                    <a id="removeItem" href="#" @click.prevent="deleteItem(item)">
                                        {{mcLabel.delete}} <i class="glyphicon glyphicon-remove-circle"/>
                                    </a>
                                    |
                                    <a id="moveItem" href="#" @click.prevent="moveToCart(item)">
                                        {{mcLabel.moveToCart}} <i class="glyphicon glyphicon-open-file"/>
                                    </a>
                                </td>
                                <td>{{productCost( item.tradeProduct )}}</td>
                                <td>
                                    <div>
                                        <input type="number" name="itemQty" placeholder="Enter/Select City"
                                               v-model="item.tradeQuantity" id="itemQty"
                                               v-on:change="updateCartItem(item)" debounce="500">
                                    </div>
                                    <!--<input type="number" name="itemQuantity" list="quantities" placeholder="Enter/Select City" v-model="item.tradeQuantity" id="itemQuantity" v-on:change="updateCartItem(item)" debounce="500">-->
                                    <!--<datalist id="quantities">-->
                                    <!--<option v-for="quantity in itemQuantities" :value="quantity" :key="quantity"></option>-->
                                    <!--</datalist>-->
                                    <!--<select class="form-control" v-model="item.tradeQuantity" id="itemQuantity"-->
                                    <!--v-on:change="updateCartItem(item)">-->
                                    <!--<option disabled value="">{{mcLabel.select}} {{mcLabel.quantity}}</option>-->
                                    <!--<option v-for="quantity in itemQuantities"-->
                                    <!--:value="quantity">{{quantity}}-->
                                    <!--</option>-->
                                    <!--</select>-->
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <hr>
                    </div>
                </div>
                <div class="col-sm-3">
                    <div>
                        <h5>
                            {{mcLabel.subTotal}} ({{productCount}} {{tradeItemLabel}}): {{tradeCurrency}}{{tradeCostLabel}}
                        </h5>
                    </div>
                    <hr>
                    <div>
                        <button class="btn btn-primary" @click.prevent="shipEstimate">
                            {{mcLabel.shipEstimate}}
                        </button>
                    </div>
                    <hr>
                    <div v-if="isShipEstimate">
                        <div class="form-group">
                            <!--<label for="tradeShip">{{mcLabel.select}} {{mcLabel.cart}}</label>-->
                            <select class="form-control" v-model="tradeAddress" id="tradeAddress">
                                <option disabled value="">
                                    {{mcLabel.select}} {{mcLabel.shipToAddress}}
                                </option>
                                <option v-for="item in shipAddresses" :value="item">
                                    {{locationName( item )}}
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <!--<label for="tradeShip">{{mcLabel.select}} {{mcLabel.cart}}</label>-->
                            <select class="form-control" v-model="tradeShip" id="tradeShip"
                                    v-on:change="calculateShipCost">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.ship}}</option>
                                <option v-for="item in shipOptions" :value="item._id">
                                    {{item.catName}}
                                </option>
                            </select>
                        </div>
                        <span v-if="tradeShipDesc">{{shipDelivery( tradeShipDuration )}} ({{tradeShipDesc}})</span>
                        <div>
                            <h5>{{mcLabel.orderSummary}}</h5>
                            <div class="form-group">
                                <label for="discountCode">{{mcLabel.discount}} {{mcLabel.code}}</label>
                                <input type="text" class="form-control" id="discountCode"
                                       :placeholder="mcLabel.code" maxlength="32"
                                       v-model="discountCode" required>
                                <button class="btn btn-primary" @click.prevent="applyDiscount">
                                    {{mcLabel.applyDiscount}}
                                </button>

                            </div>
                            <span class="col-sm-8"><b>{{mcLabel.subTotal}} ({{productCount}} {{tradeItemLabel}}):</b></span>
                            <span class="col-sm-4"><b>{{tradeCurrency}}{{tradeCostLabel}}</b></span>
                            <br>
                            <span class="col-sm-8">{{mcLabel.shipEst}}:</span>
                            <span class="col-sm-4">{{tradeCurrency}}{{tradeShipCostLabel}}</span>
                            <br>
                            <span class="col-sm-8">{{mcLabel.shipTax}}:</span>
                            <span class="col-sm-4">{{tradeCurrency}}{{tradeShipCostTaxLabel}}</span>
                            <br>
                            <span class="col-sm-8">{{tradeItemLabel}} Tax:</span>
                            <span class="col-sm-4">{{tradeCurrency}}{{tradeCostTaxLabel}}</span>
                            <br>
                            <span class="col-sm-8">Order before Tax:</span>
                            <span class="col-sm-4">{{tradeCurrency}}{{tradeTotalCostLabel}}</span>
                            <br>
                            <span class="col-sm-8">{{mcLabel.orderTax}} ({{tradeTaxName}}):</span>
                            <span class="col-sm-4">{{tradeCurrency}}{{tradeTotalCostTaxLabel}}</span>
                            <br>
                            <span v-if="discountAmount" class="col-sm-8">{{mcLabel.orderSaving}}:</span>
                            <span v-if="discountAmount" class="col-sm-4">{{tradeCurrency}}{{formatCost( discountAmount )}}</span>
                            <br>
                            <span class="col-sm-8"><b>{{mcLabel.orderTotalTax}}:</b></span>
                            <span class="col-sm-4"><b>{{tradeCurrency}}{{tradeCostTotalPlusTaxLabel}}</b></span>
                            <br>
                        </div>
                    </div>
                    <hr>
                    <div>
                        <button class="btn btn-primary" @click.prevent="payEstimate">
                            {{mcLabel.tradePay}}
                        </button>
                    </div>
                    <div v-if="isPayment">
                        <div class="form-group">
                            <select class="form-control" v-model="tradePay" id="tradePay">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.orderPay}}</option>
                                <option v-for="item in payOptions" :value="item.catName">
                                    {{item.catName}}
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <select class="form-control" v-model="tradePayAddress" id="tradePayAddress">
                                <option disabled value="">
                                    {{mcLabel.select}} {{mcLabel.payAddress}}
                                </option>
                                <option v-for="item in payAddresses" :value="item">
                                    {{locationName( item )}}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div v-if="isShipEstimate && isPayment">
                        <button class="btn btn-primary" @click.prevent="cartCheckout">
                            {{mcLabel.checkout}}
                        </button>
                    </div>
                    <hr>
                    <div>
                        <h5>{{mcLabel.adverts}}</h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>

</style>
<script>
    import { Meteor } from 'meteor/meteor';
    import { mcMessage } from '/imports/lib/locales/getMessage';
    import { validateTrade } from '/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    const moment    = require( 'moment' );
    const randomize = require( 'randomatic' );
    const numFormat = require( 'numeral' );

    export default {
        name      : 'cartView',
        components: {},
        data() {
            return {
                mcLabel                   : '',
                isMessage                 : false,
                pageMessage               : '',
                cartItems                 : [],
                productItems              : [],
                orderCatItems             : [],
                locationItems             : [],
                addressItems              : [],
                shipCosts                 : [],
                taxItems                  : [],
                discountItems             : [],
                itemParams                : {},
                defaultFolder             : '',
                currentTradeFolder        : '',
                itemId                    : '',
                currentItem               : '',
                currentItemQty            : 0,
                tradeCurrency             : 'US$',
                tradeItemLabel            : 'Item',
                tradeAddress              : '',
                tradeShip                 : '',
                tradePay                  : '',
                tradePayAddress           : '',
                tradeTaxName              : '',
                productCount              : 1,
                tradeCost                 : 0.00,
                tradeCostTax              : 0.00,
                tradeShipCost             : 0.00,
                tradeShipCostTax          : 0.00,
                tradeTotalCost            : 0.00,
                tradeTotalCostTax         : 0.00,
                tradeCostTotalPlusTax     : 0.00,
                tradeCostLabel            : '',
                tradeCostTaxLabel         : '',
                tradeShipCostLabel        : '',
                tradeShipCostTaxLabel     : '',
                tradeTotalCostLabel       : '',
                tradeTotalCostTaxLabel    : '',
                tradeCostTotalPlusTaxLabel: '',
                tradeShipDesc             : '',
                tradeShipDuration         : '',
                taxInfo                   : {
                    taxAmount: 0.00,
                    taxUnit  : '%',
                },
                discountCode              : '',
                discountAmount            : 0,
                discountBeforeTax         : true,
                discountAfterTax          : false,
                isShipEstimate            : false,
                isPayment                 : false,
                isCheckout                : false,
                isCartItems               : false,
                isSaveItems               : false,
                isAdmin                   : false,
                isSave                    : false,
            }
        },
        computed  : {
            wishFolders() {
                return this.orderCatItems.filter( ( item ) => {
                    return ( item.catGroup === 'Wish');
                } );
            },
            cartFolders() {
                return this.orderCatItems.filter( ( item ) => {
                    return ( item.catGroup === 'Cart' );
                } );
            },
            itemQuantities() {
                // TODO: determine current item/product-ID
                const prodId     = this.itemId || '';
                let qValue       = [];
                // return 1 to the maximum/available product quantities
                const startValue = 1;   // minimum-allowed for display / select-list
                let endValue     = 10; // maximum-allowed for display / select-list
                // get the available product quantities, from products
                let qtyAvailable = 0;
                const prodInfo   = this.productItems.find( ( item ) => {
                    return item._id === prodId;
                } );
                if( prodInfo ) {
                    qtyAvailable        = prodInfo.productQuantityTotal - prodInfo.productSold;
                    this.currentItemQty = qtyAvailable;
                }
                // limit select-list to the qtyAvailable if qtyAvailable is less than endValue
                if( qtyAvailable > 0 && qtyAvailable < endValue ) {
                    endValue = qtyAvailable;
                }

                endValue = 10;

                for( let i = startValue; i <= endValue; i++ ) {
                    qValue.push( i );
                }
                return qValue;
            },
            savedCartItems() {
                const defaultFolder = this.currentTradeFolder;
                if( defaultFolder ) {
                    // cart-items (save-for-later)
                    const laterItems = this.cartItems.filter( ( item ) => {
                        return ( item.tradeFolder === defaultFolder && item.tradeStatus === 'CartTrade' && item.isActive === false);
                    } );
                    if( laterItems.length >= 1 ) {
                        this.isSaveItems = true;
                        return laterItems;
                    } else {
                        this.isSaveItems = false;
                        return [];
                    }
                }

            },
            currentCartItems() {
                const defaultFolder = this.currentTradeFolder;
                if( defaultFolder ) {
                    // determine cart-items
                    const cartItems = this.cartItems.filter( ( item ) => {
                        return ( item.tradeFolder === defaultFolder && item.tradeStatus === 'CartTrade' && item.isActive === true);
                    } );
                    // set label / count / cost / shipping information for the cart-item(s)
                    // item-label
                    if( cartItems.length > 1 ) {
                        this.tradeItemLabel = 'Items';
                    } else {
                        this.tradeItemLabel = 'Item';
                    }
                    // cart-items-count
                    this.productCount = cartItems.length;
                    // cart-items-cost
                    let itemTotalCost = 0;

                    cartItems.forEach( ( prod ) => {
                        const productItem = this.productItems.find( ( item ) => {
                            return item._id === prod.tradeProduct;
                        } );

                        if( productItem ) {
                            itemTotalCost = itemTotalCost + (productItem.productCost * prod.tradeQuantity);
                        }
                    } );

                    this.tradeCost = itemTotalCost;
                    // apply discount, beforeTax:
                    if( this.discountBeforeTax ) {
                        this.tradeCost -= this.discountAmount;
                    }

                    // format number/currency
                    // this.tradeTotalCost = Number( itemTotalCost.toFixed( 2 ) ).toLocaleString();
                    this.tradeCostLabel      = numFormat( itemTotalCost ).format( '0,0.00' );
                    this.tradeTotalCost      = this.tradeCost + this.tradeShipCost;
                    this.tradeTotalCostLabel = numFormat( this.tradeTotalCost ).format( '0,0.00' );

                    // post-taxes cost / cost-labels
                    this.tradeShipCostTax  = this.calculateTax( this.tradeShipCost );
                    this.tradeCostTax      = this.calculateTax( this.tradeCost );
                    this.tradeTotalCostTax = this.tradeCostTax + this.tradeShipCostTax;
                    // apply discount, afterTax:
                    if( this.discountAfterTax ) {
                        this.tradeCostTotalPlusTax = this.tradeTotalCost + this.tradeTotalCostTax - this.discountAmount;
                    } else {
                        this.tradeCostTotalPlusTax = this.tradeTotalCost + this.tradeTotalCostTax;
                    }
                    // cost labels
                    this.tradeShipCostLabel         = numFormat( this.tradeShipCost ).format( '0,0.00' );
                    this.tradeShipCostTaxLabel      = numFormat( this.tradeShipCostTax ).format( '0,0.00' );
                    this.tradeCostTaxLabel          = numFormat( this.tradeCostTax ).format( '0,0.00' );
                    this.tradeTotalCostTaxLabel     = numFormat( this.tradeTotalCostTax ).format( '0,0.00' );
                    this.tradeCostTotalPlusTaxLabel = numFormat( this.tradeCostTotalPlusTax ).format( '0,0.00' );

                    // return cart-items list / check cartItems
                    if( cartItems.length >= 1 ) {
                        this.isCartItems = true;
                        return cartItems;
                    } else {
                        this.isCartItems = false;
                        return [];
                    }
                }
            },
            shipOptions() {
                // determine ship options for the cart-items (order-based shipping)
                // select order-ship: free, standard, expedited and express
                return this.orderCatItems.filter( ( item ) => {
                    return ( item.catGroup === 'Shipping Type' );
                } );
            },
            shipAddresses() {
                // get shipping addresses for the current user (buyer)
                return this.addressItems.filter( ( item ) => {
                    return ( item.addressType === 'Shipping' || item.addressType === 'Payment' );
                } );
            },
            payOptions() {
                // determine ship options for the cart-items (order-based shipping)
                // select order-ship: free, standard, expedited and express
                return this.orderCatItems.filter( ( item ) => {
                    return ( item.catGroup === 'Payment Type' );
                } );
            },
            payAddresses() {
                // get shipping addresses for the current user (buyer)
                return this.addressItems.filter( ( item ) => {
                    return ( item.addressType === 'Payment' || item.addressType === 'Shipping' );
                } );
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
                    // order categories
                    Meteor.call( 'getOrderCat', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'OrderCategoryError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage     = false;
                            this.pageMessage   = 'Items available';
                            this.orderCatItems = this.$lo.sortBy( result.value, 'catName' ).filter( ( item ) => {
                                return item.isActive === true;
                            } );
                            // Default cart folder ID:
                            const folder       = result.value.find( ( item ) => {
                                return (item.catName === 'Cart' && item.catGroup === 'Cart');
                            } );
                            // get current cart-folder:
                            if( !this.currentTradeFolder ) {
                                this.currentTradeFolder = localStorage.getItem('mcCurrentCartFolder') || folder._id;
                            }
                            // reset the cart-folder localStorage
                            localStorage.setItem( 'mcCurrentCartFolder', '' );
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                    // providers
                    Meteor.call( 'getTrade', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'TradeError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.cartItems   = this.$lo.sortBy( result.value, 'tradeGroup' ).filter( ( item ) => {
                                return item.tradeStatus === 'CartTrade';
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
                    // discounts
                    Meteor.call( 'getDiscount', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'DiscountError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage     = false;
                            this.pageMessage   = 'Items available';
                            this.discountItems = this.$lo.sortBy( result.value, 'product' ).filter( ( item ) => {
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
                    // taxes
                    Meteor.call( 'getTax', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'TaxError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.taxItems    = this.$lo.sortBy( result.value, 'taxName' ).filter( ( item ) => {
                                return item.isActive === true;
                            } );
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                    // addresses
                    Meteor.call( 'getAddress', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'AddressError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage    = false;
                            this.pageMessage  = 'Items available';
                            this.addressItems = this.$lo.sortBy( result.value, 'addressType' ).filter( ( item ) => {
                                return item.isActive === true;
                            } );
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                    // shipping costs
                    Meteor.call( 'getShipCost', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'ShipCostError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.shipCosts   = this.$lo.sortBy( result.value, 'shipName' ).filter( ( item ) => {
                                return item.isActive === true;
                            } );
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
            dateInfo( longDate ) {
                return moment( longDate ).format( "YYYY-MMM-DD" );
            },
            shortDesc( item ) {
                // set the short description for item.desc
                return this.$utils.shortString( item, this.$constant.getShortDesc() );
            },
            locationName( itemLoc ) {
                const country = this.locationItems.find( ( item ) => {
                    return item._id === itemLoc.addressCountry;
                } );
                const state   = this.locationItems.find( ( item ) => {
                    return item._id === itemLoc.addressState;
                } );
                return `${itemLoc.contactName} | ${itemLoc.streetNumber} ${itemLoc.streetName}, ${itemLoc.addressCity}, ${state.locationName}, ${itemLoc.postalCode} ${country.locationName}`;
            },
            productName( itemId ) {
                const product = this.productItems.find( ( item ) => {
                    return item._id === itemId;
                } );
                return product ? product.productName : 'n/a';
            },
            shipDelivery( day ) {
                if( day > 1 ) {
                    return `${day} Days`;
                } else {
                    return `${day} Day`;
                }
            },
            shipEstimate() {
                this.isShipEstimate = !this.isShipEstimate;
            },
            calculateShipCost() {
                // validate address selection
                if( !this.tradeAddress ) {
                    this.isMessage   = true;
                    this.pageMessage = 'Address is required';
                } else {
                    this.isMessage = false;
                }
                // set default billing address to shipping address:
                this.tradePayAddress = this.tradeAddress;
                // get / set the shipAddress,  shipMethod & currentCartItems to determine shipping cost
                const shipAddress    = this.tradeAddress, // {}
                      shipMethod     = this.tradeShip; // id
                // determine cart-items
                const defaultFolder = this.currentTradeFolder;
                const cartItems     = this.cartItems.filter( ( item ) => {
                    return ( item.tradeFolder === defaultFolder && item.isActive === true);
                } ) || this.currentCartItems;

                // get the ID for the 'All Items' shipping category, e.g. for shipType/Method Pickup
                const catInfo = this.orderCatItems.find( ( item ) => {
                    return item.catName === 'All Items' && item.catGroup === 'Shipping';
                } );

                // For the cart-items, get shipping rates by shipMethod and shipAddress
                let shipCost = 0;
                // calculate shipping cost by items
                if( cartItems ) {
                    cartItems.forEach( ( item ) => {
                        // get shipCost information by item from shipCosts by shipMethod, shipCategory and (shipToCountry or shipToCountry/ shipToState or shipToCountry/shipToState/shipToCity or shipToCountry/shipToState/shipToCity/shipToPostalCode)
                        const prodShipCat = this.productItems.find( ( prod ) => {
                            return prod._id === item.tradeProduct;
                        } );
                        const itemShip    = this.shipCosts.find( ( item ) => {
                            return (item.shipType === shipMethod
                                    && (item.shipCat === prodShipCat.productShip || item.shipCat === catInfo._id)
                                    && (
                                        (item.shipToCountry === shipAddress.addressCountry && item.shipToState === shipAddress.addressState && item.shipToCity === shipAddress.addressCity && item.shipToPostalCode === shipAddress.postalCode )
                                        || (item.shipToCountry === shipAddress.addressCountry && item.shipToState === shipAddress.addressState && item.shipToCity === shipAddress.addressCity )
                                        || (item.shipToCountry === shipAddress.addressCountry && item.shipToState === shipAddress.addressState)
                                        || (item.shipToCountry === shipAddress.addressCountry)
                                    )
                            );
                        } );
                        // itemShipCost = fixedCost + unitCost * quantity
                        if( itemShip && itemShip.shipFixedCost < 0.01 ) {
                            itemShip.shipFixedCost = 0.00;
                        }
                        if( itemShip && itemShip.shipCost < 0.01 ) {
                            itemShip.shipCost = 0.00;
                        }
                        let itemShipCost = 0.00;
                        if( itemShip ) {
                            itemShipCost           = itemShip.shipFixedCost + (itemShip.shipCost * item.tradeQuantity);
                            this.tradeShipDesc     = itemShip.shipDesc;
                            this.tradeShipDuration = itemShip.shipDuration;
                            shipCost               = shipCost + itemShipCost;
                        }
                    } );
                }

                // apply discount,beforeTax (via compute only):
                /*if (this.discountBeforeTax) {
                    this.tradeCost -= this.discountAmount;
                }*/

                // pre-taxes cost / cost-labels
                this.tradeShipCost       = shipCost;
                this.tradeShipCostLabel  = numFormat( shipCost ).format( '0,0.00' );
                this.tradeTotalCost      = this.tradeCost + this.tradeShipCost;
                this.tradeTotalCostLabel = numFormat( this.tradeTotalCost ).format( '0,0.00' );

                // post-taxes cost / cost-labels
                this.tradeShipCostTax           = this.calculateTax( this.tradeShipCost );
                this.tradeCostTax               = this.calculateTax( this.tradeCost );
                this.tradeTotalCostTax          = this.tradeCostTax + this.tradeShipCostTax;
                // account for discountAmount, if applicable, after tax (via compute only)
                this.tradeCostTotalPlusTax      = this.tradeTotalCost + this.tradeTotalCostTax;
                // cost labels
                this.tradeShipCostLabel         = numFormat( this.tradeShipCost ).format( '0,0.00' );
                this.tradeShipCostTaxLabel      = numFormat( this.tradeShipCostTax ).format( '0,0.00' );
                this.tradeCostTaxLabel          = numFormat( this.tradeCostTax ).format( '0,0.00' );
                this.tradeTotalCostTaxLabel     = numFormat( this.tradeTotalCostTax ).format( '0,0.00' );
                this.tradeCostTotalPlusTaxLabel = numFormat( this.tradeCostTotalPlusTax ).format( '0,0.00' );

                // optional return value
                return shipCost;
            },
            calculateTax( amountToTax ) {
                // set tax rate
                let taxRate   = 10.00, // e.g. 10% tax
                    taxUnit   = '%',
                    amountTax = 0.00;

                // determine pre-set tax rates by buyer's/shipTo address/taxLocation, taxiJuri (State*) and taxCat (Sales*), productTax?, productTaxExempt?
                // TODO: settings, include the taxiJuri for the seller (default: 'State')
                const taxJuri        = 'State',
                      shipToLocation = this.tradeAddress.addressState;

                // determine taxName and taxRate (%*, fixed, range) by taxLocation = ShipToLocation, taxiJuri = 'State' or as set/defined
                //
                const taxInfo = this.taxItems.find( ( item ) => {
                    return item.taxJuri === taxJuri && item.taxLocation === shipToLocation && item.taxCat === 'Sales Tax';
                } );

                // Sales tax
                if( taxInfo ) {
                    this.tradeTaxName = taxInfo.taxName;
                    taxRate           = taxInfo.taxAmount;
                    taxUnit           = taxInfo.taxUnit;

                    if( taxUnit === '%' ) {
                        amountTax = amountToTax * taxRate / 100;
                    }
                    if( taxUnit === '#' ) {
                        amountTax = taxRate;
                    }
                }

                // set tax-info
                this.taxInfo.taxAmount = taxRate;
                this.taxInfo.taxUnit   = taxUnit;

                // Return amountTax
                return amountTax;

                // TODO: Income tax : range => range1Max * taxRate1 (or rangeTaxAmount1) + (range2Max-range1Max) * taxRate2 (or rangeTaxAmount2)... + (rangeNMax-range(N-1)Max) * taxRateN (or rangeTaxAmountN)

                // TODO: Business tax

            },
            payEstimate() {
                this.isPayment = !this.isPayment;
            },
            productCost( itemId ) {
                const product = this.productItems.find( ( item ) => {
                    return item._id === itemId;
                } );
                return product ? `$${product.productCost} [${product.productCurrency}]` : 'n/a';
            },
            formatCost( value ) {
                return numFormat( value ).format( '0,0.00' );
            },
            applyDiscount() {
                // apply discount to order
                if( this.discountCode ) {
                    const discount = this.discountItems.find( ( item ) => {
                        return (item.code === this.discountCode);
                    } );
                    // validate discount: startDate <= currentDate and endDate >= currentDate
                    if( discount && discount.startDate > new Date() ) {
                        this.isMessage   = true;
                        this.pageMessage = `Discount startDate is in the future (${this.dateInfo( discount.startDate )})`;
                        return;
                    }
                    if( discount && discount.endDate < new Date() ) {
                        this.isMessage   = true;
                        this.pageMessage = `Discount code has expired [from ${this.dateInfo( discount.startDate )} to ${this.dateInfo( discount.endDate )}]`;
                        return;
                    }
                    if( discount && discount.startDate < new Date() && discount.endDate < new Date() ) {
                        this.isMessage   = true;
                        this.pageMessage = `Discount code has expired [from ${this.dateInfo( discount.startDate )} to ${this.dateInfo( discount.endDate )}]`;
                        return;
                    }

                    if( discount && discount.beforeTax ) {
                        // before-tax discount
                        this.discountBeforeTax = true;
                        this.discountAfterTax  = false;

                        if( discount.unit === '%' ) {
                            this.discountAmount = this.tradeCost * discount.amount / 100;
                            // this.tradeCostTotalPlusTax -= this.discountAmount;
                            // this.tradeCostTotalPlusTaxLabel = numFormat( this.tradeCostTotalPlusTax ).format( '0,0.00' );
                        }
                        if( discount.unit === '#' ) {
                            this.discountAmount = discount.amount;
                        }
                    } else if( discount && discount.afterTax ) {
                        // after-tax discount
                        this.discountBeforeTax = false;
                        this.discountAfterTax  = true;
                        if( discount.unit === '%' ) {
                            this.discountAmount = (this.tradeCost + this.tradeCostTax ) * discount.amount / 100;
                            // this.tradeCostTotalPlusTax -= this.discountAmount;
                            // this.tradeCostTotalPlusTaxLabel = numFormat( this.tradeCostTotalPlusTax ).format( '0,0.00' );
                        }
                        if( discount.unit === '#' ) {
                            this.discountAmount = discount.amount;
                        }
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = "No discount available for this discount-code";
                    }
                } else {
                    this.isMessage   = true;
                    this.pageMessage = "A valid discount-code is required";
                }
            },
            folderName( itemId ) {
                const folder = this.orderCatItems.find( ( item ) => {
                    return item._id === itemId;
                } );
                return folder ? folder.catName : 'n/a';
            },
            updateCartItem( item ) {
                // check the new-quantity < available-quantity
                const prodInfo = this.productItems.find( ( prod ) => {
                    return prod._id === item.tradeProduct;
                } );

                let qtyAvailable = prodInfo.productQuantityTotal - prodInfo.productSold;
                // avoid negative value
                if( qtyAvailable < 0 ) {
                    qtyAvailable = 0;
                }

                if( qtyAvailable < item.tradeQuantity ) {
                    this.isMessage   = true;
                    this.pageMessage = `Required product quantity may not be greater than the available product quantity(${qtyAvailable})`;
                    return;
                }
                // Add to cart
                let currentCartId = item._id;
                let cart          = {
                    tradeProduct : item.tradeProduct,
                    tradeGroup   : item.tradeGroup || 'B2C',
                    tradeFolder  : item.tradeFolder,
                    tradeQuantity: item.tradeQuantity || 1,
                    tradeStatus  : item.tradeStatus || 'CartTrade',
                    tradeOwner   : item.tradeOwner || this.$store.getters[ 'central/getCurrentUser' ]._id,
                    tradeDesc    : item.tradeDesc || '',
                    tradeShipping: item.tradeShipping || '',
                    tradePayment : item.tradePayment || '',
                    isActive     : item.isActive,
                };

                // capture currentCartFolder for page reload (use localStorage)
                localStorage.setItem( 'mcCurrentCartFolder', item.tradeFolder );

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
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveTradeItem', cart, currentCartId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage    = true;
                                const cartBox     = this.orderCatItems.find( ( item ) => {
                                    return (item._id === cart.tradeFolder && item.catGroup === 'Cart');
                                } );
                                const productName = this.productName( cart.tradeProduct );
                                this.pageMessage  = `${result.code}: ${result.value} |  ${cart.tradeQuantity} of ${productName} added to ${cartBox.catName}`;
                                // refresh page
                                location.reload();
                            }
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = 'inputs-errors: ' + errors;
                    }
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Please login';
                }
            },
            saveForLater( item ) {
                // save-for-later: change isActive to false
                let currentCartId  = item._id;
                let cart           = {
                    tradeProduct    : item.tradeProduct,
                    tradeProductName: this.productName( item.tradeProduct ),
                    tradeGroup      : item.tradeGroup || 'B2C',
                    tradeFolder     : item.tradeFolder,
                    tradeQuantity   : item.tradeQuantity || 1,
                    tradeStatus     : item.tradeStatus || 'CartTrade',
                    tradeOwner      : item.tradeOwner || this.$store.getters[ 'central/getCurrentUser' ]._id,
                    tradeDesc       : item.tradeDesc || '',
                    tradeShipping   : item.tradeShipping || '',
                    tradePayment    : item.tradePayment || '',
                    isActive        : false,           // Change factor
                };
                // cast/format number parameters
                cart.tradeQuantity = Number( cart.tradeQuantity );

                // capture currentCartFolder for page reload (use localStorage)
                localStorage.setItem( 'mcCurrentCartFolder', item.tradeFolder );

                // validate inputs
                let errors = validateTrade( cart );
                if( errors.tradeProduct || errors.tradeGroup || errors.tradeFolder || errors.tradeQuantity || errors.tradeStatus || errors.tradeOwner || errors.tradeDesc || errors.tradeShipping || errors.tradePayment ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveTradeItem', cart, currentCartId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage    = true;
                                const cartBox     = this.orderCatItems.find( ( item ) => {
                                    return (item._id === cart.tradeFolder && item.catGroup === 'Cart');
                                } );
                                const productName = this.productName( cart.tradeProduct );
                                this.pageMessage  = `${result.code}: ${result.value} | ${cart.tradeQuantity} of ${productName} ${this.mcLabel.savedForLater}`;
                                // refresh page
                                location.reload();
                            }
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = 'inputs-errors: ' + errors;
                    }
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Please login';
                }
            },
            moveToCart( item ) {
                // Add to cart
                let currentCartId = item._id;
                let cart          = {
                    tradeProduct    : item.tradeProduct,
                    tradeProductName: this.productName( item.tradeProduct ),
                    tradeGroup      : item.tradeGroup || 'B2C',
                    tradeFolder     : item.tradeFolder,
                    tradeQuantity   : item.tradeQuantity || 1,
                    tradeStatus     : item.tradeStatus || 'CartTrade',
                    tradeOwner      : item.tradeOwner || this.$store.getters[ 'central/getCurrentUser' ]._id,
                    tradeDesc       : item.tradeDesc || '',
                    tradeShipping   : item.tradeShipping || '',
                    tradePayment    : item.tradePayment || '',
                    isActive        : true,                // Change factor
                };

                // cast/format number parameters
                cart.tradeQuantity = Number( cart.tradeQuantity );

                // capture currentCartFolder for page reload (use localStorage)
                localStorage.setItem( 'mcCurrentCartFolder', item.tradeFolder );

                // validate inputs
                let errors = validateTrade( cart );
                if( errors.tradeProduct || errors.tradeGroup || errors.tradeFolder || errors.tradeQuantity || errors.tradeStatus || errors.tradeOwner || errors.tradeDesc || errors.tradeShipping || errors.tradePayment ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveTradeItem', cart, currentCartId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage    = true;
                                const cartBox     = this.orderCatItems.find( ( item ) => {
                                    return (item._id === cart.tradeFolder && item.catGroup === 'Cart');
                                } );
                                const productName = this.productName( cart.tradeProduct );
                                this.pageMessage  = `${result.code}: ${result.value} | ${cart.tradeQuantity} of ${productName} ${this.mcLabel.movedToCart}`;
                                // refresh page
                                location.reload();
                            }
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = 'inputs-errors: ' + errors;
                    }
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Please login';
                }
            },
            viewItem( item ) {
                // Set current product-item
                const productItem = this.productItems.find( ( prod ) => {
                    return prod._id === item.tradeProduct;
                } );
                this.$store.dispatch( 'central/setProductItem', productItem );
                // Session.set( 'currentProductItem', item );
                // Route to detail page
                this.$router.push( { name: 'searchProductDetail' } );
            },
            cartCheckout() {
                // ensure tradeShip, tradePay, tradeAddress, tradePayAddress are valid (not empty)
                if( !this.tradePay ) {
                    this.isMessage   = true;
                    this.pageMessage = "Payment Method is Required";
                    return;
                }
                if( !this.tradeShip ) {
                    this.isMessage   = true;
                    this.pageMessage = "Shipping Method is Required";
                    return;
                }
                if( _.isEmpty( this.tradeAddress ) ) {
                    this.isMessage   = true;
                    this.pageMessage = "Shipping Address is Required";
                    return;
                }
                if( _.isEmpty( this.tradePayAddress ) ) {
                    this.isMessage   = true;
                    this.pageMessage = "Payment/Billing Address is Required";
                    return;
                }
                // capture inputs for payment/order processing: trade-folder/items, trade-parameters(address, ship, pay etc.), determine cart-items
                const defaultFolder = this.currentTradeFolder;
                const cartItems     = this.cartItems.filter( ( item ) => {
                    return ( item.tradeFolder === defaultFolder && item.isActive === true);
                } ) || this.currentCartItems;

                // trade-parameters
                const tradeParams = {
                    tradeCurrency             : this.tradeCurrency,
                    tradeItemLabel            : this.tradeItemLabel,
                    tradeAddress              : this.tradeAddress,
                    tradeShip                 : this.tradeShip,
                    tradePay                  : this.tradePay,
                    tradePayAddress           : this.tradePayAddress,
                    tradeTaxName              : this.tradeTaxName,
                    productCount              : this.productCount,
                    tradeCost                 : this.tradeCost,
                    tradeCostTax              : this.tradeCostTax,
                    tradeShipCost             : this.tradeShipCost,
                    tradeShipCostTax          : this.tradeShipCostTax,
                    tradeTotalCost            : this.tradeTotalCost,
                    tradeTotalCostTax         : this.tradeTotalCostTax,
                    tradeCostTotalPlusTax     : this.tradeCostTotalPlusTax,
                    tradeCostLabel            : this.tradeCostLabel,
                    tradeCostTaxLabel         : this.tradeCostTaxLabel,
                    tradeShipCostLabel        : this.tradeShipCostLabel,
                    tradeShipCostTaxLabel     : this.tradeShipCostTaxLabel,
                    tradeTotalCostLabel       : this.tradeTotalCostLabel,
                    tradeTotalCostTaxLabel    : this.tradeTotalCostTaxLabel,
                    tradeCostTotalPlusTaxLabel: this.tradeCostTotalPlusTaxLabel,
                    tradeShipDesc             : this.tradeShipDesc,
                    tradeTax                  : this.taxInfo,
                    tradeDiscount             : this.discountCode,
                };

                // capture params for order processing
                this.$store.dispatch( 'central/setTradeFolder', { folder: defaultFolder } );
                this.$store.dispatch( 'central/setTradeItems', cartItems );
                this.$store.dispatch( 'central/setTradeParams', tradeParams );

                /*Session.set( {
                    tradeFolder: defaultFolder,
                    tradeItems : cartItems,
                    tradeParams: tradeParams,
                } );*/

                // process order by payment method (Cash, Credit Card, Debit, Invoice - Wire Transfer, Invoice, Pay On Delivery; Multiple?? etc.) | Active/Default: Credit-Debit Card only
                // route to order processing page: collect payment-info and process payment
                if( this.tradePay === 'Credit Card' || this.tradePay === 'Debit' ) {
                    this.$router.push( { name: 'orderCartCheckoutCredit' } );
                }
                if( this.tradePay === 'Cash' ) {
                    this.$router.push( { name: 'orderCartCheckoutCash' } );
                }
                if( this.tradePay === 'Wire Transfer' ) {
                    this.$router.push( { name: 'orderCartCheckoutInvoice' } );
                }
                if( this.tradePay === 'Cheque' ) {
                    this.$router.push( { name: 'orderCartCheckoutInvoice' } );
                }
                if( this.tradePay === 'Pay On Delivery' ) {
                    this.$router.push( { name: 'orderCartCheckoutInvoice' } );
                }
                if( this.tradePay === 'Invoice' ) {
                    this.$router.push( { name: 'orderCartCheckoutInvoice' } );
                }
                if( this.tradePay === 'Multiple' ) {
                    this.$router.push( { name: 'orderCartCheckoutMultiple' } );
                }
            },
            updateItem( item ) {
                // Set current item
                this.$store.dispatch( 'central/setCartItem', item );
                // Session.set( 'currentTradeCartItem', item );
                // Route to detail page
                this.$router.push( { name: 'orderCartDetail' } );
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
                        Meteor.call( 'removeTradeItem', itemId, userToken, ( error, result ) => {
                                if( error ) {
                                    this.isMessage   = true;
                                    this.pageMessage = `${error}: Error deleting item. Please retry`;
                                }
                                this.isMessage   = true;
                                this.pageMessage = `${result.code}: ${result.value}`;
                            }
                        );
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
            // Fetch items from the server, based on role assignment / authorization
            // Get current logged-in user's token, for resource access
            this.fetchData();
        },
    }
</script>
