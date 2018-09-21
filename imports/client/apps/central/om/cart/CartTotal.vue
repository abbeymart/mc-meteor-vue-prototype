<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-th-list"/> {{mcLabel.cartView}}</h4>
        </div>
        <div class="w3-container w3-margin-8">
            <div class="form-group w3-right">
                <button class="btn btn-primary" @click.prevent="processOrder">
                    {{mcLabel.checkout}}
                </button>
            </div>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <table class="w3-table w3-striped w3-border w3-hoverable" id="mcOrderCartList">
                <thead>
                <tr class="w3-red">
                    <th scope="col">{{mcLabel.productInfo}}</th>
                    <th scope="col">{{mcLabel.quantity}}</th>
                    <th scope="col">{{mcLabel.cost}}</th>
                    <th scope="col">{{mcLabel.desc}}</th>
                    <th scope="col">{{mcLabel.update}}</th>
                    <th scope="col">{{mcLabel.delete}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in cartItems" :key="item._id">
                    <td>{{productName(item.tradeProduct)}}</td>
                    <td> {{item.tradeQuantity}}
                         <!--<input type="number" class="form-control" id="tradeQty"-->
                         <!--:placeholder="mcLabel.quantity" maxlength="12" v-on:change="updateItem(item)"-->
                         <!--v-model="currentQty" :value="item.tradeQuantity" required>-->
                    </td>
                    <td>{{productCost(item.tradeProduct)}}</td>
                    <td>{{shortDesc(item.tradeDesc)}}</td>
                    <td>
                        <a id="editItem" href="#" @click.prevent="updateItem(item)">{{mcLabel.update}}
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
        <hr>
        <!--TODO: Cart (pre-order) summary-->
        <div class="w3-container w3-lightgrey">
            <div class="row">
                <div class="col-sm-6"></div>
                <div class="col-sm-6">
                    <label for="shipMethod">{{mcLabel.shipMethod}}</label>
                    <div class="col-sm-6 w3-right w3-lightgrey">
                        <select class="form-control" v-model="shipMethod" id="shipMethod" v-on:change="shipPrice">
                            <option v-for="item in shipCostItems" :value="item._id">
                                {{ shipInfo(item)}}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="col-sm-6"></div>
                <div class="col-sm-3"><span><b>{{mcLabel.itemSubTotal}}(#)</b></span></div>
                <div class="col-sm-3"><span class="w3-right">$100</span></div>
            </div>
            <br>
            <div class="row">
                <div class="col-sm-6"></div>
                <div class="col-sm-3"><span>{{mcLabel.shipEst}}</span></div>
                <div class="col-sm-3"><span class="w3-right">$10.50</span></div>
            </div>
            <div class="row">
                <div class="col-sm-6"></div>
                <div class="col-sm-3"><span>{{mcLabel.beforeTax}}</span></div>
                <div class="col-sm-3"><span class="w3-right">$110.50</span></div>
            </div>
            <div class="row">
                <div class="col-sm-6"></div>
                <div class="col-sm-3"><span>{{mcLabel.taxEst}} [GST/HST]</span></div>
                <div class="col-sm-3"><span class="w3-right">$14.10</span></div>
            </div>
            <br>
            <div class="row">
                <div class="col-sm-6"></div>
                <div class="col-sm-3"><span><b>{{mcLabel.orderTotal}}</b></span></div>
                <div class="col-sm-3"><span class="w3-right">$124.60</span></div>
            </div>
            <hr>
            <div class="row">
                <div class="col-sm-6"></div>
                <div class="col-sm-6">
                    <label for="payMethod">{{mcLabel.payMethod}}</label>
                    <div class="col-sm-6 w3-right w3-lightgrey">
                        <select class="form-control" v-model="payMethod" id="payMethod">
                            <option v-for="item in payMethods" :value="item._id">
                                {{ item.codeName}}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <br>
            <div class="form-group w3-right">
                <button class="btn btn-primary" @click.prevent="processOrder">
                    {{mcLabel.checkout}}
                </button>
            </div>
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
    const randomize = require('randomatic');

    export default {
        name      : 'cartTotal',
        components: {},
        data() {
            return {
                mcLabel      : '',
                isMessage    : false,
                pageMessage  : '',
                cartItems    : [],
                codeItems    : [],
                productItems : [],
                shipCostItems: [],
                payItems     : [],
                addressItems : [],
                itemParams   : {},
                itemId       : '',
                currentItem  : '',
                currentQty   : '',
                shipMethod   : '',
                shipCountry  : '',
                shipState    : '',
                payMethod    : '',
                isAdmin      : false,
                isSave       : false,
                trade        : {
                    tradeProducts: [],
                    tradeFolder  : '1001',
                    tradeStatus  : 'OrderTrade',
                    tradeOwner   : '',
                    tradeDesc    : '',
                    tradeShipping: {
                        shipMethod : '',
                        shipAddress: {},
                    },
                    tradePayment : {
                        payMethod: '',
                        payInfo  : {},
                    },
                    tradeInfo    : {
                        tradeDate        : new Date(),
                        tradeDiscount    : 0,
                        tradeDiscountUnit: '%',
                        itemTotal        : 0,
                        shipTotal        : 0,
                        taxTotal         : 0,
                        itemShipTaxTotal : 0,
                    },
                    isActive     : true,
                },
            }
        },
        computed  : {
            shipMethods() {
                return this.codeItems.filter( ( item ) => {
                    return ( item.codeCat === 'Shipping' );
                } );
            },
            payMethods() {
                return this.codeItems.filter( ( item ) => {
                    return ( item.codeCat === 'Payment' );
                } );
            },
        },
        methods   : {
            shipInfo( item ){
                // TODO: calculate shipping cost/price to user location/shipping address (country/state), by cart-items and/or order || standard-charge and exceptions.
                const shipTotal = Number( item.shipCost ) + Number( item.shipFixedCost );
                return `${item.shipName} | $${shipTotal}[${item.shipCurrency}]`;
            },
            itemCount(){
                // Total item counts (quantities)

            },
            itemPrice(){
                // total price of the items in the cart, including discount, if applicable, excluding tax

            },
            shipPrice(){
                // shipping estimate based on the shipping method/destination

            },
            itemShipPrice(){
                // total price for all items including shipping, excluding tax

            },
            itemTax(){
                // taxes on taxable products

            },
            totalPriceTax(){
                // total for item(s) price, shipping and taxes: (itemShipPrice + itemTax)

            },

            shortDesc ( item ) {
                // set the short description for item.desc
                return this.$utils.shortString( item, this.$constant.getShortDesc() );
            },
            productName( itemId ) {
                const product = this.productItems.find( ( item ) => {
                    return item._id === itemId;
                } );
                return product ? product.productName : 'n/a';
            },
            productCost( itemId ) {
                const product = this.productItems.find( ( item ) => {
                    return item._id === itemId;
                } );
                return product ? `$${product.productCost} [${product.productCurrency}]` : 'n/a';
            },
            processOrder(){
                // capture the cartItems for the current user and store details in this.trade.tradeProducts[]

                // tradeShipping{}

                // tradePayment{}

                // tradeInfo{}


            },
            updateItem( item ) {
                // Set current item
                Session.set( 'currentTradeCartItem', item );
                // Route to detail page
                this.$router.push( { name: 'orderCartUpdate' } );
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
            // Fetch items from the server, based on role assignment / authorization
            // Get current logged-in user's token, for resource access
            const userToken     = this.$auth.getToken();
            let queryParams     = {},
                  currentItemId = '';
            // DDP || Meteor.method
            if( userToken ) {
                // providers
                Meteor.call( 'getTrade', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'TradeError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.cartItems   = _.sortBy( result.value, 'tradeGroup' ).filter( ( item ) => {
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
                        this.productItems = _.sortBy( result.value, 'productName' );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
                // TODO: shipping methods based on user location/shipping-addresses (country / state)
                // shipping cost
                Meteor.call( 'getShipCost', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'ShipProviderError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage     = false;
                        this.pageMessage   = 'Items available';
                        this.shipCostItems = _.sortBy( result.value, 'shipProvider' );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
                // addresses
                // current user / tradeOwner
                let tradeOwner = '';
                if( Session.get( 'currentUser' ) ) {
                    tradeOwner = Session.get( 'currentUser' )._id;
                }
                // set query parameters for address information
                queryParams = {
                    ownerId: tradeOwner,
                };

                Meteor.call( 'getAddress', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'AddressError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage    = false;
                        this.pageMessage  = 'Items available';
                        const ownerType   = Session.get( 'currentOwnerType' ) || '';
                        this.addressItems = _.sortBy( result.value, 'addressCountry' ).filter( ( item ) => {
                            return item.ownerType === ownerType;
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
                // reset query parameters
                queryParams = {};
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
            } else {
                this.isMessage   = true;
                this.pageMessage = 'Access-key missing or expired. Please login again.';
            }
        },
        updated() {
            $( '#mcOrderCartList' ).DataTable({
                destroy     : true,
                "pagingType": "full_numbers",
            });
        }
    }
</script>