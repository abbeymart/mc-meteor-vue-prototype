<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.payTest}}</h4>
        </div>
        <div v-if="isMessage" class="w3-container w3-yellow">
            <!-- Used to display errors -->
            <p>{{pageMessage}}</p>
        </div>
        <form class="w3-margin-8">
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="testPay">{{mcLabel.name}}</label>
                        <input type="text" class="form-control" id="testPay"
                               :placeholder="mcLabel.name" maxlength="255" required autofocus
                               v-model="testPay.payName">
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="card-element">Credit or debit card</label>
                        <div id="card-element" v-on:change="changeCard(event)">
                            <!-- a Stripe Element will be inserted here. -->
                        </div>
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary" @click.prevent="testPayment">
                            Stripe - Pay ${{testPay.amount}}
                        </button>
                    </div>
                </div>
            </div>
        </form>
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

    // View components, locales...
    import { Meteor } from 'meteor/meteor';
    import { Session } from 'meteor/session';
    import _ from 'lodash';

    // Stripe configuration
    // client-side secret keys: testSecretKey | liveSecretKey
    const config     = require( '/imports/lib/utils/payment/config.json' );
    // Stripe Test
    const stripeTest = Stripe( config.public.stripe.testPublishableKey );
    // Stripe Live
    const stripeLive = Stripe( config.public.stripe.livePublishableKey );

    export default{
        name    : 'stripePay',
        data() {
            return {
                mcLabel        : {},
                testPay        : {
                    key        : '',
                    locale     : 'auto',
                    payName    : 'Stripe Payment',
                    name       : 'MC',
                    email      : '',
                    productName: '',
                    amount     : 10,
                    currency   : "usd",
                    description: "Example charge",
                    metadata   : {},
                },
                isMessage      : false,
                pageMessage    : '',
                card           : '',
                currentUsername: '',
                itemId         : '',
                itemParams     : '',
                itemParamId    : '',
                validateErrors : '',
            }
        },
        computed: {},
        methods : {
            changeCard( event ){
                if( event.error ) {
                    this.pageMessage = event.error.message;
                } else {
                    this.pageMessage = '';
                }
            },
            // Test payment, validate, pay, manage/display response
            testPayment() {
                // userToken: access key
                const userToken = this.$auth.getToken();

                // TODO: additional payment / customer information, names / addresses (pay / ship)
                const customerInfo = {};
                if( Session.get( 'currentUser' ) ) {
                    const userInfo        = Session.get( 'currentUser' );
                    this.testPay.name     = `${userInfo.profile.firstName} ${userInfo.profile.lastName}`;
                    this.testPay.email    = userInfo.emails[ 0 ].address;
                    this.testPay.metadata = {
                        name       : `${userInfo.profile.firstName} ${userInfo.profile.lastName}`,
                        email      : userInfo.emails[ 0 ].address,
                        orderId    : '',
                        orderNumber: 1001,
                        orderDate  : Date.now(),
                    }
                }

                // TODO: check if customer prefers to store partial card info and/or use it for the current/future transactions...

                // set / validate inputs for testing
                const payInfo = {
                    email      : this.testPay.email,
                    amount     : this.testPay.amount * 100,
                    currency   : this.testPay.currency,
                    description: this.testPay.description,
                    metadata   : this.testPay.metadata,
                };

                let errors          = '';
                this.validateErrors = '';

                // Deprecated
//                Stripe.card.createToken({
//                    number: $('.card-number').val(),
//                    cvc: $('.card-cvc').val(),
//                    exp_month: $('.card-expiry-month').val(),
//                    exp_year: $('.card-expiry-year').val()
//                }, stripeResponseHandler);

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
                                Meteor.call( 'saveChargeCustomerTest', payInfo, payToken, userToken, ( error,
                                    result ) => {
                                    if( error ) {
                                        this.isMessage   = true;
                                        this.pageMessage = `${error}: Payment Error. Please retry`;
                                    } else if( result.code === 'success' ) {
                                        this.isMessage   = true;
                                        this.pageMessage = result.value.status + ':: Payment made successfully. Thank you!';
//                                        this.pageMessage = `${result.code}: ${result.value}`;
                                    } else {
                                        this.isMessage   = true;
                                        this.pageMessage = `${result.value.status} :: ${result.outcome.seller_message} :: ${result.outcome.network_status}`;
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
                    }
                } );
            },
        },
        created(){
            // labels
            this.mcLabel = this.$label;
            if( Session.get( 'currentUser' ) ) {
                const userInfo             = Session.get( 'currentUser' );
                this.testPay.customerName  = `${userInfo.profile.firstName} ${userInfo.profile.lastName}`;
                this.testPay.customerEmail = userInfo.emails[ 0 ].address;
            }
        },
        mounted(){
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
            this.card.addEventListener( 'change', function( event ) {
                if( event.error ) {
                    this.isMessage = true;
                    this.pageMessage = event.error.message;
                } else {
                    this.isMessage = false;
                    this.pageMessage = '';
                }
            } );
        },
    }
</script>
