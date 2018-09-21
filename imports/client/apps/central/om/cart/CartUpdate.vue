<template>
    <div>
        <!--TODO: permit only quantity and description updates-->
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.cartUpdate}}</h4>
        </div>
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <form class="w3-margin-8">
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="tradeProduct">{{mcLabel.product}} {{mcLabel.name}}</label>
                        <select class="form-control" v-model="cart.tradeProduct" id="tradeProduct" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.product}}</option>
                            <option v-for="item in productItems" :value="item._id">
                                {{ item.productName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.tradeProduct}}</span>
                    </div>
                    <div class="form-group">
                        <label for="tradeGroup">{{mcLabel.trade}} {{mcLabel.group}}</label>
                        <select class="form-control" v-model="cart.tradeGroup" id="tradeGroup" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.group}}</option>
                            <option v-for="item in tradeGroups" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.tradeGroup}}</span>
                    </div>
                    <div class="form-group">
                        <label for="tradeFolder">{{mcLabel.folder}}</label>
                        <select class="form-control" v-model="cart.tradeFolder" id="tradeFolder" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.folder}}</option>
                            <option v-for="item in cartFolders" :value="item._id">
                                {{ item.catName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.tradeFolder}}</span>
                    </div>
                    <div class="form-group">
                        <label for="tradeQuantity">{{mcLabel.quantity}}</label>
                        <input type="number" class="form-control" id="tradeQuantity"
                               :placeholder="mcLabel.quantity" maxlength="32"
                               v-model="cart.tradeQuantity" required>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.tradeQuantity}}</span>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="tradeStatus">{{mcLabel.trade}} {{mcLabel.status}}</label>
                        <select class="form-control" v-model="cart.tradeStatus" id="tradeStatus" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.status}}</option>
                            <option v-for="item in tradeStatuses" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.tradeStatus}}</span>
                    </div>
                    <div class="form-group">
                        <label for="tradeDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="tradeDesc" cols="30" rows="5"
                                  :placeholder="mcLabel.desc" v-model="cart.tradeDesc"></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.tradeDesc}}</span>
                    </div>
                    <div class="form-group">
                        <label for="isActive">{{mcLabel.isActive}} </label>
                        <input class="w3-check" type="checkbox" id="isActive" v-model="cart.isActive">
                        <button class="btn btn-primary" @click.prevent="saveTradeItem">
                            {{mcLabel.save}}
                        </button>
                    </div>
                </div>
            </div>
        </form>
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
    </div>
</template>

<style>

</style>
<script>
    // View components, locales...
    import { Meteor } from 'meteor/meteor';
    import { Session } from 'meteor/session';
    import { validateTrade } from'/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    export default{
        name    : 'cartUpdate',
        data() {
            return {
                mcLabel        : {},
                orderItems     : [],
                userItems      : [],
                langItems      : [],
                codeItems      : [],
                orderCatItems  : [],
                productItems   : [],
                cart           : {
                    tradeProduct : '',
                    tradeGroup   : 'B2C',
                    tradeFolder  : 'Cart',
                    tradeQuantity: 1,
                    tradeStatus  : 'CartTrade',
                    tradeOwner   : '',
                    tradeDesc    : '',
                    tradeShipping: 'tbd',
                    tradePayment : 'tbd',
                    isActive     : true,
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
            tradeGroups() {
                const tradeGroup = this.codeItems.find( ( item ) => {
                    return (item.codeName === 'Trade Group' && item.codeCat === 'Trading');
                } );
                return this.codeItems.filter( ( item ) => {
                    return (item.codeCat === 'Trading' && item.parentId === tradeGroup._id);
                } );
            },
            tradeStatuses() {
                const tradeStatus = this.codeItems.find( ( item ) => {
                    return (item.codeName === 'Trade Status' && item.codeCat === 'Trading');
                } );
                return this.codeItems.filter( ( item ) => {
                    return (item.codeCat === 'Trading' && item.parentId === tradeStatus._id);
                } );
            },
            cartFolders() {
                return this.orderCatItems.filter( ( item ) => {
                    return (item.catGroup === 'Cart');
                } );
            },
        },
        methods : {
            // Permit only quantity, and description updates by the customers from CartView
            saveTradeItem() {
                if( Session.get( 'currentTradeCartItem' ) ) {
                    const item  = Session.get( 'currentTradeCartItem' );
                    this.itemId = item._id;
                    this.cart   = {
                        tradeProduct : item.tradeProduct,
                        tradeGroup   : item.tradeGroup,
                        tradeFolder  : item.tradeFolder,
                        tradeQuantity: this.cart.tradeQuantity || item.tradeQuantity,
                        tradeStatus  : item.tradeStatus,
                        tradeOwner   : item.tradeOwner,
                        tradeDesc    : this.cart.tradeDesc || item.tradeDesc,
                        tradeShipping: item.tradeShipping,
                        tradePayment : item.tradePayment,
                        isActive     : item.isActive,
                    };
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Updates permitted from the Cart items only';
                    return false;
                }

                // TODO: Set other inputs as per item session object

                // cast/format number parameters
                this.cart.tradeQuantity = Number(this.cart.tradeQuantity);

                // set the tradeFolder unique identifier for order
                // this.cart.tradeFolder = `${this.cart.tradeOwner}-order#`;

                // validate inputs
                let errors = validateTrade( this.cart );
                if( errors.tradeProduct || errors.tradeGroup || errors.tradeFolder || errors.tradeQuantity || errors.tradeStatus || errors.tradeOwner || errors.tradeDesc || errors.tradeShipping || errors.tradePayment ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        Meteor.call( 'saveTradeItem', this.cart, this.itemId, userToken, ( error, result ) => {
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
                        this.pageMessage = 'inputs-errors: ' + errors;
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
            if( Session.get( 'currentTradeCartItem' ) ) {
                const item  = Session.get( 'currentTradeCartItem' );
                this.itemId = item._id;
                this.cart   = {
                    tradeProduct : item.tradeProduct,
                    tradeGroup   : item.tradeGroup,
                    tradeFolder  : item.tradeFolder,
                    tradeQuantity: item.tradeQuantity,
                    tradeStatus  : item.tradeStatus,
                    tradeOwner   : item.tradeOwner,
                    tradeDesc    : item.tradeDesc,
                    tradeShipping: item.tradeShipping,
                    tradePayment : item.tradePayment,
                    isActive     : item.isActive,
                };
            } else {
                this.itemId = '';
                this.cart   = {
                    tradeProduct : '',
                    tradeGroup   : 'B2C',
                    tradeFolder  : 'Cart',
                    tradeQuantity: 1,
                    tradeStatus  : 'CartTrade',
                    tradeOwner   : '',
                    tradeDesc    : '',
                    tradeShipping: 'tbd',
                    tradePayment : 'tbd',
                    isActive     : true,
                };
            }
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
                // order categories
                Meteor.call( 'getOrderCat', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'OrderCategoryError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage     = false;
                        this.pageMessage   = 'Items available';
                        this.orderCatItems = _.sortBy( result.value, 'catName' );
                        // Default cart folder ID:
                        const folder = result.value.find( ( item ) => {
                            return (item.catName === 'Cart' && item.catGroup === 'Cart');
                        } );
                        this.cart.tradeFolder = folder._id;
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
                        this.productItems = _.sortBy( result.value, 'productName' );
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
            } else {
                this.isMessage   = true;
                this.pageMessage = 'Access-key missing or expired. Please login again.';
            }
        },
    }
</script>