<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4 class="w3-left"><i class="glyphicon glyphicon-th-list"/>
                {{mcLabel.tradeDetail}} :: {{ folderName( currentTradeFolder )
                }} :: {{tradeParams.tradePay}} {{mcLabel.payment}}</h4>
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
                        <h4>{{mcLabel.payMethod}}</h4>
                        <h5>[{{tradeParams.tradePay}}]</h5>
                        <div class="form-group">
                            <h5>Cash Payment ($$)</h5>
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
                            <span class="col-sm-8">{{mcLabel.itemTax}}:</span>
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
                            <!--confirm cash payment / receipt to complete order-->
                            <button class="btn btn-primary" @click.prevent="cashPayment">
                                {{mcLabel.payOrder}}
                            </button>
                        </div>
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
</style>

<script>
    import { Meteor } from 'meteor/meteor';
    import { mcMessage } from '/imports/lib/locales/getMessage';
    import { validateTrade, validateTradeOrder } from '/imports/lib/utils/ValidateRecord';

    const randomize = require( 'randomatic' );
    const numFormat = require( 'numeral' );

    export default {
        name      : 'orderCheckoutCash',
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
                    payName    : 'Cash Payment',
                    name       : 'MC',
                    email      : '',
                    productName: '',
                    amount     : 10,
                    currency   : "usd",
                    description: "Payment for order:",
                    metadata   : {},
                },
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
                validateErrors    : '',
            }
        },
        components: {},
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
                            this.orderCatItems = this.$lo.sortBy( result.value, 'catName' ).filter( ( item ) => {
                                return item.isActive === true;
                            } );
                            // Default cart folder ID:
                            const folder       = result.value.find( ( item ) => {
                                return (item.catName === 'Cart' && item.catGroup === 'Cart');
                            } );
                            if( !this.currentTradeFolder ) {
                                if( this.tradeFolder ) {
                                    this.currentTradeFolder = this.tradeFolder;
                                } else {
                                    this.currentTradeFolder = folder._id;
                                }
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
                return country ? country.locationName : '';
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
                    tradeTax             : this.tradeParams.tradeTax,
                    tradeDiscount        : this.tradeParams.tradeDiscount,
                };

                // trade-order-number
                this.tradeOrderNumber = this.tradeOrderNumber || orderId;

                const tradeParams = {
                    tradeFolder     : this.currentTradeFolder || this.$store.getters[ 'central/getTradeFolder' ],
                    tradeItems      : cartItems,
                    tradeOwner      : this.$store.getters[ 'central/getCurrentUser' ]._id,
                    tradeStatus     : 'OrderTrade',
                    tradeOrderNumber: this.tradeOrderNumber,
                    tradePayment    : payInfo,
                    isActive        : true,
                };

                // validate inputs
                let errors = validateTradeOrder( tradeParams );
                if( errors.tradeFolder || errors.tradeStatus || errors.tradeOrderNumber || errors.tradeOwner || errors.tradeItems || errors.tradePayment ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'updateTradeItems', tradeParams, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage   = true;
                                this.pageMessage = `${result.code}: ${result.value}`;
                                // TODO: route to order completed page (clone checkoutPage)
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
            cashPayment() {
                // confirm cash payment to continue
                if( !confirm( this.$message.confirmCashPayment ) ) {
                    this.isMessage   = true;
                    this.pageMessage = "Cash payment must be confirmed before order can be completed";
                    return;
                }

                // userToken: access key
                const userToken = this.$auth.getToken();

                // generate order-id / number
                const orderId = randomize( '0', 16 );

                // get tradeShipName by tradeShip(id)
                const tradeShipName = this.orderCatItems.find( ( item ) => {
                    return item._id === this.tradeParams.tradeShip;
                } );

                // trade-order-number
                this.tradeOrderNumber = this.tradeOrderNumber || orderId;

                // additional payment / customer information, names / addresses (pay / ship)
                const userInfo = this.$store.getters[ 'central/getCurrentUser' ];
                if( userInfo ) {
                    this.orderPay.name     = `${userInfo.profile.firstName} ${userInfo.profile.lastName}`;
                    this.orderPay.email    = userInfo.emails[ 0 ].address;
                    this.orderPay.metadata = {
                        name          : `${userInfo.profile.firstName} ${userInfo.profile.lastName}`,
                        email         : userInfo.emails[ 0 ].address,
                        order_id      : orderId,
                        receipt_number: orderId,
                        payMethod     : this.tradeParams.tradePay,
                        order_date    : new Date(),
                    }
                }

                const tradePayment = {
                    orderNumber          : orderId,
                    tradeShipAddress     : this.tradeParams.tradeAddress,
                    tradePayAddress      : this.tradeParams.tradePayAddress,
                    tradePay             : this.tradeParams.tradePay,
                    tradeShip            : this.tradeParams.tradeShip,
                    tradeShipName        : tradeShipName.catName,
                    tradeShipDesc        : this.tradeParams.tradeShipDesc,
                    tradeTaxName         : this.tradeParams.tradeTaxName,
                    tradeCurrency        : this.tradeParams.tradeCurrency,
                    tradeShipCost        : this.tradeParams.tradeShipCost,
                    tradeShipCostTax     : this.tradeParams.tradeShipCostTax,
                    tradeCost            : this.tradeParams.tradeCost,
                    tradeCostTax         : this.tradeParams.tradeCostTax,
                    tradeTotalCost       : this.tradeParams.tradeTotalCost,
                    tradeTotalCostTax    : this.tradeParams.tradeTotalCostTax,
                    tradeCostTotalPlusTax: this.tradeParams.tradeCostTotalPlusTax,
                    tradeTax             : this.tradeParams.tradeTax,
                    tradeDiscount        : this.tradeParams.tradeDiscount,
                };

                const tradeParams = {
                    tradeFolder     : this.currentTradeFolder || this.$store.getters[ 'central/getTradeFolder' ],
                    tradeItems      : this.tradeItems || this.$store.getters[ 'central/getTradeItems' ],
                    tradeOwner      : this.$store.getters[ 'central/getCurrentUser' ]._id,
                    tradeStatus     : 'OrderTrade',
                    tradeOrderNumber: this.tradeOrderNumber,
                    tradePayment    : tradePayment,
                    isActive        : true,
                };

                // Check mandatory data items
                const errors = validateTradeOrder( tradeParams );
                if( errors.tradeFolder || errors.tradeStatus || errors.tradeOrderNumber || errors.tradeOwner || errors.tradeItems || errors.tradePayment ) {
                    this.validateErrors = errors;
                    return;
                }

                // set / validate inputs for testing
                const payInfo = {
                    customerId   : userInfo._id,
                    email        : this.orderPay.email,
                    amount       : this.tradeParams.tradeCostTotalPlusTax * 100,
                    currency     : this.orderPay.currency,
                    description  : `${this.orderPay.description} ${orderId}`,
                    tradePayment : tradePayment,
                    tradeParams  : tradeParams,
                    paymentStatus: 'Paid',
                    metadata     : this.orderPay.metadata,
                };

                // let errors          = {};
                // this.validateErrors = '';

                // process payment on the server
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveCashPayment', payInfo, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Payment Saving Error. Please retry`;
                            } else {
                                this.isMessage                               = true;
                                // handle payResult, tradeResult and tradeEmail messages
                                const [ payResult, tradeResult, tradeEmail ] = result;
                                const payMsg                                 = (payResult || !this.$lo.isEmpty( payResult )) ? `${payResult.code}: ${payResult.value}` : 'No payment message - contact Support';
                                const tradeMsg                               = (tradeResult || !this.$lo.isEmpty( tradeResult )) ? `${tradeResult.code}: ${tradeResult.value}` : 'N/A';
                                const emailMsg                               = (tradeEmail || !this.$lo.isEmpty( tradeEmail )) ? `${tradeEmail.code}: ${tradeEmail.value}` : 'N/A';

                                this.itemId      = (payResult || !this.$lo.isEmpty( payResult )) ? payResult.docId : '';
                                this.pageMessage = `Payment: ${payMsg} | Trade: ${tradeMsg} | Email: ${emailMsg}`;
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
            updateItem( item ) {
                // Set current item
                this.$store.dispatch( 'central/setCartItem', item );
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

            if( tradeFolder ) {
                this.tradeFolder = tradeFolder;
            }
            if( tradeItems ) {
                this.tradeItems = tradeItems;
            }
            if( tradeParams ) {
                this.tradeParams   = tradeParams;
                this.tradeCurrency = this.tradeParams.tradeCurrency;
            }
            // Fetch items from the server, based on role assignment / authorization
            // Get current logged-in user's token, for resource access
            this.fetchData();
        },
    }
</script>
