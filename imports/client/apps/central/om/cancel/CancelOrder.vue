<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.orderCancel}}</h4>
        </div>
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <form class="w3-margin-8">
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="orderNumber">{{mcLabel.orderNumber}}</label>
                        <!--TODO: or, enter orderNumber as input - optional??-->
                        <select class="form-control" v-model="orderCancel.orderNumber" id="orderNumber" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.orderNumber}}</option>
                            <option v-for="item in orderItems" :value="item.orderNumber">
                                {{ item.orderNumber}}| {{fullName( item.orderOwner )}}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.orderNumber}}</span>
                    </div>
                    <div class="form-group">
                        <label for="isCancel">{{mcLabel.isCancel}} </label>
                        <input class="w3-check" type="checkbox" id="isCancel" v-model="orderCancel.isCancel">
                        <button class="btn btn-primary" @click.prevent="cancelOrder">
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
    import { validatePayProvider, validateCancelOrder } from '/imports/lib/utils/ValidateRecord';

    export default {
        name    : 'cancelOrder',
        data() {
            return {
                mcLabel        : {},
                orderItems     : [],
                userItems      : [],
                productItems   : [],
                orderCancel    : {
                    orderNumber: '',
                    isCancel   : false,
                },
                pageMessage    : '',
                isMessage      : false,
                currentUsername: '',
                itemId         : '',
                itemParams     : '',
                itemParamId    : '',
                validateErrors : '',
            }
        },
        computed: {},
        methods : {
            fetchData() {
                // token
                const userToken     = this.$auth.getToken(),
                      currentItemId = '';
                let queryParams     = {};

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
                        } else if( result.code === 'success'
                        ) {
                            this.isMessage    = false;
                            this.pageMessage  = 'Items available';
                            this.productItems = this.$lo.sortBy( result.value, 'productName' ).filter( ( item ) => {
                                return item.isActive === true;
                            } );
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                    // orders
                    queryParams = {
                        isCancel  : false,
                        allShipped: false,
                    };
                    Meteor.call( 'getOrder', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'OrderError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            console.log(result.value);
                            this.orderItems  = result.value;
                            /*this.orderItems  = result.value.filter( ( item ) => {
                                return (!item.isCancel && !item.allShipped && item.isActive);
                            } );*/
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
            fullName( userId ) {
                const customerInfo = this.userItems.find( ( item ) => {
                    return item._id = userId;
                } );
                return customerInfo ? `${customerInfo.profile.firstName} ${customerInfo.profile.lastName}` : 'n/a';
//                return `${customerInfo.profile.firstName} ${customerInfo.profile.lastName}`;
            },
            // Retrieve/get current item/record from the the server/database
            cancelOrder() {
                // validate inputs
                let errors = validateCancelOrder( this.orderCancel );
                if( errors.orderNumber || errors.isCancel ) {
                    this.validateErrors = errors;
                }

                // console.log(errors);

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'cancelOrder', this.orderCancel, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage = true;
                                // handle cancelResult and tradeEmail messages
                                const [ cancelResult, tradeEmail ] = result;
                                const shipMsg                                 = (cancelResult || !this.$lo.isEmpty( cancelResult )) ? `${cancelResult.code}: ${cancelResult.value}` : 'No cancellation message - contact Support';
                                const emailMsg                                = (tradeEmail || !this.$lo.isEmpty( tradeEmail )) ? `${tradeEmail.code}: ${tradeEmail.value}` : 'N/A';

                                this.itemId      = (cancelResult || !this.$lo.isEmpty( cancelResult )) ? cancelResult.docId : '';
                                this.pageMessage = `Cancel-Order: ${shipMsg} | Email: ${emailMsg}`;
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
        },
        created() {
            // locales
            this.mcLabel = this.$label;
            // New or draft message

            // fetch data
            this.fetchData();
        },
    }
</script>
