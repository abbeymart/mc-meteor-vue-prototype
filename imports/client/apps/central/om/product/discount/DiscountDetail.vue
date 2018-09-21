<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4 class="w3-left"><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.discountDetail}}</h4>
        </div>
        <hr>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <fieldset>
                        <legend><h4>{{mcLabel.tradeDiscount}}</h4></legend>
                        <div class="form-group">
                            <label for="discountCode">{{mcLabel.discount}} {{mcLabel.code}}</label>
                            <input type="text" class="form-control" id="discountCode"
                                   :placeholder="mcLabel.code" maxlength="32"
                                   v-model="discount.code" required>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.code}}</span>
                        </div>
                        <div class="form-group">
                            <label for="discountAmount">{{mcLabel.discount}}</label>
                            <input type="number" min="0" class="form-control" id="discountAmount"
                                   :placeholder="mcLabel.discount" maxlength="32"
                                   v-model="discount.amount">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.amount}}</span>
                        </div>
                        <div class="form-group">
                            <label for="discountUnit">{{mcLabel.discountUnit}}</label>
                            <input type="text" class="form-control" id="discountUnit"
                                   :placeholder="mcLabel.discountUnit" maxlength="12"
                                   v-model="discount.unit">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.unit}}</span>
                        </div>
                        <div class="form-group">
                            <label for="discountDesc">{{mcLabel.desc}}</label>
                            <textarea class="form-control" id="discountDesc" cols="30" rows="5"
                                      :placeholder="mcLabel.desc" v-model="discount.desc"></textarea>
                            <span v-if="validateErrors" class="alert-warning">{{validateErrors.desc}}</span>
                        </div>
                    </fieldset>
                </div>
                <div class="col-sm-6">
                    <fieldset>
                        <legend><h4>{{mcLabel.tradeTerm}}</h4></legend>
                        <div class="form-group">
                            <label for="priceGroup">{{mcLabel.group}}</label>
                            <select class="form-control" v-model="discount.group" id="priceGroup">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.group}}</option>
                                <option v-for="item in userGroups" :value="item._id">
                                    {{ item.codeName }}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.group}}</span>
                        </div>
                        <div class="form-group">
                            <label for="minQuantity">{{mcLabel.minQuantity}}</label>
                            <input type="number" min="0" class="form-control" id="minQuantity"
                                   :placeholder="mcLabel.minQuantity" maxlength="255"
                                   v-model="discount.minQuantity">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.minQuantity}}</span>
                        </div>
                        <div class="form-group">
                            <label for="maxQuantity">{{mcLabel.maxQuantity}}</label>
                            <input type="number" min="0" class="form-control" id="maxQuantity"
                                   :placeholder="mcLabel.maxQuantity" maxlength="255"
                                   v-model="discount.maxQuantity">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.maxQuantity}}</span>
                        </div>
                        <div class="form-group">
                            <label for="discountStart">{{mcLabel.startDate}}</label>
                            <input type="date" class="form-control" id="discountStart"
                                   :placeholder="mcLabel.startDate" maxlength="64"
                                   v-model="discount.startDate">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.startDate}}</span>
                        </div>
                        <div class="form-group">
                            <label for="discountEnd">{{mcLabel.endDate}}</label>
                            <input type="date" class="form-control" id="discountEnd"
                                   :placeholder="mcLabel.endDate" maxlength="64"
                                   v-model="discount.endDate">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.startDate}}</span>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-4">
                                <label for="beforeTax">{{mcLabel.discountBeforeTax}}</label>
                                <input class="w3-check" type="checkbox" id="beforeTax" v-model="discount.beforeTax">
                            </div>
                            <div class="col-sm-4">
                                <label for="isActive">{{mcLabel.isActive}} </label>
                                <input class="w3-check" type="checkbox" id="isActive" v-model="discount.isActive">
                            </div>
                            <div class="col-sm-4">
                                <button class="btn btn-primary" @click.prevent="saveDiscount">{{mcLabel.save}}</button>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
            <div class="row">
                <div v-if="isMessage" class="w3-container w3-yellow">
                    <p>{{pageMessage}}</p>
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
    import { validateDiscount } from '/imports/lib/utils/ValidateRecord';

    export default {
        name      : 'orderProductDiscountDetail',
        components: {},
        data() {
            return {
                mcLabel       : {},
                codeItems     : [],
                orderCatItems : [],
                locationItems : [],
                taxItems      : [],
                userItems     : [],
                langItems     : [],
                productItems  : [],
                groupItems    : [],
                discount      : {
                    code       : '',
                    amount     : 0.00,
                    unit       : '%',
                    startDate  : this.formatDate( Date.now() ),
                    endDate    : this.formatDate( Date.now() ),
                    group      : '',
                    minQuantity: 1,
                    maxQuantity: 0,
                    desc       : '',
                    beforeTax  : true,
                    afterTax   : false,
                    isActive   : false
                },
                pageMessage   : '',
                isMessage     : false,
                itemId        : '',
                itemParams    : '',
                itemParamId   : '',
                isAdmin       : false,
                wishFolder    : 'Wish List',
                cartFolder    : 'Main Cart',
                validateErrors: '',
            }
        },
        computed  : {
            productCategories() {
                return this.orderCatItems.filter( ( item ) => {
                    return (item.catGroup === 'Product');
                } );
            },
            productGroups() {
                return this.codeItems.filter( ( item ) => {
                    return (item.codeCat === 'Product Group' && item.parentId === '');
                } );
            },
            productCost() {
                const prodInfo = this.productItems.find( ( item ) => {
                    return item._id === this.discount.product;
                } );
                return prodInfo ? prodInfo.productCost : 0.00;
            },
            userGroups() {
                return this.codeItems.filter( ( item ) => {
                    return (item.codeCat === 'User' && item.parentId === '');
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
            costUnits() {
                const parentInfo = this.codeItems.find( ( item ) => {
                    return (item.codeName === 'Duration');
                } );
                return this.codeItems.filter( ( item ) => {
                    return (item.codeCat === 'Measurement' && item.parentId === parentInfo._id);
                } );
            },
            taxes() {
                // TODO: by product/owner location
                return this.taxItems.filter( ( item ) => {
                    return (item.taxCat === 'Sales Tax');
                } );
            },
            currentProducts() {
                // return only the current-item or all-items
                if( this.itemId ) {
                    return this.productItems.filter( ( item ) => {
                        return item._id === this.discount.product;
                    } );
                }
                return this.productItems;
            },
        },
        methods   : {
            fetchData() {
                // token
                const userToken     = this.$auth.getToken(),
                      queryParams   = {},
                      currentItemId = '';
                Meteor.call( 'getAllLang', ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'LanguageError: Retry.';
                    } else if( result.code === 'success'
                    ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.langItems   = this.$lo.sortBy( result.value, 'langName' ).filter( ( item ) => {
                            return item.isActive === true;
                        } )
                        ;
                    }
                    else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
                if( userToken ) {
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
                    // taxes
                    Meteor.call( 'getTax', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'TaxError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.taxItems    = this.$lo.sortBy( result.value, 'taxName' );
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                    // order categories
                    Meteor.call( 'getOrderCat', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'OrderCategoryError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage     = false;
                            this.pageMessage   = 'Items available';
                            this.orderCatItems = this.$lo.sortBy( result.value, 'catName' );
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                    // locations
                    Meteor.call( 'getLocation', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'LocationError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage     = false;
                            this.pageMessage   = 'Items available';
                            this.locationItems = this.$lo.sortBy( result.value, 'locationName' );
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
                            this.userItems   = this.$lo.sortBy( result.value, 'username' );
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
                            this.codeItems   = this.$lo.sortBy( result.value, 'codeName' ).filter( ( item ) => {
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
            formatDate( date ) {
                return this.$lo( date ).format( "YYYY-MM-DD" );
            },
            saveDiscount() {
                // cast number items
                this.discount.amount      = Number( this.discount.amount );
                this.discount.minQuantity = Number( this.discount.minQuantity );
                this.discount.maxQuantity = Number( this.discount.maxQuantity );

                // set discount afterTax
                this.discount.afterTax = !this.discount.beforeTax;

                // validate inputs:
                const errors = validateDiscount( this.discount );
                if( errors.code || errors.cost || errors.currency || errors.unit || errors.startDate || errors.endDate || errors.group || errors.minQuantity || errors.maxQuantity || errors.desc ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveDiscount', this.discount, this.itemId, userToken, ( error, result ) => {
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
                        this.pageMessage = 'inputs-errors: ' + JSON.stringify( errors );
                    }
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Please login';
                }
            },
        },
        created() {
            // admin-user status (true or false)
            if( this.$store.getters[ 'central/getCurrentUser' ] ) {
                this.isAdmin = this.$store.getters[ 'central/getCurrentUser' ].isAdmin;
            }
            // locales
            this.mcLabel = this.$label;

            // set current data-item
            const item = this.$store.getters[ 'central/getProductDiscountItem' ];
            if( item ) {
                this.itemId   = item._id;
                this.discount = {
                    code       : item.code,
                    amount     : item.amount,
                    unit       : item.unit,
                    startDate  : this.formatDate( item.startDate ),
                    endDate    : this.formatDate( item.endDate ),
                    group      : item.group,
                    minQuantity: item.minQuantity,
                    maxQuantity: item.maxQuantity,
                    desc       : item.desc,
                    beforeTax  : item.beforeTax,
                    afterTax   : item.afterTax,
                    isActive   : item.isActive,
                };
            } else {
                this.itemId   = '';
                this.discount = {
                    code       : '',
                    amount     : 0.00,
                    unit       : '%',
                    startDate  : this.formatDate( Date.now() ),
                    endDate    : this.formatDate( Date.now() ),
                    group      : '',
                    minQuantity: 1,
                    maxQuantity: 0,
                    desc       : '',
                    beforeTax  : true,
                    afterTax   : false,
                    isActive   : false
                };
            }
            // get component data-items
            this.fetchData();
        },
    }
</script>
