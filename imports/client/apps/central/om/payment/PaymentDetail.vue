<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.orderPayDetail}}</h4>
        </div>
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <form class="w3-margin-8">
            <div class="row">
                <div class="col-sm-6">
                    <!--payType: select-->
                    <div class="form-group">
                        <label for="orderNumber">{{mcLabel.orderNumber}}</label>
                        <!--TODO: or, enter orderNumber as input-->
                        <select class="form-control" v-model="orderPay.orderNumber" id="orderNumber" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.orderNumber}}</option>
                            <option v-for="item in payOrderItems" :value="item.tradePayment.orderNumber">
                                {{ item.tradePayment.orderNumber
                                }} | {{item.chargeInfo.email}} | {{fullName( item.customerId )}}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.orderNumber}}</span>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-4">
                            <label for="orderTotal">{{mcLabel.orderTotalTax}}</label>
                            <input type="text" class="form-control" id="orderTotal"
                                   :placeholder="mcLabel.orderTotalTax" maxlength="50" disabled
                                   :value="totalCost">
                        </div>
                        <div class="col-sm-4">
                            <label for="orderPaid">{{mcLabel.payAmount}}</label>
                            <input class="form-control" id="orderPaid"
                                   :placeholder="mcLabel.payAmount" maxlength="50" disabled
                                   :value="totalPaid">
                        </div>
                        <div class="col-sm-4">
                            <label for="orderPayDue">{{mcLabel.payDue}}</label>
                            <input class="form-control" id="orderPayDue"
                                   :placeholder="mcLabel.payDue" maxlength="50" disabled
                                   :value="totalDue">
                        </div>
                    </div>
                    <div class="form-group">
                    </div>
                    <div class="form-group">
                    </div>
                    <div class="form-group">
                        <label for="payAmount">{{mcLabel.amountPay}}</label>
                        <input type="number" min="0.0" step="0.01" class="form-control" id="payAmount"
                               :placeholder="mcLabel.amountPay" maxlength="255"
                               v-bind="orderPay.payAmount">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.payAmount}}</span>
                    </div>
                    <div class="form-group">
                        <label for="payCurrency">{{mcLabel.currency}}</label>
                        <select class="form-control" v-model="orderPay.payCurrency" id="payCurrency" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.currency}}</option>
                            <option v-for="item in payCurrencies" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.payCurrency}}</span>
                    </div>
                    <div class="form-group">
                        <label for="payStatus">{{mcLabel.payStatus}}</label>
                        <select class="form-control" v-model="orderPay.payStatus" id="payStatus" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.type}}</option>
                            <option v-for="item in payStatuses" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.payStatus}}</span>
                    </div>
                    <div class="form-group">
                        <label for="payMethod">{{mcLabel.payMethod}}</label>
                        <select class="form-control" v-model="orderPay.payMethod" id="payMethod" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.payMethod}}</option>
                            <option v-for="item in payMethods" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.payStatus}}</span>
                    </div>
                    <!--payDesc: text-->
                    <div class="form-group">
                        <label for="payDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="payDesc" cols="30" rows="5"
                                  :placeholder="mcLabel.desc" v-model="orderPay.payDesc"></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.payDesc}}</span>
                    </div>
                    <div class="form-group">
                        <label for="isActive">{{mcLabel.isActive}} </label>
                        <input class="w3-check" type="checkbox" id="isActive" v-model="orderPay.isActive">
                        <button class="btn btn-primary" @click.prevent="saveTradePayment">
                            {{mcLabel.save}}
                        </button>
                    </div>
                </div>
                <div class="col-sm-6">
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
    import { Session } from 'meteor/session';
    import { validatePayProvider, validateTradePayment } from '/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    const numFormat = require( 'numeral' );
    const randomize = require( 'randomatic' );

    export default {
        name    : 'orderPaymentDetail',
        data() {
            return {
                mcLabel         : {},
                orderItems      : [],
                orderCatItems   : [],
                payItems        : [],
                userItems       : [],
                langItems       : [],
                codeItems       : [],
                locationItems   : [],
                orderPay        : {
                    orderNumber: '',
                    payAmount  : 0.00,
                    payDesc    : '',
                    payMethod  : '',
                    payStatus  : '',
                    payCurrency: 'USD',
                    payEmail   : '',
                    isActive   : false
                },
                orderTotalCost  : 0.00,
                orderTotalPaid  : 0.00,
                orderPayStatus  : '',
                orderPayCurrency: 'US$',
                pageMessage     : '',
                isMessage       : false,
                currentUsername : '',
                itemId          : '',
                itemParams      : '',
                itemParamId     : '',
                validateErrors  : '',
            }
        },
        computed: {
            payMethods() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Payment';
                } );
            },
            payStatuses() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Payment Status';
                } );
            },
            payCurrencies() {
                const parentInfo = this.codeItems.find( ( item ) => {
                    return item.codeName === 'Currency';
                } );
                if( parentInfo ) {
                    return this.codeItems.filter( ( item ) => {
                        return item.codeCat === 'Measurement' && item.parentId === parentInfo._id;
                    } );
                }

            },
            payLocations() {
                return this.locationItems.filter( ( item ) => {
                    return item.locationType === 'Country';
                } );
            },
            payOrderItems() {
                // order records with recordType of invoice-payment
                return this.payItems.filter( ( item ) => {
                    return (item.recordType === 'invoice-payment'
                            && item.chargeInfo.paymentStatus === 'Invoice');
                } );
            },
            totalCost() {
                // return orderTotalCostTax
                if( !this.orderPay.orderNumber ) return;
                const orderCost = this.payItems.find( ( item ) => {
                    // return (item.orderNumber === this.orderPay.orderNumber || item.tradePayment.orderNumber === this.orderPay.orderNumber);
                    if (item.orderNumber) return (item.orderNumber === this.orderPay.orderNumber);
                    if (item.tradePayment.orderNumber) return (item.tradePayment.orderNumber === this.orderPay.orderNumber);
                    return false;
                } );

                if( orderCost ) {
                    this.orderTotalCost   = orderCost.tradePayment.tradeCostTotalPlusTax;
                    this.orderPayCurrency = orderCost.tradePayment.tradeCurrency;
                    return `${this.orderPayCurrency}${numFormat( orderCost.tradePayment.tradeCostTotalPlusTax ).format( '0,0.00' )}`;
                }
            },
            totalPaid() {
                // return orderTotalPaid (part-payments)
                if( !this.orderPay.orderNumber ) return;

                let amountPaid      = 0.00,
                    priorAmountPaid = 0.00;

                const orderPayInfo = this.payItems.filter( ( item ) => {
                    return (item.orderNumber === this.orderPay.orderNumber
                            && item.recordType === 'invoice-payment'
                            && item.chargeInfo.paymentStatus !== 'Invoice');
                } );

                // console.log( orderPayInfo );

                if( orderPayInfo ) {
                    if( orderPayInfo.length > 1 ) {
                        orderPayInfo.forEach( ( item ) => {
                            "use strict";
                            priorAmountPaid += item.chargeInfo.amount;
                        } );
                    }
                    if( orderPayInfo.length === 1 ) {
                        priorAmountPaid += orderPayInfo[ 0 ].chargeInfo.amount;
                    }
                }
                // Total amount paid, including prior part-payments, for the order, from server-side
                amountPaid = (Number( this.orderPay.payAmount ) + priorAmountPaid) / 100;

                const totalCost = this.orderTotalCost;

                if( amountPaid === totalCost ) {
                    this.orderPayStatus = 'Paid full';
                }

                if( amountPaid < totalCost ) {
                    this.orderPayStatus = 'Paid part';
                }

                // optional/rare-step, include/return an alert to indicate over-payment, for possible refund or correction* (return) to payment processing
                if( amountPaid > totalCost ) {
                    this.orderPayStatus = 'Paid above';
                }

                this.orderTotalPaid = amountPaid;
                return `${this.orderPayCurrency}${numFormat( amountPaid ).format( '0,0.00' )}`;
            },
            totalDue() {
                // return orderTotalCost
                if( !this.orderPay.orderNumber ) return;
                return `${this.orderPayCurrency}${numFormat( this.orderTotalCost - this.orderTotalPaid ).format( '0,0.00' )}`;
            },
        },
        methods : {
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
                        this.langItems   = _.sortBy( result.value, 'langName' ).filter( ( item ) => {
                            return item.isActive === true;
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );

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
                    // user(s)
                    Meteor.call( 'getUser', userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'UserError, Retry: ' + error;
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.userItems   = _.sortBy( result.value, 'username' );
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
                    // payments
                    // TODO: filter items, queryParams to include invoice-items only
                    Meteor.call( 'getPay', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'PaymentError: Retry.';
                        } else if( result.code === 'success'
                        ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.payItems    = result.value.filter( ( item ) => {
                                return (item.recordType === 'invoice-payment');
                                // TODO: exclude pay-status ('chargeInfo.paymentStatus': { $or: [ 'Paid', 'Paid full', 'Paid part', 'Paid above' ] })
                                /**
                                 *
                                 && !(item.chargeInfo.paymentStatus === 'Paid' ||item.chargeInfo.paymentStatus === 'Paid full' || item.chargeInfo.paymentStatus === 'Paid part' || item.chargeInfo.paymentStatus === 'Paid above' )
                                 */
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
                            this.orderItems  = _.sortBy( result.value, 'orderNumber' );
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
            // Retrieve/get current item/record from the the server/database
            saveTradePayment() {
                // cast number items, amount in 100 units (align with stripe payment,TODO: move to server side?)
                this.orderPay.payAmount = Number( this.orderPay.payAmount ) * 100;
                // validate inputs
                let errors              = validateTradePayment( this.orderPay );
                if( errors.orderNumber || errors.payStatus || errors.payMethod || errors.payAmount || errors.payDesc ) {
                    this.validateErrors = errors;
                }

                // TODO: payEmail, payCurrency (default: USD)
                const currentUser = Session.get( 'currentUser' );
                if( currentUser ) {
                    this.orderPay.payEmail = this.orderPay.payEmail || currentUser.emails[ 0 ].address;
                }

                this.orderPay.payCurrency = this.orderPay.payCurrency || 'USD';

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveTradePayment', this.orderPay, userToken, ( error, result ) => {
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
                        this.pageMessage = 'inputs-errors: ' + JSON.stringify(errors);
                    }
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Please login';
                }
            },
            fullName( userId ) {
                const customerInfo = this.userItems.find( ( item ) => {
                    return item._id = userId;
                } );
                return customerInfo ? `${customerInfo.profile.firstName} ${customerInfo.profile.lastName}` : 'n/a';
//                return `${customerInfo.profile.firstName} ${customerInfo.profile.lastName}`;
            },
        },
        created() {
            // token
            const userToken     = this.$auth.getToken(),
                  queryParams   = {},
                  currentItemId = '';
            this.mcLabel        = this.$label;
            // New or draft message
            if( Session.get( 'currentOrderPaymentItem' ) ) {
                const item       = Session.get( 'currentOrderPaymentItem' );
                this.itemId      = item._id;
                this.payProvider = {
                    payProvider: item.payProvider,
                    payType    : item.payType,
                    payEnv     : item.payEnv,
                    payAccess  : item.payAccess,
                    payLocation: item.payLocation,
                    payEndPoint: item.payEndPoint,
                    payLocale  : item.payLocale,
                    payOwner   : item.payOwner,
                    payDesc    : item.payOwner,
                    isActive   : item.isActive
                };
            } else {
                this.itemId      = '';
                this.payProvider = {
                    payProvider: '',
                    payType    : '',
                    payEnv     : '',
                    payAccess  : '',
                    payLocation: '',
                    payEndPoint: '',
                    payLocale  : 'en-US',
                    payOwner   : '',
                    payDesc    : '',
                    isActive   : false
                };
            }

            // fetch data
            this.fetchData();
        },
    }
</script>