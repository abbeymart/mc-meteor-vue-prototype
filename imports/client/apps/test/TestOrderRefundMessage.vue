<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.testOrderRefundMessage}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="form-group col-sm-4">
                    <label for="orderNumber">{{mcLabel.orderNumber}}</label>
                    <select class="form-control" v-model="orderNumber" id="orderNumber" required>
                        <option disabled value="">{{mcLabel.select}} {{mcLabel.orderNumber}}</option>
                        <option v-for="item in orderItems" :value="item.orderNumber">
                            {{ item.orderNumber }}
                        </option>
                    </select>
                </div>
                <div v-if="orderNumber" class="form-group col-sm-4">
                    <label for="payId">{{mcLabel.refund}}</label>
                    <select class="form-control" v-model="refundId" id="payId" required>
                        <option disabled value="">{{mcLabel.select}} {{mcLabel.refund}}</option>
                        <option v-for="item in refundIds" :value="item._id">
                            {{ item.orderNumber }} | {{item._id}}
                        </option>
                    </select>
                </div>
                <div class="col-sm-4">
                    <button class="btn btn-primary" @click.prevent="testRefundMessage">{{mcLabel.testOrderRefundMessage}}
                    </button>
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

    export default {
        name      : 'testOrderRefundMessage',
        components: {},
        data() {
            return {
                mcLabel    : {},
                orderItems : [],
                refundItems: [],
                payItems   : [],
                orderNumber: '',
                refundId   : '',
                pageMessage: '',
                isMessage  : false,
            }
        },
        computed  : {
            refundIds() {
                return this.refundItems.filter(item => {
                    return item.orderNumber === this.orderNumber;
                })
            }
        },
        methods   : {
            fetchData() {
                // token
                const userToken     = this.$auth.getToken(),
                      queryParams   = {},
                      currentItemId = '';
                if( userToken ) {
                    // get items
                    Meteor.call( 'getOrder', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'ItemError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.orderItems  = this.$lo.sortBy( result.value, 'orderNumber' );
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                    // get refund-items
                    Meteor.call( 'getRefund', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'ItemError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.refundItems = result.value;
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
            testRefundMessage() {
                // validate inputs:
                const validOrder = this.$validate.isStringAlpha( this.orderNumber );

                // token / access key
                const userToken = this.$auth.getToken();

                // perform action
                if( userToken ) {
                    if( validOrder ) {
                        // reset validateErrors
                        // this.validateErrors = '';
                        Meteor.call( 'sendRefundEmail', this.orderNumber, this.refundId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                console.log( result );
                                this.isMessage   = true;
                                this.pageMessage = `${result.code}: ${result.value}`;
                            }
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = 'inputs-errors: valid order required ';
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

            // get data
            this.fetchData();
        },
    }
</script>
