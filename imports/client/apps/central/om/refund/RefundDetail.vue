<template>
    <!--TODO: refund payment (amount < totalRefundable) for cancelled/returned-items-->
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.refundDetail}}</h4>
        </div>
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <form class="w3-margin-8">
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="orderNumber">{{mcLabel.orderNumber}} {{mcLabel.toRefund}}</label>
                        <select class="form-control" v-model="refund.orderNumber" id="orderNumber" required
                                v-on:change="totalRefundableCost">
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.orderNumber}} {{mcLabel.toRefund}}
                            </option>
                            <option v-for="item in currentOrders" :value="item.orderNumber">
                                {{ item.orderNumber}}| {{fullName( item.orderOwner )}}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.orderNumber}}</span>
                    </div>
                    <div class="form-group">
                        <label for="amountRefundable">{{mcLabel.amount}} {{mcLabel.refundable}}</label>
                        <input type="text" class="form-control" id="amountRefundable"
                               :placeholder="mcLabel.refundable" maxlength="32"
                               :value="totalRefundableLabel" required disabled>
                    </div>
                    <div class="form-group">
                        <label for="amountPay">{{mcLabel.amount}} {{mcLabel.toRefund}}</label>
                        <input type="number" min="0.00" step="0.01" class="form-control" id="amountPay"
                               :placeholder="mcLabel.toRefund" maxlength="32"
                               v-model="refund.amount" required>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.amount}}</span>
                    </div>
                    <div class="form-group">
                        <label for="currency">{{mcLabel.currency}}</label>
                        <select class="form-control" v-model="refund.currency" id="currency" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.currency}}</option>
                            <option v-for="item in currencies" :value="item.codeName">
                                {{ item.codeName}}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.currency}}</span>
                    </div>
                    <div class="form-group">
                        <label for="method">{{mcLabel.refund}} {{mcLabel.method}}</label>
                        <select class="form-control" v-model="refund.method" id="method" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.refund}} {{mcLabel.method}}</option>
                            <option v-for="item in refundMethods" :value="item.codeName">
                                {{ item.codeName}}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.method}}</span>
                    </div>
                    <div class="form-group">
                        <label for="desc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="desc" cols="30" rows="5"
                                  :placeholder="mcLabel.desc" v-model="refund.desc"></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.desc}}</span>
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary" @click.prevent="refundOrderPayment">
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
    import { Session } from 'meteor/session';
    import { validateRefund } from '/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    const numFormat = require( 'numeral' );

    export default {
        name    : 'refundDetail',
        data() {
            return {
                mcLabel             : {},
                codeItems           : [],
                orderItems          : [],
                payItems            : [],
                userItems           : [],
                productItems        : [],
                refundItems         : [],
                refund              : {
                    orderNumber: '',
                    amount     : 0.00,
                    currency   : this.$constant.getDefaultCurrency() || 'USD',
                    method     : 'Credit Card',
                    desc       : '',
                },
                totalRefunded       : 0.00,
                totalPayment        : 0.00,
                totalRefundable     : 0.00,
                totalRefundableLabel: '',
                pageMessage         : '',
                isMessage           : false,
                currentUsername     : '',
                itemId              : '',
                itemParams          : '',
                itemParamId         : '',
                validateErrors      : '',
            }
        },
        computed: {
            currentOrders() {
                // return current order items, with isCancel or any of its order-items isCancel
                const orders = this.orderItems.filter( ( item ) => {
                    // check order-items cancel status
                    const orderItem = item.orderItems.some( ( item ) => {
                        return item.isCancel === true;
                    } );
                    return (item.isCancel === true || orderItem);
                } );
                return orders ? orders : [];
            },
            refundMethods() {
                const parentInfo = this.codeItems.find( ( item ) => {
                    return (item.codeName === 'Refund');
                } );
                return this.codeItems.filter( ( item ) => {
                    return (item.codeCat === 'Measurement' && item.parentId === parentInfo._id);
                } );
            },
            currencies() {
                const parentInfo = this.codeItems.find( ( item ) => {
                    return (item.codeName === 'Currency');
                } );
                return this.codeItems.filter( ( item ) => {
                    return (item.codeCat === 'Measurement' && item.parentId === parentInfo._id);
                } );
            },
            totalRefundableCost() {
                // refundableAmount = totalPaid - refundedAmount
                // payInfo (full and/or partial payments) for cancelled order/order-items
                const payInfo = this.payItems.filter( ( pay ) => {
                    return (pay.orderNumber === this.refund.orderNumber
                            && pay.chargeInfo.paymentStatus !== 'Invoice' );
                } );

                console.log(payInfo);

                // Determine amount already refunded
                const refundInfo = this.refundItems.filter( ( refund ) => {
                    return (refund.orderNumber === this.refund.orderNumber);
                } );

                let refundedAmount = 0.0;
                if( refundInfo.length > 0 ) {
                    refundInfo.forEach( ( refund ) => {
                        refundedAmount += refund.amount;
                    } );
                }
                this.totalRefunded = refundedAmount / 100;
                // convert 100 units to whole money (e.g. cents to dollars)
                // refundedAmount = refundedAmount/100;

                /*totalPayment:570.845
                totalRefundable:570.845
                totalRefundableLabel:"USD570.85"
                totalRefunded:1850*/

                // use default store currency ( constants-locale or TODO: from settings collection)
                let payCurrency = this.$constant.getDefaultCurrency() || 'USD';
                // amount-paid (total refundable to cancelled order / order-items
                if( payInfo.length > 0 ) {
                    let amountPaid = 0.00;
                    payInfo.forEach( ( paid ) => {
                        amountPaid += paid.chargeInfo.amount;
                        payCurrency = paid.chargeInfo.currency.toUpperCase();
                    } );
                    // convert 100 units to whole money (e.g. cents to dollars)
                    const refundable          = (amountPaid - refundedAmount)/100;
                    this.totalPayment         = amountPaid/100;
                    this.totalRefundable      = refundable;
                    this.totalRefundableLabel = `${payCurrency}${numFormat( refundable ).format( '0,0.00' )}`;
                    return `${payCurrency}${numFormat( refundable ).format( '0,0.00' )}`;
                }
            }
        },
        methods : {
            fetchData() {
                // token
                const userToken     = this.$auth.getToken(),
                      queryParams   = {},
                      currentItemId = '';

                if( userToken ) {
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
                    // products
                    Meteor.call( 'getProduct', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'ProductError: Retry.';
                        } else if( result.code === 'success'
                        ) {
                            this.isMessage    = false;
                            this.pageMessage  = 'Items available';
                            this.productItems = _.sortBy( result.value, 'productName' ).filter( ( item ) => {
                                return item.isActive === true;
                            } );
                        } else {
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
                            // TODO: implement refundable rule of of order processed within #days
                            this.orderItems  = _.sortBy( result.value, 'orderNumber' );
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                    // payments
                    Meteor.call( 'getPay', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'PayError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.payItems    = _.sortBy( result.value, 'recordType' );
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                    // refunds
                    Meteor.call( 'getRefund', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'RefundError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.refundItems = _.sortBy( result.value, 'orderNumber' );
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
            fullName( userId ) {
                const customerInfo = this.userItems.find( ( item ) => {
                    return item._id = userId;
                } );
                return customerInfo ? `${customerInfo.profile.firstName} ${customerInfo.profile.lastName}` : 'n/a';
//                return `${customerInfo.profile.firstName} ${customerInfo.profile.lastName}`;
            },
            // Retrieve/get current item/record from the the server/database
            refundOrderPayment() {
                // cast amount into number
                this.refund.amount = Number( this.refund.amount );

                // validate inputs
                const errors = validateRefund( this.refund );
                if( errors.orderNumber || errors.amount || errors.currency || errors.method || errors.desc ) {
                    this.validateErrors = errors;
                }

                // amount-to-refund must be <= totalRefundable
                if( this.refund.amount > this.totalRefundable ) {
                    this.isMessage   = true;
                    this.pageMessage = 'Amount to refund may not exceed total refundable';
                    return;
                }
                // convert money to 100 units (e.g. dollars to cents)
                this.refund.amount = this.refund.amount * 100;

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'refundPayment', this.refund, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage = true;
                                // capture new/updated record itemId
                                const [ refundResult, tradeEmail ] = result;
                                const shipMsg                                 = (refundResult || !this.$lo.isEmpty( refundResult )) ? `${refundResult.code}: ${refundResult.value}` : 'No refund message - contact Support';
                                const emailMsg                                = (tradeEmail || !this.$lo.isEmpty( tradeEmail )) ? `${tradeEmail.code}: ${tradeEmail.value}` : 'N/A';

                                this.itemId      = (refundResult || !this.$lo.isEmpty( refundResult )) ? refundResult.docId : '';
                                this.pageMessage = `Refund: ${shipMsg} | Email: ${emailMsg}`;
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
                // convert money back from units to whole, cents to dollars
                this.refund.amount = this.refund.amount / 100;
            },
        },
        created() {
            // locales
            this.mcLabel = this.$label;
            // fetch data
            this.fetchData();
        },
    }
</script>