<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4 class="w3-left"><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.priceDetail}}</h4>
        </div>
        <hr>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <fieldset>
                        <legend><h4>{{mcLabel.tradePrice}}</h4></legend>
                        <!--TODO: for admin-user only?-->
                        <div class="form-group">
                            <label for="priceProduct">{{mcLabel.product}}</label>
                            <select class="form-control" v-model="price.product" id="priceProduct" v-on:change="productCost">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.product}}</option>
                                <option v-for="item in currentProducts" :value="item._id">
                                    {{ item.productName }}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.priceProduct}}</span>
                        </div>
                        <div class="form-group">
                            <label for="itemCost">{{mcLabel.cost}}</label>
                            <input type="number" min="0" class="form-control" id="itemCost"
                                   :placeholder="mcLabel.cost" maxlength="64"
                                   v-model="price.cost" required>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.cost}}</span>
                        </div>
                        <div class="form-group">
                            <label for="costCurrency">{{mcLabel.currency}}</label>
                            <select class="form-control" v-model="price.currency" id="costCurrency">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.currency}}</option>
                                <option v-for="item in currencies" :value="item.codeName">
                                    {{ item.codeName}}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.currency}}</span>
                        </div>
                        <div class="form-group">
                            <label for="costUnit">{{mcLabel.costUnit}}</label>
                            <select class="form-control" v-model="price.unit" id="costUnit">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.costUnit}}</option>
                                <option v-for="item in costUnits" :value="item.codeName">
                                    {{ item.codeName}}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.unit}}</span>
                        </div>
                        <div class="form-group">
                            <label for="priceDesc">{{mcLabel.desc}}</label>
                            <textarea class="form-control" id="priceDesc" cols="30" rows="5"
                                      :placeholder="mcLabel.desc" v-model="price.desc"></textarea>
                            <span v-if="validateErrors" class="alert-warning">{{validateErrors.desc}}</span>
                        </div>
                    </fieldset>
                </div>
                <div class="col-sm-6">
                    <fieldset>
                        <legend><h4>{{mcLabel.tradeTerm}}</h4></legend>
                        <div class="form-group">
                            <label for="priceGroup">{{mcLabel.group}}</label>
                            <select class="form-control" v-model="price.group" id="priceGroup">
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
                                   v-model="price.minQuantity">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.minQuantity}}</span>
                        </div>
                        <div class="form-group">
                            <label for="maxQuantity">{{mcLabel.maxQuantity}}</label>
                            <input type="number" min="0" class="form-control" id="maxQuantity"
                                   :placeholder="mcLabel.maxQuantity" maxlength="255"
                                   v-model="price.maxQuantity">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.maxQuantity}}</span>
                        </div>
                        <div class="form-group">
                            <label for="startDate">{{mcLabel.startDate}}</label>
                            <input type="date" class="form-control" id="startDate"
                                   :placeholder="mcLabel.startDate" maxlength="64"
                                   v-model="price.startDate">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.startDate}}</span>
                        </div>
                        <div class="form-group">
                            <label for="endDate">{{mcLabel.endDate}}</label>
                            <input type="date" class="form-control" id="endDate"
                                   :placeholder="mcLabel.endDate" maxlength="64"
                                   v-model="price.endDate">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.endDate}}</span>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-4">
                                <label for="isActive">{{mcLabel.isActive}} </label>
                                <input class="w3-check" type="checkbox" id="isActive" v-model="price.isActive">
                            </div>
                            <div class="col-sm-4">
                                <button class="btn btn-primary" @click.prevent="savePrice">{{mcLabel.save}}</button>
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
    import { validatePrice } from '/imports/lib/utils/ValidateRecord';

    export default {
        name      : 'orderProductPriceDetail',
        components: {},
        data() {
            return {
                mcLabel       : this.$label,
                codeItems     : [],
                orderCatItems : [],
                locationItems : [],
                taxItems      : [],
                userItems     : [],
                langItems     : [],
                productItems  : [],
                groupItems    : [],
                price         : {
                    product    : '',
                    cost       : 0.00,
                    currency   : 'US$',
                    unit       : 'Once',
                    startDate  : this.formatDate( Date.now ),
                    endDate    : this.formatDate( Date.now() ),
                    group      : '',
                    minQuantity: 1,
                    maxQuantity: 0,
                    desc       : '',
                    isActive   : false
                },
                pageMessage   : '',
                isMessage     : false,
                itemId        : '',
                itemParams    : '',
                itemParamId   : '',
                isAdmin       : false,
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
            // productCost() {
            //     const prodInfo = this.productItems.find( ( item ) => {
            //         return item._id === this.price.product;
            //     } );
            //     return prodInfo ? this.price.cost = prodInfo.productCost : 0.00;
            // },
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
                        return item._id === this.price.product;
                    } );
                }
                return this.productItems;
            },
        },
        methods   : {
            formatDate( date ) {
                return this.$mo( date ).format( "YYYY-MM-DD" );
            },
            productCost() {
                if( this.productItems ) {
                    const prodInfo = this.productItems.find( ( item ) => {
                        return item._id === this.price.product;
                    } );
                    // this.product.cost = prodInfo.productCost || 0.00;
                    return prodInfo ? this.price.cost = prodInfo.productCost : 0.00;
                }
            },
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
            savePrice() {
                // cast number items
                this.price.cost        = Number( this.price.cost );
                this.price.minQuantity = Number( this.price.minQuantity );
                this.price.maxQuantity = Number( this.price.maxQuantity );

                // validate inputs:
                const errors = validatePrice( this.price );
                if( errors.product || errors.cost || errors.currency || errors.unit || errors.startDate || errors.endDate || errors.group || errors.minQuantity || errors.maxQuantity || errors.desc ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'savePrice', this.price, this.itemId, userToken, ( error, result ) => {
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

            // set current data-item
            const item = this.$store.getters[ 'central/getProductPriceItem' ];
            if( item ) {
                this.itemId = item._id;
                this.price  = {
                    product    : item.product,
                    cost       : item.cost,
                    currency   : item.currency,
                    unit       : item.unit,
                    startDate  : this.formatDate( item.startDate ),
                    endDate    : this.formatDate( item.endDate ),
                    group      : item.group,
                    minQuantity: item.minQuantity,
                    maxQuantity: item.maxQuantity,
                    desc       : item.desc,
                    isActive   : item.isActive,
                };
            } else {
                this.itemId = '';
                this.price  = {
                    product    : '',
                    cost       : 0.00,
                    currency   : 'US$',
                    unit       : 'Once',
                    startDate  : this.formatDate( Date.now() ),
                    endDate    : this.formatDate( Date.now() ),
                    group      : '',
                    minQuantity: 1,
                    maxQuantity: 0,
                    desc       : '',
                    isActive   : false
                };
            }
            // get component data-items
            this.fetchData();
        },
    }
</script>
