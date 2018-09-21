<!--TODO: for multiple payments, use/apply credit/debit, cash and invoice components-->
<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4 class="w3-left"><i class="glyphicon glyphicon-th-list"/>
                {{mcLabel.tradeDetail}} :: {{ folderName( currentTradeFolder )
                }} :: {{tradeParams.tradePay}} {{mcLabel.payment}}s</h4>
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
                        <p>{{tradeParams.tradeAddress.contactName}}</p>
                        <p>{{tradeParams.tradeAddress.streetNumber}} {{tradeParams.tradeAddress.streetName}}</p>
                        <p>
                            {{tradeParams.tradeAddress.addressCity}}, {{stateName( tradeParams.tradeAddress )}}, {{tradeParams.tradeAddress.postalCode}}</p>
                        <p>{{countryName( tradeParams.tradeAddress )}}</p>
                        <p>{{mcLabel.phoneNumber}}: {{tradeParams.tradeAddress.contactPhone}}</p>
                    </div>
                    <div class="col-sm-3">
                        <h4>{{mcLabel.payAddress}}</h4>
                        <p>{{tradeParams.tradePayAddress.contactName}}</p>
                        <p>{{tradeParams.tradePayAddress.streetNumber}} {{tradeParams.tradePayAddress.streetName}}</p>
                        <p>
                            {{tradeParams.tradePayAddress.addressCity}}, {{stateName( tradeParams.tradePayAddress )}}, {{tradeParams.tradePayAddress.postalCode}}</p>
                        <p>{{countryName( tradeParams.tradePayAddress )}}</p>
                    </div>
                    <div class="col-sm-3">
                        <h4>{{mcLabel.payDetail}}</h4>
                        <h5>[{{tradeParams.tradePay}}]</h5>
                        <div class="form-group">
                            <label for="card-element">Credit or debit card</label>
                            <div id="card-element" v-on:change="changeCard(event)">
                                <!-- a Stripe Element will be inserted here. -->
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <div><h4>{{mcLabel.orderSummary}}</h4></div>
                        <div>
                            <span class="col-sm-8"><b>{{mcLabel.subTotal}} ({{tradeParams.productCount}} {{tradeParams.tradeItemLabel}}):</b></span>
                            <span class="col-sm-4"><b>{{tradeCurrency}}{{tradeParams.tradeCostLabel}}</b></span>
                            <div v-if="showItems">trade-items</div>
                            <br>
                            <span class="col-sm-8">{{mcLabel.shipEst}}:</span>
                            <span class="col-sm-4">{{tradeCurrency}}{{tradeParams.tradeShipCostLabel}}</span>
                            <br>
                            <span class="col-sm-8">{{mcLabel.shipTax}}:</span>
                            <span class="col-sm-4">{{tradeCurrency}}{{tradeParams.tradeShipCostTaxLabel}}</span>
                            <br>
                            <span class="col-sm-8">{{tradeItemLabel}} Tax:</span>
                            <span class="col-sm-4">{{tradeCurrency}}{{tradeParams.tradeCostTaxLabel}}</span>
                            <br>
                            <span class="col-sm-8">Order before Tax:</span>
                            <span class="col-sm-4">{{tradeCurrency}}{{tradeParams.tradeTotalCostLabel}}</span>
                            <br>
                            <span class="col-sm-8">{{mcLabel.orderTax}}:</span>
                            <span class="col-sm-4">{{tradeCurrency}}{{tradeParams.tradeTotalCostTaxLabel}}</span>
                            <br>
                            <span class="col-sm-8"><b>{{mcLabel.orderTotalTax}}:</b></span>
                            <span class="col-sm-4"><b>{{tradeCurrency}}{{tradeParams.tradeCostTotalPlusTaxLabel}}</b></span>
                            <br>
                        </div>
                        <hr>
                        <div>
                            <button class="btn btn-primary" @click.prevent="testPayment">
                                {{mcLabel.payOrder}}
                            </button>
                        </div>
                        <!--<div v-if="!readyToPay">-->
                        <!--<h4>Payment Information Required To Complete Order</h4>-->
                        <!--</div>-->
                    </div>
                </div>
                <hr>
                <div class="w3-container">
                    <div class="col-sm-2"><h4>{{mcLabel.tradeItems}}</h4></div>
                    <div class="col-sm-4">
                        <button class="btn btn-primary" @click.prevent="updateTrade">
                            {{mcLabel.tradeUpdate}}
                        </button>
                    </div>
                </div>
                <div>
                    <table class="w3-table w3-striped w3-border w3-hoverable" id="mcOrderCartItems">
                        <thead v-if="tradeItems">
                        <tr class="w3-red">
                            <th scope="col">{{mcLabel.image}}</th>
                            <th scope="col">{{mcLabel.product}}</th>
                            <th scope="col">{{mcLabel.cost}}</th>
                            <th scope="col">{{mcLabel.quantity}}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in tradeItems" :key="item._id">
                            <td>product-image</td>
                            <td>
                                <b>{{productName( item.tradeProduct )}}</b>
                                <br>
                                {{shortDesc( item.tradeDesc )}}
                            </td>
                            <td>{{productCost( item.tradeProduct )}}</td>
                            <td>
                                {{item.tradeQuantity}}
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
    import CartView from '../cart/CartView.vue';

    // Stripe configuration
    // client-side secret keys: testSecretKey | liveSecretKey
    const config     = require( '/imports/lib/utils/payment/config.json' );
    // Stripe Test
    const stripeTest = Stripe( config.public.stripe.testPublishableKey );
    // Stripe Live
    const stripeLive = Stripe( config.public.stripe.livePublishableKey );

    export default {
        name      : 'orderCheckoutMultiple',
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
                itemParams        : {},
                trade             : {},
                tradeFolder       : '',
                tradeItems        : [],
                tradeParams       : {},
                orderPay          : {
                    key        : '',
                    locale     : 'auto',
                    payName    : 'Stripe Payment',
                    name       : 'MC',
                    email      : '',
                    productName: '',
                    amount     : 10,
                    currency   : "usd",
                    description: "Payment for order:",
                    metadata   : {},
                },
                card              : '',
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
        components: {
            cartView: CartView
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
                            this.orderCatItems = _.sortBy( result.value, 'catName' ).filter( ( item ) => {
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
                    // addresses
                    Meteor.call( 'getAddress', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'AddressError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage    = false;
                            this.pageMessage  = 'Items available';
                            this.addressItems = _.sortBy( result.value, 'addressType' ).filter( ( item ) => {
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
                    return item._id === itemLoc.addressState;
                } );
                return state ? state.locationName : '';
            },
            countryName( itemLoc ) {
                const country = this.locationItems.find( ( item ) => {
                    return item._id === itemLoc.addressCountry;
                } );
                return state ? state.locationName : '';
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
            formatCost( value ) {
                return numFormat( value ).format( '0,0.00' );
            },
            folderName( itemId ) {
                const folder = this.orderCatItems.find( ( item ) => {
                    return item._id === itemId;
                } );
                return folder ? folder.catName : 'n/a';
            },
            changeCard( event ) {
                if( event.error ) {
                    this.readyToPay  = false;
                    this.isMessage   = true;
                    this.pageMessage = event.error.message;
                } else {
                    this.readyToPay  = true;
                    this.isMessage   = false;
                    this.pageMessage = '';
                }
            },
            updateTradeItems( orderId ) {
                // get items in the order from cart-items
                const defaultFolder = this.currentTradeFolder;
                const cartItems     = this.cartItems.filter( ( item ) => {
                    return ( item.tradeFolder === defaultFolder && item.isActive === true);
                } ) || this.tradeItems;

                // get tradeShipName by tradeShip(id)
                const tradeShipName = this.orderCatItems.find( ( item ) => {
                    return item._id === this.tradeParams.tradeShip;
                } );

                // update tradeStatus for tradeFolder, tradeItems[], && isActive = true,
                const payInfo = {
                    tradeShipAddress     : this.tradeParams.tradeAddress,
                    tradePayAddress      : this.tradeParams.tradePayAddress,
                    tradePay             : this.tradeParams.tradePay,
                    tradeShip            : this.tradeParams.tradeShip,
                    tradeShipName        : tradeShipName.catName,
                    tradeTaxName         : this.tradeParams.tradeTaxName,
                    tradeCurrency        : this.tradeParams.tradeCurrency,
                    tradeShipCost        : this.tradeParams.tradeShipCost,
                    tradeShipCostTax     : this.tradeParams.tradeShipCostTax,
                    tradeCost            : this.tradeParams.tradeCost,
                    tradeCostTax         : this.tradeParams.tradeCostTax,
                    tradeTotalCost       : this.tradeParams.tradeTotalCost,
                    tradeTotalCostTax    : this.tradeParams.tradeTotalCostTax,
                    tradeCostTotalPlusTax: this.tradeParams.tradeCostTotalPlusTax,
                };

                // trade-order-number
                this.tradeOrderNumber = this.tradeOrderNumber || orderId;

                const tradeParams = {
                    tradeFolder     : this.currentTradeFolder || Session.get( 'tradeFolder' ),
                    tradeItems      : cartItems,
                    tradeOwner      : Session.get( 'currentUser' )._id,
                    tradeStatus     : 'OrderTrade',
                    tradeOrderNumber: this.tradeOrderNumber,
                    tradePayment    : payInfo,
                    isActive        : true,
                };

                console.log( tradeParams.tradeItems );

                // validate inputs
                let errors = validateTradeOrder( tradeParams );
                if( errors.tradeFolder || errors.tradeStatus || errors.tradeOrderNumber || errors.tradeOwner || errors.tradeItems || errors.tradePayment ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'updateTradeItems', tradeParams, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage   = true;
                                this.pageMessage = `${result.code}: ${result.value}`;
                            }
                        } );
                    } else {
                        this.isMessage   = true;
                        // TODO: include this.validateErrors{}: key:value messages
                        this.pageMessage = 'inputs-errors: ' + JSON.stringify( errors );
                    }
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Please login';
                }
            },
            testPayment() {
                // check if ready to pay
//                if( !this.readyToPay ) {
//                    this.isMessage   = true;
//                    this.pageMessage = "Payment Information Details Required";
//                    return;
//                }

                // userToken: access key
                const userToken = this.$auth.getToken();

                // generate order-id / number
                const orderId = randomize( '0', 16 );

                // additional payment / customer information, names / addresses (pay / ship)
                const customerInfo = {}; // orderNumber is a sufficient reference-id
                if( Session.get( 'currentUser' ) ) {
                    const userInfo         = Session.get( 'currentUser' );
                    this.orderPay.name     = `${userInfo.profile.firstName} ${userInfo.profile.lastName}`;
                    this.orderPay.email    = userInfo.emails[ 0 ].address;
                    this.orderPay.metadata = {
                        name          : `${userInfo.profile.firstName} ${userInfo.profile.lastName}`,
                        email         : userInfo.emails[ 0 ].address,
                        order_id      : orderId,
                        receipt_number: orderId,
                        order_date    : new Date(),
                    }
                }

                // TODO: optional, check if customer prefers to store partial card info and/or use it for the current/future transactions...

                // set trade-order-number
                this.tradeOrderNumber = orderId;

                const tradePayment = {
                    orderNumber          : orderId,
                    tradeShipAddress     : this.tradeParams.tradeAddress,
                    tradePayAddress      : this.tradeParams.tradePayAddress,
                    tradeCurrency        : this.tradeParams.tradeCurrency,
                    tradeShipCost        : this.tradeParams.tradeShipCost,
                    tradeShipCostTax     : this.tradeParams.tradeShipCostTax,
                    tradeCost            : this.tradeParams.tradeCost,
                    tradeCostTax         : this.tradeParams.tradeCostTax,
                    tradeTotalCost       : this.tradeParams.tradeTotalCost,
                    tradeTotalCostTax    : this.tradeParams.tradeTotalCostTax,
                    tradeCostTotalPlusTax: this.tradeParams.tradeCostTotalPlusTax,
                };

                // set / validate inputs for testing
                const payInfo = {
                    email       : this.orderPay.email,
                    amount      : this.tradeParams.tradeCostTotalPlusTax * 100,
                    currency    : this.orderPay.currency,
                    description : `${this.orderPay.description} ${orderId}`,
                    tradePayment: tradePayment,
                    metadata    : this.orderPay.metadata,
                };

                let errors          = '';
                this.validateErrors = '';

                // get client payment token
                stripeTest.createToken( this.card ).then( ( result ) => {
                    if( result.error ) {
                        // Inform the user if there was an error
                        this.isMessage   = true;
                        this.pageMessage = result.error.message;
                    } else {
                        const payToken   = result.token.id;
                        this.isMessage   = true;
                        this.pageMessage = 'Payment token obtained';

                        // process payment on the server
                        if( userToken ) {
                            if( _.isEmpty( errors ) ) {
                                // reset validateErrors
                                this.validateErrors = '';
                                Meteor.call( 'saveChargeCustomerTest', payInfo, payToken, userToken, ( error, result ) => {
                                    if( error ) {
                                        this.isMessage   = true;
                                        this.pageMessage = `${error}: Payment Error. Please retry`;
                                    } else if( result.code === 'success' ) {
                                        this.isMessage   = true;
                                        this.pageMessage = result.value.status + ':: Payment made successfully. Thank you!';
                                        // update tradeInfo (status for tradeFolder && isActive),
                                        this.updateTradeItems( orderId );
                                    } else {
                                        console.log( result.value, result.value.status );
                                        this.isMessage   = true;
                                        this.pageMessage = `${result.value.status} :: ${result.outcome.seller_message} :: ${result.outcome.network_status}`;
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
                    }
                } );
            },
            livePayment() {
                // check if ready to pay
                if( !this.readyToPay ) {
                    this.isMessage   = true;
                    this.pageMessage = "Payment Information Details Required";
                    return;
                }

                // userToken: access key
                const userToken = this.$auth.getToken();

                // generate order-id / number
                const orderId = randomize( '0', 16 );

                // additional payment / customer information, names / addresses (pay / ship)
                const customerInfo = {}; // orderNumber is a sufficient reference-id
                if( Session.get( 'currentUser' ) ) {
                    const userInfo         = Session.get( 'currentUser' );
                    this.orderPay.name     = `${userInfo.profile.firstName} ${userInfo.profile.lastName}`;
                    this.orderPay.email    = userInfo.emails[ 0 ].address;
                    this.orderPay.metadata = {
                        name       : `${userInfo.profile.firstName} ${userInfo.profile.lastName}`,
                        email      : userInfo.emails[ 0 ].address,
                        orderId    : orderId,
                        orderNumber: orderId,
                        orderDate  : new Date(),
                    }
                }

                // TODO: check if customer prefers to store partial card info and/or use it for the current/future transactions...

                // set trade-order-number
                this.tradeOrderNumber = orderId;

                const tradePayment = {
                    orderNumber          : orderId,
                    tradeShipAddress     : this.tradeParams.tradeAddress,
                    tradePayAddress      : this.tradeParams.tradePayAddress,
                    tradeCurrency        : this.tradeParams.tradeCurrency,
                    tradeShipCost        : this.tradeParams.tradeShipCost,
                    tradeShipCostTax     : this.tradeParams.tradeShipCostTax,
                    tradeCost            : this.tradeParams.tradeCost,
                    tradeCostTax         : this.tradeParams.tradeCostTax,
                    tradeTotalCost       : this.tradeParams.tradeTotalCost,
                    tradeTotalCostTax    : this.tradeParams.tradeTotalCostTax,
                    tradeCostTotalPlusTax: this.tradeParams.tradeCostTotalPlusTax,
                };

                // set / validate inputs for testing
                const payInfo = {
                    email       : this.orderPay.email,
                    amount      : this.tradeParams.tradeCostTotalPlusTax * 100,
                    currency    : this.orderPay.currency,
                    description : `${this.orderPay.description} ${orderId}`,
                    tradePayment: tradePayment,
                    metadata    : this.orderPay.metadata,
                };

                let errors          = '';
                this.validateErrors = '';

                // get client payment token
                stripeTest.createToken( this.card ).then( ( result ) => {
                    if( result.error ) {
                        // Inform the user if there was an error
                        this.isMessage   = true;
                        this.pageMessage = result.error.message;
                    } else {
                        const payToken   = result.token.id;
                        this.isMessage   = true;
                        this.pageMessage = 'Payment token obtained';

                        // process payment on the server
                        if( userToken ) {
                            if( _.isEmpty( errors ) ) {
                                // reset validateErrors
                                this.validateErrors = '';
                                Meteor.call( 'saveChargeCustomerLive', payInfo, payToken, userToken, ( error,
                                    result ) => {
                                    if( error ) {
                                        this.isMessage   = true;
                                        this.pageMessage = `${error}: Payment Error. Please retry`;
                                    } else if( result.code === 'success' ) {
                                        this.isMessage   = true;
                                        this.pageMessage = result.value.status + ':: Payment made successfully. Thank you!';
                                        // update tradeInfo (status for tradeFolder && isActive),
                                        this.updateTradeItems();
                                    } else {
                                        this.isMessage   = true;
                                        this.pageMessage = `${result.value.status} :: ${result.outcome.seller_message} :: ${result.outcome.network_status}`;
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
                    }
                } );
            },
            updateItem( item ) {
                // Set current item
                Session.set( 'currentTradeCartItem', item );
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
            this.mcLabel = this.$label;
            // trade-values from cart
            if( Session.get( 'tradeFolder' ) ) {
                this.tradeFolder = Session.get( 'tradeFolder' );
            }
            if( Session.get( 'tradeItems' ) ) {
                this.tradeItems = Session.get( 'tradeItems' );
            }
            if( Session.get( 'tradeParams' ) ) {
                this.tradeParams   = Session.get( 'tradeParams' );
                this.tradeCurrency = this.tradeParams.tradeCurrency;
            }
            // Fetch items from the server, based on role assignment / authorization
            // Get current logged-in user's token, for resource access
            this.fetchData();
        },
        mounted() {
            // Create an instance of Elements
            const elements = stripeTest.elements();

            //custom style
            const style = {
                base   : {
                    color          : '#32325d',
                    lineHeight     : '24px',
                    fontFamily     : 'Helvetica Neue',
                    fontSmoothing  : 'antialiased',
                    fontSize       : '16px',
                    '::placeholder': {
                        color: '#aab7c4'
                    }
                },
                invalid: {
                    color    : '#fa755a',
                    iconColor: '#fa755a'
                }
            };

            // Create an instance of the card Element
            this.card = elements.create( 'card', { style: style } );

            // Add an instance of the card Element into the `card-element` <div>
            this.card.mount( '#card-element' );

        },
        updated() {
            // Handle real-time validation errors from the card Element.
            this.card.addEventListener( 'change', ( event ) => {
                if( event.error ) {
                    this.readyToPay  = false;
                    this.isMessage   = true;
                    this.pageMessage = event.error.message;
                } else {
                    this.readyToPay  = true;
                    this.isMessage   = false;
                    this.pageMessage = '';
                }
            } );
        }
    }
</script>