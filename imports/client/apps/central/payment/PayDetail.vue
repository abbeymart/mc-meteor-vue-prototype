<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.payDetail}}</h4>
        </div>
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <form class="w3-margin-8">
            <div class="row">
                <div class="col-sm-6">
                    <!--TODO: Customer and order Information-->
                    <div class="form-group">
                        <label for="orderName">{{mcLabel.orderName}}</label>
                        <select class="form-control" v-model="pay.order.orderName" id="orderName" required autofocus>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.order}}</option>
                            <option v-for="item in orders" :value="item._id">
                                {{ item.orderName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.orderName}}</span>
                    </div>
                    <div class="form-group">
                        <label for="payDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="payDesc" cols="30" rows="5"
                                  :placeholder="mcLabel.desc" v-model="pay.payDesc" required></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.payDesc}}</span>
                    </div>
                </div>
                <div class="col-sm-6">
                    <!--TODO: Billing and Shipping Address, if (v-if) applicable-->
                    <div class="form-group">
                        <!--TODO: show isActive, save and process-payment buttons for new and non-processed orders only-->
                        <label for="isActive">{{mcLabel.isActive}} </label>
                        <input class="w3-check" type="checkbox" id="isActive" v-model="pay.isActive">
                        <button class="btn btn-primary" @click.prevent="savePay">
                            {{mcLabel.save}}
                        </button>
                        <button class="btn btn-primary" @click.prevent="processPay">
                            Process Payment
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
    /**
     * create payment: order (id, cost, ship, desc...), customer, shipAddress, payAddress,
     * action: save or process payment (saveItemStatus: processed)
     */
    // View components, locales...
    import { Meteor } from 'meteor/meteor';
    import { Session } from 'meteor/session';
    import { validatePayment } from'/imports/lib/utils/ValidateRecord';

    export default{
        name    : 'payDetail',
        data() {
            return {
                mcLabel        : {},
                orderItems     : [],
                addressItems   : [],
                userItems      : [],
                langItems      : [],
                codeItems      : [],
                locationItems  : [],
                pay            : {
                    order      : {
                        orderId    : '',
                        orderName  : '',
                        orderDesc  : '',
                        orderAmount: '',
                    },
                    customer   : {
                        email: '',
                        name : '',
                    },
                    billAddress: {
                        address_line1  : '',
                        address_line2  : '',
                        address_city   : '',
                        address_state  : '',
                        address_zip    : '',
                        address_country: '',
                    },
                    shipAddress: {
                        address_line1  : '',
                        address_line2  : '',
                        address_city   : '',
                        address_state  : '',
                        address_zip    : '',
                        address_country: '',
                    },
                    payLang    : 'en-US',
                    payName    : '',
                    payDesc    : '',
                    isActive   : false,
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
        computed: {
            payCategories() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Payment';
                } );
            },
            orders() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Jurisdiction';
                } );
            },
            taxRegions() {
                return this.locationItems.filter( ( item ) => {
                    return item.locationType === 'Region';
                } );
            },
            taxCountries() {
                return this.locationItems.filter( ( item ) => {
                    return item.locationType === 'Country';
                } );
            },
            taxStates() {
                return this.locationItems.filter( ( item ) => {
                    return ((item.locationType === 'State' || item.locationType === 'Province') && (item.parentId = this.tax.taxCountry));
                } );
            },
            taxCities() {
                return this.locationItems.filter( ( item ) => {
                    return ((item.locationType === 'City') && (item.parentId = this.tax.taxState));
                } );
            },
        },
        methods : {
            fetchData(){

            },
            catName( itemId ){
                const catName = this.$lo.find( this.codeItems, { _id: itemId } );
                return catName ? catName.codeName : 'n/a';
            },
            processPay(){
                // Process payment...
            },
            // Retrieve/get current item/record from the the server/database
            savePay() {
                // TODO: validate inputs
                let errors = validatePayment( this.pay );
                if( errors.payDesc || errors.billAddress || errors.order || errors.customer || errors.payName ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'savePay', this.pay, this.itemId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage   = true;
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
        },
        created(){
            // token
            const userToken     = this.$auth.getToken(),
                  queryParams   = {},
                  currentItemId = '';
            this.mcLabel        = this.$label;
            // New or draft message
            if( Session.get( 'currentPayItem' ) ) {
                const item  = Session.get( 'currentPayItem' );
                this.itemId = item._id;
                this.pay    = {
                    order      : {
                        orderId    : '',
                        orderName  : '',
                        orderDesc  : '',
                        orderAmount: '',
                    },
                    customer   : {
                        email: '',
                        name : '',
                    },
                    billAddress: {},
                    shipAddress: {},
                    payLang    : 'en-US',
                    payDesc    : '',
                    isActive   : false,
                };
            } else {
                this.itemId = '';
                this.pay    = {
                    order      : {
                        orderId    : '',
                        orderName  : '',
                        orderDesc  : '',
                        orderAmount: '',
                    },
                    customer   : {
                        email: '',
                        name : '',
                    },
                    billAddress: {},
                    shipAddress: {},
                    payLang    : 'en-US',
                    payDesc    : '',
                    isActive   : false,
                };
            }

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

            // current user information / record
            let currentUser = '';
            if( Session.get( 'currentUser' ) ) {
                currentUser = Session.get( 'currentUser' );
            }

            // currentUsername
            if( currentUser ) {
                this.currentUsername = `${currentUser.username} | ${currentUser.profile.firstName} ${currentUser.profile.lastName}`;
            }
        },
    }
</script>
