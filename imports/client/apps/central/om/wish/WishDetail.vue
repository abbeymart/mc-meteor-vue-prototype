<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.wishDetail}}</h4>
        </div>
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <form class="w3-margin-8">
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="wishProduct">{{mcLabel.product}} {{mcLabel.name}}</label>
                        <select class="form-control" v-model="wish.wishProduct" id="wishProduct" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.product}}</option>
                            <option v-for="item in productItems" :value="item._id">
                                {{ item.productName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.wishProduct}}</span>
                    </div>
                    <div class="form-group">
                        <label for="wishProductName"> {{mcLabel.wishName}}</label>
                        <input type="text" class="form-control" id="wishProductName"
                               :placeholder="mcLabel.name" maxlength="255"
                               v-model="wish.wishProductName">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.wishProductName}}</span>
                    </div>
                    <div class="form-group">
                        <label for="wishFolder">{{mcLabel.folder}}</label>
                        <select class="form-control" v-model="wish.wishFolder" id="wishFolder" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.folder}}</option>
                            <option v-for="item in wishFolders" :value="item._id">
                                {{ item.catName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.wishFolder}}</span>
                    </div>
                    <div class="form-group">
                        <label for="wishPriority">{{mcLabel.priority}}</label>
                        <select class="form-control" v-model="wish.wishPriority" id="wishPriority" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.priority}}</option>
                            <option v-for="item in priorities" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.wishPriority}}</span>
                    </div>
                    <div class="form-group">
                        <label for="wishQuantity">{{mcLabel.quantity}}</label>
                        <input type="number" class="form-control" id="wishQuantity"
                               :placeholder="mcLabel.quantity" maxlength="32"
                               v-model="wish.wishQuantity" required>
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.wishQuantity}}</span>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="wishUrl">{{mcLabel.path}}</label>
                        <input type="text" class="form-control" id="wishUrl"
                               :placeholder="mcLabel.path" maxlength="255"
                               v-model="wish.wishUrl">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.wishUrl}}</span>
                    </div>
                    <div class="form-group">
                        <label for="wishDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="wishDesc" cols="30" rows="5"
                                  :placeholder="mcLabel.desc" v-model="wish.wishDesc"></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.wishDesc}}</span>
                    </div>
                    <div class="form-group">
                        <label for="isActive">{{mcLabel.isActive}} </label>
                        <input class="w3-check" type="checkbox" id="isActive" v-model="wish.isActive">
                        <button class="btn btn-primary" @click.prevent="saveWishItem">
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
    import { validateWish } from'/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    export default{
        name    : 'wishDetail',
        data() {
            return {
                mcLabel        : {},
                wishItems      : [],
                userItems      : [],
                langItems      : [],
                codeItems      : [],
                orderCatItems  : [],
                productItems   : [],
                wish           : {
                    wishProduct    : '',
                    wishProductName: '',
                    wishFolder     : 'Wish List',
                    wishPriority   : '',
                    wishUrl        : '',
                    wishQuantity   : 1,
                    wishPurchased  : 0,
                    wishDesc       : '',
                    wishOwner      : '',
                    isActive       : true,
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
            wishFolders() {
                return this.orderCatItems.filter( ( item ) => {
                    return (item.catGroup === 'Wish');
                } );
            },
            priorities(){
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Order Priority';
                } );
            },
        },
        methods : {
            saveWishItem() {
                // Set catOwner to currentUser
                if( Session.get( 'currentUser' ) ) {
                    this.wish.wishOwner = Session.get( 'currentUser' )._id;
                }

                // cast number items
                this.wish.wishQuantity  = Number( this.wish.wishQuantity );
                this.wish.wishPurchased = Number( this.wish.wishPurchased );

                // validate inputs
                let errors = validateWish( this.wish );
                if( errors.wishProduct || errors.wishProductName || errors.wishFolder || errors.wishPriority || errors.wishUrl || errors.wishQuantity || errors.wishDesc ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveWishItem', this.wish, this.itemId, userToken, ( error, result ) => {
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
        },
        created(){
            // token
            const userToken     = this.$auth.getToken(),
                  queryParams   = {},
                  currentItemId = '';
            this.mcLabel        = this.$label;
            // New or draft message
            if( Session.get( 'currentOrderWishItem' ) ) {
                const item  = Session.get( 'currentOrderWishItem' );
                this.itemId = item._id;
                this.wish   = {
                    wishProduct    : item.wishProduct,
                    wishProductName: item.wishProductName,
                    wishFolder     : item.wishFolder,
                    wishPriority   : item.wishPriority,
                    wishUrl        : item.wishUrl,
                    wishQuantity   : item.wishQuantity,
                    wishPurchased  : item.wishPurchased,
                    wishDesc       : item.wishDesc,
                    wishOwner      : item.wishOwner,
                    isActive       : item.isActive,
                };
            } else {
                this.itemId = '';
                this.wish   = {
                    wishProduct    : '',
                    wishProductName: '',
                    wishFolder     : 'Wish List',
                    wishPriority   : '',
                    wishUrl        : '',
                    wishQuantity   : 1,
                    wishPurchased  : 0,
                    wishDesc       : '',
                    wishOwner      : '',
                    isActive       : true,
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
