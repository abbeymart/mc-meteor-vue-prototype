<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4 class="w3-left"><i class="glyphicon glyphicon-th-list"/>
                {{mcLabel.orderDetail}} :: {{mcLabel.orderNumber}}: {{orderView.orderNumber}}</h4>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <!--trade-details (ship/pay-addresses, trade-items/shipping cost etc.) > payment-->
            <div>
                <div class="w3-container">
                    <div class="col-sm-3">
                        <h4>{{mcLabel.shipAddress}}</h4>
                        <p>{{orderShipAddress.contactName}}</p>
                        <p>{{orderShipAddress.streetNumber}} {{orderShipAddress.streetName}}</p>
                        <p>
                            {{orderShipAddress.addressCity}}, {{stateName( orderShipAddress.addressState )}}, {{orderShipAddress.postalCode}}</p>
                        <p>{{countryName( orderShipAddress.addressCountry )}}</p>
                        <p>{{mcLabel.phoneNumber}}: {{orderShipAddress.contactPhone}}</p>
                    </div>
                    <div class="col-sm-3">
                        <h4>{{mcLabel.payAddress}}</h4>
                        <p>{{orderPayAddress.contactName}}</p>
                        <p>{{orderPayAddress.streetNumber}} {{orderPayAddress.streetName}}</p>
                        <p>
                            {{orderPayAddress.addressCity}}, {{stateName( orderPayAddress.addressState )}}, {{orderPayAddress.postalCode}}</p>
                        <p>{{countryName( orderPayAddress.addressCountry )}}</p>
                    </div>
                    <div class="col-sm-3">
                        <h4>{{mcLabel.payDetail}}</h4>
                        <h5 class="w3-teal">{{payStatus( orderView.orderPayment.tradePay )}}</h5>
                        <h5>{{payMethod( orderView.orderNumber )}}</h5>
                    </div>
                    <div class="col-sm-3">
                        <div><h4>{{mcLabel.orderSummary}}</h4></div>
                        <div>
                            <span class="col-sm-8"><b>{{mcLabel.subTotal}} ({{orderPayment.productCount}} {{orderView.tradeItemLabel}}):</b></span>
                            <span class="col-sm-4"><b>{{tradeCurrency}}{{formatCost( orderPayment.tradeCost )}}</b></span>
                            <div v-if="showItems">trade-items</div>
                            <br>
                            <span class="col-sm-8">{{mcLabel.shipEst}}:</span>
                            <span class="col-sm-4">{{tradeCurrency}}{{formatCost( orderPayment.tradeShipCost )}}</span>
                            <br>
                            <span class="col-sm-8">{{mcLabel.shipTax}}:</span>
                            <span class="col-sm-4">{{tradeCurrency}}{{formatCost( orderPayment.tradeShipCostTax )}}</span>
                            <br>
                            <span class="col-sm-8">{{tradeItemLabel}} Tax:</span>
                            <span class="col-sm-4">{{tradeCurrency}}{{formatCost( orderPayment.tradeCostTax )}}</span>
                            <br>
                            <span class="col-sm-8">Order before Tax:</span>
                            <span class="col-sm-4">{{tradeCurrency}}{{formatCost( orderPayment.tradeTotalCost )}}</span>
                            <br>
                            <span class="col-sm-8">{{mcLabel.orderTax}}:</span>
                            <span class="col-sm-4">{{tradeCurrency}}{{formatCost( orderPayment.tradeTotalCostTax )}}</span>
                            <br>
                            <span class="col-sm-8"><b>{{mcLabel.orderTotalTax}}:</b></span>
                            <span class="col-sm-4"><b>{{tradeCurrency}}{{formatCost( orderPayment.tradeCostTotalPlusTax )}}</b></span>
                            <br>
                        </div>
                    </div>
                </div>
                <hr>
                <!--include link to productView for items-list-->
                <div>
                    <table class="w3-table w3-striped w3-border w3-hoverable" id="mcOrderViewItems">
                        <thead v-if="orderItems">
                        <tr class="w3-red">
                            <th scope="col">{{mcLabel.image}}</th>
                            <th scope="col">{{mcLabel.product}}</th>
                            <th scope="col">{{mcLabel.cost}}</th>
                            <th scope="col">{{mcLabel.quantity}}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in orderItems" :key="item._id" @click.prevent="viewItem(item)">
                            <td>product-image</td>
                            <td>
                                <b>{{productName( item.productId )}}</b>
                                <br>
                                {{shortDesc( productDesc( item.productId ) )}}
                                <br>
                                <a id="viewItem" href="#"
                                   @click.prevent="viewItem(item)">{{mcLabel.detail}} <i
                                        class="glyphicon glyphicon-edit"/>
                                </a>
                            </td>
                            <td>{{productCost( item.productId )}}</td>
                            <td>
                                {{item.productQty}}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="w3-container">
                    <div><h4>{{mcLabel.adverts}}</h4></div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
    .StripeElement {
        background-color: white;
        padding: 8px 12px;
        border-radius: 4px;
        border: 1px solid transparent;
        box-shadow: 0 1px 3px 0 #e6ebf1;
        -webkit-transition: box-shadow 150ms ease;
        transition: box-shadow 150ms ease;
    }

    .StripeElement--focus {
        box-shadow: 0 1px 3px 0 #cfd7df;
    }

    .StripeElement--invalid {
        border-color: #fa755a;
    }

    .StripeElement--webkit-autofill {
        background-color: #fefde5 !important;
    }
</style>

<script>
    import { Meteor } from 'meteor/meteor';
    import { Session } from 'meteor/session';
    import { mcMessage } from '/imports/lib/locales/getMessage';
    import { validateTrade, validateTradeOrder } from '/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    const moment    = require( 'moment' );
    const randomize = require( 'randomatic' );
    const numFormat = require( 'numeral' );

    // Stripe configuration
    // client-side secret keys: testSecretKey | liveSecretKey
    const config     = require( '/imports/lib/utils/payment/config.json' );
    // Stripe Test
    const stripeTest = Stripe( config.public.stripe.testPublishableKey );
    // Stripe Live
    const stripeLive = Stripe( config.public.stripe.livePublishableKey );

    export default {
        name      : 'orderView',
        components: {},
        data() {
            return {
                mcLabel           : '',
                isMessage         : false,
                pageMessage       : '',
                cartItems         : [],
                productItems      : [],
                orderCatItems     : [],
                locationItems     : [],
                addressItems      : [],
                orderItems        : [],
                payItems          : [],
                itemParams        : {},
                orderView         : {},
                orderPayment      : {},
                orderPayAddress   : {},
                orderShipAddress  : {},
                tradeFolder       : '',
                tradePayMethod    : '',
                currentTradeFolder: '',
                itemId            : '',
                currentItem       : '',
                tradeCurrency     : 'US$',
                tradeItemLabel    : 'Item',
                tradeOrderNumber  : '',
                tradeShipDesc     : '',
                showItems         : false,
                readyToPay        : false,
                isAdmin           : false,
            }
        },
        computed  : {
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
            orderViewItems() {
                // return items with this.orderIds

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
                            if( !this.currentTradeFolder ) {
                                this.currentTradeFolder = folder._id;
                            }
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
                return `${itemLoc.streetNumber} ${itemLoc.streetName}, ${itemLoc.addressCity}, ${state.locationName}, ${itemLoc.postalCode} ${country.locationName}`;
            },
            cityName( itemLoc ) {
                const country = this.locationItems.find( ( item ) => {
                    return item._id === itemLoc.addressCountry;
                } );
                const state   = this.locationItems.find( ( item ) => {
                    return item._id === itemLoc.addressState;
                } );
                return `${itemLoc.streetNumber} ${itemLoc.streetName}, ${itemLoc.addressCity}, ${state.locationName}, ${itemLoc.postalCode} ${country.locationName}`;
            },
            stateName( itemLoc ) {
                const state = this.locationItems.find( ( item ) => {
                    return item._id === itemLoc;
                } );
                if( state ) {
                    return `${state.locationName}`;
                } else {
                    return '';
                }
            },
            countryName( itemLoc ) {
                const country = this.locationItems.find( ( item ) => {
                    return item._id === itemLoc;
                } );
                if( country ) {
                    return `${country.locationName}`;
                } else {
                    return '';
                }
            },
            productName( itemId ) {
                const product = this.productItems.find( ( item ) => {
                    return item._id === itemId;
                } );
                return product ? product.productName : 'n/a';
            },
            productCost( itemId ) {
                // TODO: get product cost from orderItems, i.e. as at the order completion date/time, apply to orderView (and optionally to receipt and invoice... duplicated view)
                const product = this.productItems.find( ( item ) => {
                    return item._id === itemId;
                } );
                return product ? `$${product.productCost} [${product.productCurrency}]` : 'n/a';
            },
            productDesc( itemId ) {
                const product = this.productItems.find( ( item ) => {
                    return item._id === itemId;
                } );
                return product ? product.productDesc : 'n/a';
            },
            formatCost( value ) {
                return numFormat( value ).format( '0,0.00' );
            },
            payMethod( orderNumber ) {
                const payment = this.payItems.find( ( item ) => {
                    return item.tradePayment.orderNumber === orderNumber;
                } );
                return payment ? `${payment.chargeInfo.source.funding.toUpperCase()} ${payment.chargeInfo.source.object.toUpperCase()} - ${payment.chargeInfo.source.brand} [****-****-****-${payment.chargeInfo.source.last4}]` : this.orderView.orderPayment.tradePay;
            },
            payStatus( status ) {
                return status === 'Invoice' ? status : 'Receipt';
            },
            viewItem( prod ) {
                // Get current item-record (full)
                const productItem = this.productItems.find( ( item ) => {
                    return item._id === prod.productId;
                } );

                // Set current item
                this.$store.dispatch( 'central/setProductItem', productItem );
                // Session.set( 'currentProductItem', productItem );
                // Route to detail page
                this.$router.push( { name: 'searchProductDetail' } );
            },
            folderName( itemId ) {
                const folder = this.orderCatItems.find( ( item ) => {
                    return item._id === itemId;
                } );
                return folder ? folder.catName : 'n/a';
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
            this.mcLabel      = this.$label;
            // trade-values from cart
            const tradeFolder = this.$store.getters[ 'central/getTradeFolder' ],
                  tradeItems  = this.$store.getters[ 'central/getTradeItems' ],
                  tradeParams = this.$store.getters[ 'central/getTradeParams' ];

            if( !this.$lo.isEmpty( tradeFolder ) ) {
                this.tradeFolder = tradeFolder;
            }
            if( !this.$lo.isEmpty( tradeItems ) ) {
                this.tradeItems = tradeItems;
            }
            if( this.$lo.isEmpty( tradeParams ) ) {
                this.tradeParams   = tradeParams;
                this.tradeCurrency = tradeParams.tradeCurrency;
            }

            const orderView = this.$store.getters[ 'central/getOrderViewItem' ];
            if( !this.$lo.isEmpty( orderView ) ) {
                // console.log( orderView );
                this.orderView        = orderView;
                this.orderPayment     = orderView.orderPayment;
                this.orderPayAddress  = orderView.orderPayment.tradePayAddress;
                this.orderShipAddress = orderView.orderPayment.tradeShipAddress;
                this.orderItems       = orderView.orderItems;
            }
            // Fetch items from the server, based on role assignment / authorization
            // Get current logged-in user's token, for resource access
            this.fetchData();
        },
    }
</script>
