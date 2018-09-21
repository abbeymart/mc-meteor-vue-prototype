<template>
    <div>
        <!--TODO: ship items by order, partly or fully-->
        <!--TODO: fix shipType, shipBy/Provider and shipItems issues...-->
        <!--orderNo/ship-method, order-items for shipment, -->
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i>
                {{mcLabel.shipOrderDetail}} :: {{mcLabel.orderNumber}}: {{ship.shipOrder}}
            </h4>
        </div>
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <form class="w3-margin-8">
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="shipOrder">{{mcLabel.orderItem}}</label>
                        <select class="form-control" v-model="ship.shipOrder" id="shipOrder"
                                v-on:change="shipOrderMethod" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.orderItem}}</option>
                            <option v-for="item in orderItems" :value="item.orderNumber">
                                {{ item.orderNumber }} | {{userName( item.orderOwner )}}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipOrder}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipType">{{mcLabel.shipType}}</label>
                        <select class="form-control" v-model="ship.shipType" id="shipType" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.shipType}}</option>
                            <option value="Order">Ship Order | All Item(s)</option>
                            <option value="Item">Ship Item(s) | Part of Order</option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipType}}</span>
                    </div>
                    <div v-if="ship.shipType === 'Item' && ship.shipStatus !=='Shipped'" class="form-group">
                        <!--ship: by order or items, list using multi-select(combo-boxes)-->
                        <label for="shipItems">{{mcLabel.shipItems}}</label>
                        <select class="form-control" v-model="ship.shipItems" id="shipItems" multiple required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.orderItem}}</option>
                            <option v-for="item in shipOrderItems"
                                    v-bind:value="{ productId: item.productId, productQty: item.productQty }">
                                {{ productName( item.productId ) }} ({{item.productQty}})
                            </option>
                        </select>
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.shipItems}}</span>
                    </div>
                    <div class="form-group">
                        <span>Item(s) shipped: </span>
                        <span v-for="prod in shippedItems">
                            {{ productName( prod.productId ) }}  ({{prod.productQty}}) |
                        </span>
                    </div>
                    <div v-if="ship.shipOrder" class="form-group">
                        <label for="shipAmount">{{mcLabel.shipToCost}}</label>
                        <input type="text" class="form-control" id="shipAmount"
                               :placeholder="mcLabel.shipToCost" maxlength="25" disabled
                               v-model="ship.shipAmount">
                    </div>
                    <div v-if="ship.shipOrder" class="form-group">
                        <label for="shipMethod">{{mcLabel.shipToMethod}}</label>
                        <input type="text" class="form-control" id="shipMethod" v-model="ship.shipMethod"
                               :placeholder="mcLabel.shipToMethod" maxlength="255" disabled>
                    </div>
                    <div v-if="ship.shipOrder" class="form-group">
                        <label for="shipOwner">{{mcLabel.customer}}</label>
                        <input type="text" class="form-control" id="shipOwner"
                               :placeholder="mcLabel.customer" maxlength="255" disabled
                               v-model="ship.shipFor">
                    </div>
                    <div class="form-group">
                        <label for="shipDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="shipDesc" cols="30" rows="5"
                                  :placeholder="mcLabel.desc" v-model="ship.shipDesc"></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.shipDesc}}</span>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div v-if="ship.shipOrder" class="form-group">
                        <label for="shipTo">{{mcLabel.shipToAddress}}</label>
                        <input type="text" class="form-control" id="shipTo"
                               :placeholder="mcLabel.shipToAddress" maxlength="255" disabled
                               v-model="shipToAddress">
                    </div>
                    <div class="form-group">
                        <label for="shipDate">{{mcLabel.shipDate}}</label>
                        <input type="date" class="form-control" id="shipDate"
                               :placeholder="mcLabel.shipDate" maxlength="100" required
                               v-model="ship.shipDate">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.shipDate}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipBy">{{mcLabel.shipBy}}</label>
                        <select class="form-control" v-model="ship.shipBy" id="shipBy" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.shipBy}}</option>
                            <option v-for="item in shipProviders" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipBy}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipTrack">{{mcLabel.shipTrack}}</label>
                        <input type="text" class="form-control" id="shipTrack"
                               :placeholder="mcLabel.track" maxlength="255" required
                               v-model="ship.shipTrack">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.shipTrack}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipStatus">{{mcLabel.status}}</label>
                        <select class="form-control" v-model="ship.shipStatus" id="shipStatus" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.status}}</option>
                            <option v-for="item in shipStatuses" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipStatus}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipLang">{{mcLabel.lang}}</label>
                        <select class="form-control" v-model="ship.shipLang" id="shipLang" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                            <option v-for="item in langItems" :value="item.langCode">
                                {{ item.langName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipStatus}}</span>
                    </div>
                    <div class="form-group">
                        <label for="isActive">{{mcLabel.isActive}} </label>
                        <input class="w3-check" type="checkbox" id="isActive" v-model="ship.isActive">
                        <button class="btn btn-primary" @click.prevent="saveShip">
                            {{mcLabel.save}}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<style>

</style>
<script>
    // View components, locales...
    import { Meteor } from 'meteor/meteor';
    import { validateShipping } from '/imports/lib/utils/ValidateRecord';

    const moment    = require( 'moment' );
    const numFormat = require( 'numeral' );

    export default {
        name    : 'shipOrderDetail',
        data() {
            return {
                mcLabel       : {},
                userItems     : [],
                langItems     : [],
                codeItems     : [],
                productItems  : [],
                locationItems : [],
                addressItems  : [],
                orderItems    : [],
                shipItems     : [],
                payItems      : [],
                ship          : {
                    shipOrder : '',
                    shipType  : 'Order',
                    shipItems : [],     // {itemId: '1111444', itemQty: 2},...
                    shipMethod: '',
                    shipBy    : '',
                    shipFor   : '',   // read-only by orderNumber
                    shipAmount: '',    // read-only by orderNumber
                    shipTo    : '',   // read-only by orderNumber
                    shipDate  : this.formatDate( Date.now() ),   // select from calendar
                    shipTrack : '1234567890',   // optional tracking #
                    shipStatus: '',
                    shipLang  : this.$constant.getDefaultLanguage(),
                    shipDesc  : '',
                    isActive  : false
                },
                pageMessage   : '',
                isMessage     : false,
                itemsShipped  : false,
                itemId        : '',
                itemParams    : '',
                itemParamId   : '',
                validateErrors: '',
            }
        },
        computed: {
            shipOrderCost() {
                // return ship cost for the orderNumber
                if( !this.ship.shipOrder ) {
                    this.isMessage   = true;
                    this.pageMessage = "Order Number is Required";
                }
                const shipInfo = this.orderItems.find( ( item ) => {
                    return item.orderNumber === this.ship.shipOrder
                } );
                if( shipInfo ) {
                    const shipCost       = numFormat( shipInfo.orderPayment.tradeShipCost + shipInfo.orderPayment.tradeShipCostTax ).format( '0,0.00' );
                    this.ship.shipAmount = `${shipInfo.orderPayment.tradeCurrency}${shipCost}`;
                    return `${shipInfo.orderPayment.tradeCurrency}${shipCost}`;
                }
            },
            // shipOrderMethod() {
            //     // return ship cost for the orderNumber
            //     if( !this.ship.shipOrder ) {
            //         this.isMessage   = true;
            //         this.pageMessage = "Order Number is Required";
            //     }
            //     const shipInfo = this.orderItems.find( ( item ) => {
            //         return item.orderNumber === this.ship.shipOrder
            //     } );
            //
            //     if( shipInfo ) {
            //         this.ship.shipMethod = shipInfo.orderPayment.tradeShipName;
            //         const shipCost       = numFormat( shipInfo.orderPayment.tradeShipCost + shipInfo.orderPayment.tradeShipCostTax ).format( '0,0.00' );
            //         this.ship.shipAmount = `${shipInfo.orderPayment.tradeCurrency}${shipCost}`;
            //         return shipInfo.orderPayment.tradeShipName;
            //     }
            // },
            customerName() {
                // validate order number
                if( !this.ship.shipOrder ) {
                    this.isMessage   = true;
                    this.pageMessage = "Order Number is Required";
                }
                const shipInfo = this.orderItems.find( ( item ) => {
                    return item.orderNumber === this.ship.shipOrder
                } );
                let userInfo;
                if( shipInfo ) {
                    userInfo = this.userItems.find( ( item ) => {
                        return item._id === shipInfo.orderOwner;
                    } );
                }
                if( userInfo ) {
                    this.ship.shipFor = `${userInfo.username}, ${userInfo.profile.firstName} ${userInfo.profile.lastName}` || '';
                    return userInfo ? `${userInfo.username}, ${userInfo.profile.firstName} ${userInfo.profile.lastName}` : ''
                }
            },
            shipOrders() {
                return this.orderItems.filter( ( item ) => {
                    return item.isActive === true;
                } );
            },
            shipProviders() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Shipping';
                } );
            },
            shipStatuses() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Shipping Status';
                } );
            },
            shipAddresses() {
                const shipInfo = this.orderItems.find( ( item ) => {
                    return item.orderNumber === this.ship.shipOrder
                } );
                // get shipping addresses for the current user (buyer)
                if( shipInfo ) {
                    return this.addressItems.filter( ( item ) => {
                        return (item.addressType === 'Shipping' || item.addressType === 'Payment' && item.ownerId === shipInfo.orderOwner);
                    } );
                }
            },
            shipToAddress() {
                // return ship cost for the orderNumber
                if( !this.ship.shipOrder ) {
                    this.isMessage   = true;
                    this.pageMessage = "Order Number is Required";
                }
                const shipInfo = this.orderItems.find( ( item ) => {
                    return item.orderNumber === this.ship.shipOrder
                } );
                // get shipping addresses for the current user (buyer)
                if( shipInfo ) {
                    const shipAddress = shipInfo.orderPayment.tradeShipAddress;
                    const country     = this.locationItems.find( ( item ) => {
                        return item._id === shipAddress.addressCountry;
                    } );
                    const state       = this.locationItems.find( ( item ) => {
                        return item._id === shipAddress.addressState;
                    } );
                    // set the shipTo address:
                    this.ship.shipTo  = `${shipAddress.contactName} (${shipAddress.contactPhone}) | ${shipAddress.streetNumber} ${shipAddress.streetName}, ${shipAddress.addressCity}, ${state.locationName}, ${shipAddress.postalCode} ${country.locationName}`;

                    return `${shipAddress.contactName} (${shipAddress.contactPhone}) | ${shipAddress.streetNumber} ${shipAddress.streetName}, ${shipAddress.addressCity}, ${state.locationName}, ${shipAddress.postalCode} ${country.locationName}`;
                }
            },
            shippedItems() {
                const shipInfo = this.shipItems.find( ( item ) => {
                    return item.shipOrder = this.ship.shipOrder;
                } );
                if( shipInfo ) {
                    this.itemsShipped = true;
                    return shipInfo.shipItems;
                }

            },
            shipOrderItems() {
                const shipInfo = this.orderItems.find( ( item ) => {
                    return item.orderNumber = this.ship.shipOrder;
                } );
                if( shipInfo ) {
                    return shipInfo.orderItems;
                }
            },
        },
        methods : {
            formatDate( date ) {
                return moment( date ).format( "YYYY-MM-DD" );
            },
            shipOrderMethod() {
                // return ship cost for the orderNumber
                if( !this.ship.shipOrder ) {
                    this.isMessage   = true;
                    this.pageMessage = "Order Number is Required";
                }
                const shipInfo = this.orderItems.find( ( item ) => {
                    return item.orderNumber === this.ship.shipOrder
                } );

                if( shipInfo ) {
                    this.ship.shipMethod = shipInfo.orderPayment.tradeShipName;
                    const shipCost       = numFormat( shipInfo.orderPayment.tradeShipCost + shipInfo.orderPayment.tradeShipCostTax ).format( '0,0.00' );
                    this.ship.shipAmount = `${shipInfo.orderPayment.tradeCurrency}${shipCost}`;
                }
            },
            fetchData() {
                // token
                const userToken     = this.$auth.getToken(),
                      queryParams   = {},
                      currentItemId = '';
                Meteor.call( 'getAllLang', ( error, result ) => {
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

                if( userToken ) {
                    // user(s)
                    Meteor.call( 'getUser', userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'UserError, Retry: ' + error;
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.userItems   = this.$lo.sortBy( result.value, 'username' );
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
                    // shipping
                    Meteor.call( 'getShip', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'ShippingError: Retry.';
                        } else if( result.code === 'success'
                        ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.shipItems   = this.$lo.sortBy( result.value, 'shipOrder' ).filter( ( item ) => {
                                return item.isActive === true;
                            } );
                        }
                        else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                    // orders
                    Meteor.call( 'getOrder', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'OrderError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.orderItems  = this.$lo.sortBy( result.value, 'orderNumber' );
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
            productName( itemId ) {
                const product = this.productItems.find( ( item ) => {
                    return item._id === itemId;
                } );
                return product ? product.productName : 'n/a';
            },
            userName( userId ) {
                const userInfo = this.userItems.find( ( item ) => {
                    return item._id === userId;
                } );
                return userInfo ? `${userInfo.username}, ${userInfo.profile.firstName} ${userInfo.profile.lastName}` : ''
            },
            locationName( itemLoc ) {
                const country = this.locationItems.find( ( item ) => {
                    return item._id === itemLoc.addressCountry;
                } );
                const state   = this.locationItems.find( ( item ) => {
                    return item._id === itemLoc.addressState;
                } );
                return `${itemLoc.contactName} (${itemLoc.contactPhone}) | ${itemLoc.streetNumber} ${itemLoc.streetName}, ${itemLoc.addressCity}, ${state.locationName}, ${itemLoc.postalCode} ${country.locationName}`;
            },
            formatCost( value ) {
                return numFormat( value ).format( '0,0.00' );
            },
            saveShip() {
                // Retrieve/get current item/record from the the server/database
                // validate inputs
                let errors = validateShipping( this.ship );
                if( errors.shipOrder || errors.shipType || errors.shipItems || errors.shipMethod || errors.shipBy || errors.shipFor || errors.shipAmount || errors.shipTo || errors.shipDate || errors.shipTrack || errors.shipStatus || errors.shipDesc ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveShip', this.ship, this.itemId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage = true;
                                // capture new/updated record itemId
                                if( result.code === 'inserted' || result.code === 'updated' ) {
                                    this.itemId = result.docId;
                                }
                                this.pageMessage = `${result.code}: ${result.value}`;
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
        },
        created() {
            this.mcLabel = this.$label;
            // New or draft message
            const item   = this.$store.getters[ 'central/getShipOrderItem' ];
            if( item ) {
                this.itemId = item._id;
                this.ship   = {
                    shipOrder : item.shipOrder,
                    shipType  : item.shipType,
                    shipItems : item.shipItems,
                    shipMethod: item.shipMethod,
                    shipBy    : item.shipBy,
                    shipFor   : item.shipFor,
                    shipAmount: item.shipAmount,
                    shipTo    : item.shipTo,
                    shipDate  : this.formatDate( item.shipDate ),
                    shipTrack : item.shipTrack,
                    shipStatus: item.shipStatus,
                    shipLang  : item.shipLang,
                    shipDesc  : item.shipDesc,
                    isActive  : item.isActive
                };
            } else {
                this.itemId = '';
                this.ship   = {
                    shipOrder : '',
                    shipType  : 'Order',
                    shipItems : [],
                    shipMethod: '',
                    shipBy    : '',
                    shipFor   : '',
                    shipAmount: '',
                    shipTo    : '',
                    shipDate  : this.formatDate( Date.now() ),
                    shipTrack : '1234567890',
                    shipStatus: '',
                    shipLang  : this.$constant.getDefaultLanguage(),
                    shipDesc  : '',
                    isActive  : false
                };
            }

            // fetch-data:
            this.fetchData();
        },
    }
</script>
