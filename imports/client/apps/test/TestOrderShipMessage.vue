<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.testOrderShipMessage}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="orderNumber">{{mcLabel.orderNumber}}</label>
                        <select class="form-control" v-model="orderNumber" id="orderNumber" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.orderNumber}}</option>
                            <option v-for="item in orderItems" :value="item.orderNumber">
                                {{ item.orderNumber }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="shipId">{{mcLabel.ship}}</label>
                        <select class="form-control" v-model="shipParams" id="shipId" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.shipItem}}</option>
                            <option v-for="item in orderShipItems" :value="item">
                                {{ item.shipOrder }} | {{item.shipTo}}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="col-sm-6">
                    <button class="btn btn-primary" @click.prevent="testOrderMessage">{{mcLabel.testOrderShipMessage}}
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
        name      : 'testOrderShipMessage',
        components: {},
        data() {
            return {
                mcLabel    : {},
                orderItems : [],
                shipItems  : [],
                orderNumber: '',
                shipId     : '',
                shipParams : {},
                pageMessage: '',
                isMessage  : false,
            }
        },
        computed  : {
            orderShipItems() {
                return this.shipItems.filter( item => {
                    return item.shipOrder === this.orderNumber;
                } );
            }
        },
        methods   : {
            fetchData() {
                // token
                const userToken     = this.$auth.getToken(),
                      currentItemId = '';
                let queryParams     = {};
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
                    // get items
                    Meteor.call( 'getShip', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'ItemError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.shipItems   = this.$lo.sortBy( result.value, 'orderNumber' );
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
            testOrderMessage() {
                // validate inputs:
                const validOrder = this.$validate.isStringAlpha( this.orderNumber );

                const shipId = this.shipParams._id;

                // token / access key
                const userToken = this.$auth.getToken();

                // perform action
                if( userToken ) {
                    if( validOrder ) {
                        // reset validateErrors
                        // this.validateErrors = '';
                        Meteor.call( 'sendShipEmail', this.shipParams, shipId, userToken, ( error, result ) => {
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
