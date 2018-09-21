<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.testOrderReturnMessage}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="orderNumber">{{mcLabel.orderNumber}}</label>
                    <select class="form-control" v-model="orderNumber" id="orderNumber" required>
                        <option disabled value="">{{mcLabel.select}} {{mcLabel.orderNumber}}</option>
                        <option v-for="item in orderItems" :value="item.orderNumber">
                            {{ item.orderNumber }}
                        </option>
                    </select>
                </div>
                <div class="col-sm-6">
                    <button class="btn btn-primary" @click.prevent="testReturnMessage">{{mcLabel.testOrderReturnMessage}}
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
        name      : 'testOrderReturnMessage',
        components: {},
        data() {
            return {
                mcLabel    : {},
                orderItems : [],
                orderNumber: '',
                pageMessage: '',
                isMessage  : false,
            }
        },
        computed  : {},
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
                            this.orderItems  = result.value.filter(item => {
                                const isItemReturn = item.orderItems.some(ret => {
                                    return ret.isReturn;
                                });
                                return (item.isReturn || isItemReturn);
                            });
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
            testReturnMessage() {
                // validate inputs:
                const validOrder = this.$validate.isStringAlpha( this.orderNumber );

                // token / access key
                const userToken = this.$auth.getToken();
                const returnId  = '';

                // perform action
                if( userToken ) {
                    if( validOrder ) {
                        // reset validateErrors
                        // this.validateErrors = '';
                        Meteor.call( 'sendReturnEmail', this.orderNumber, userToken, ( error, result ) => {
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
