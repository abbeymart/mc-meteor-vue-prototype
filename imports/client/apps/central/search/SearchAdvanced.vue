<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up w3-left"></i> {{mcLabel.productDetail}}</h4>
            <div v-if="itemId" class="w3-container w3-margin-4">
                <div class="col-sm-3 w3-right">
                    <label for="cartFolder">{{mcLabel.addCart}}</label>
                    <div class="col-sm-8 w3-right">
                        <select class="form-control" v-model="cartFolder" id="cartFolder" v-on:change="addCartItem">
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.cart}}</option>
                            <option v-for="item in cartFolders" :value="item._id" :key="item._id">
                                {{ item.catName}}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="col-sm-3 w3-right">
                    <label for="wishFolder">{{mcLabel.addWish}}</label>
                    <div class="col-sm-8 w3-right">
                        <select class="form-control" v-model="wishFolder" id="wishFolder" v-on:change="addWishItem">
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.folder}}</option>
                            <option v-for="item in wishFolders" :value="item._id" :key="item._id">
                                {{ item.catName}}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <fieldset>
                        <legend><h4>Product Profile</h4></legend>
                        <div class="form-group">
                            <label for="productName">{{mcLabel.productName}}</label>
                            <input type="text" class="form-control" id="productName"
                                   :placeholder="mcLabel.productName" maxlength="255" required autofocus
                                   v-model="product.productName">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productName}}</span>
                        </div>
                        <div class="form-group">
                            <label for="productKeyword">{{mcLabel.keyword}}</label>
                            <input type="text" class="form-control" id="productKeyword"
                                   :placeholder="mcLabel.keyword" maxlength="255" required autofocus
                                   v-model="product.productKeyword">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productKeyword}}</span>
                        </div>
                        <div class="form-group">
                            <label for="productCat">{{mcLabel.cat}}</label>
                            <select class="form-control" v-model="product.productCat" id="productCat" required>
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.cat}}</option>
                                <option v-for="item in productCategories" :value="item._id" :key="item._id">
                                    {{ item.catName }}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productCat}}</span>
                        </div>
                        <div class="form-group">
                            <label for="productGroup">{{mcLabel.group}}</label>
                            <select class="form-control" v-model="product.productGroup" id="productGroup" required>
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.group}}</option>
                                <option v-for="item in productGroups" :value="item.codeName" :key="item._id">
                                    {{ item.codeName }}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productGroup}}</span>
                        </div>
                        <div class="form-group">
                            <label for="productCountry">{{mcLabel.country}}</label>
                            <select class="form-control" v-model="product.productCountry" id="productCountry" required>
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.country}}</option>
                                <option v-for="item in countries" :value="item._id" :key="item._id">
                                    {{ item.locationName }}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productCountry}}</span>
                        </div>
                        <div class="form-group">
                            <label for="productState">{{mcLabel.state}}</label>
                            <select class="form-control" v-model="product.productState" id="productState">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.state}}</option>
                                <option v-for="item in states" :value="item._id" :key="item._id">
                                    {{ item.locationName }}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productState}}</span>
                        </div>
                        <div class="form-group">
                            <label for="productCity">{{mcLabel.city}}</label>
                            <input type="text" class="form-control" id="productCity"
                                   :placeholder="mcLabel.city" maxlength="100"
                                   v-model="product.productCity">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productCity}}</span>
                        </div>
                        <div class="form-group">
                            <label for="productPostalCode">{{mcLabel.postalCode}}</label>
                            <input type="text" class="form-control" id="productPostalCode"
                                   :placeholder="mcLabel.postalCode" maxlength="25"
                                   v-model="product.productPostalCode">
                            <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.productPostalCode}}</span>
                        </div>
                        <div class="form-group">
                            <label for="productLang">{{mcLabel.lang}}</label>
                            <select class="form-control" v-model="product.productLang" id="productLang" required>
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                                <option v-for="item in langItems" :value="item.langCode" :key="item._id">
                                    {{ item.langName }}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productLang}}</span>
                        </div>
                        <div class="form-group">
                            <label for="productDesc">{{mcLabel.desc}}</label>
                            <textarea class="form-control" id="productDesc" cols="30" rows="4"
                                      :placeholder="mcLabel.desc" v-model="product.productDesc"></textarea>
                            <span v-if="validateErrors" class="alert-warning">{{validateErrors.productDesc}}</span>
                        </div>
                    </fieldset>
                </div>
                <div class="col-sm-6">
                    <fieldset>
                        <legend><h4>Product Costing</h4></legend>
                        <!--TODO: for admin-user only-->
                        <div v-if="isAdmin" class="form-group">
                            <label for="productOwner">{{mcLabel.owner}}</label>
                            <select class="form-control" v-model="product.productOwner" id="productOwner">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.owner}}</option>
                                <option v-for="item in userItems" :value="item._id" :key="item._id">
                                    {{ item.username }} | {{item.profile.firstName}} {{item.profile.lastName}}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productOwner}}</span>
                        </div>
                        <div class="form-group">
                            <label for="productCost">{{mcLabel.cost}}</label>
                            <input type="number" min="0" class="form-control" id="productCost"
                                   :placeholder="mcLabel.cost" maxlength="64"
                                   v-model="product.productCost" required>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productCost}}</span>
                        </div>
                        <div class="form-group">
                            <label for="productCurrency">{{mcLabel.currency}}</label>
                            <select class="form-control" v-model="product.productCurrency" id="productCurrency">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.currency}}</option>
                                <option v-for="item in currencies" :value="item.codeName" :key="item._id">
                                    {{ item.codeName}}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productCurrency}}</span>
                        </div>
                        <div class="form-group">
                            <label for="productCostUnit">{{mcLabel.costUnit}}</label>
                            <select class="form-control" v-model="product.productCostUnit" id="productCostUnit">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.costUnit}}</option>
                                <option v-for="item in costUnits" :value="item.codeName" :key="item._id">
                                    {{ item.codeName}}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productCostUnit}}</span>
                        </div>
                        <div class="form-group">
                            <label for="productQuantity">{{mcLabel.quantity}}</label>
                            <input type="number" min="0" class="form-control" id="productQuantity"
                                   :placeholder="mcLabel.quantity" maxlength="255"
                                   v-model="product.productQuantity">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productQuantity}}</span>
                        </div>
                        <div class="form-group">
                            <label for="productSold">{{mcLabel.sold}}</label>
                            <input type="number" min="0" class="form-control" id="productSold"
                                   :placeholder="mcLabel.sold" maxlength="255"
                                   v-model="product.productSold" disabled>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productSold}}</span>
                        </div>
                        <div class="form-group">
                            <label for="productDiscount">{{mcLabel.discount}}</label>
                            <input type="number" min="0" class="form-control" id="productDiscount"
                                   :placeholder="mcLabel.discount" maxlength="32"
                                   v-model="product.productDiscount">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productDiscount}}</span>
                        </div>
                        <div class="form-group">
                            <label for="productDiscountUnit">{{mcLabel.discountUnit}}</label>
                            <input type="text" class="form-control" id="productDiscountUnit"
                                   :placeholder="mcLabel.discountUnit" maxlength="12"
                                   v-model="product.productDiscountUnit">
                            <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.productDiscountUnit}}</span>
                        </div>
                        <div class="form-group">
                            <label for="productDiscountStart">{{mcLabel.discount}} {{mcLabel.startDate}}</label>
                            <input type="date" class="form-control" id="productDiscountStart"
                                   :placeholder="mcLabel.startDate" maxlength="64"
                                   v-model="product.productDiscountStart">
                            <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.productDiscountStart}}</span>
                        </div>
                        <div class="form-group">
                            <label for="productDiscountEnd">{{mcLabel.discount}} {{mcLabel.endDate}}</label>
                            <input type="date" class="form-control" id="productDiscountEnd"
                                   :placeholder="mcLabel.endDate" maxlength="64"
                                   v-model="product.productDiscountEnd">
                            <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.productDiscountEnd}}</span>
                        </div>
                        <div class="form-group">
                            <label for="productTax">{{mcLabel.tax}}</label>
                            <select class="form-control" v-model="product.productTax" id="productTax">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.tax}}</option>
                                <option v-for="item in taxes" :value="item.taxName" :key="item._id">
                                    {{ item.taxName}}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productTax}}</span>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-4">
                                <label for="isActive">{{mcLabel.isActive}} </label>
                                <input class="w3-check" type="checkbox" id="isActive" v-model="product.isActive">
                            </div>
                            <div class="col-sm-4">
                                <label for="isTrade">{{mcLabel.isTrade}} </label>
                                <input class="w3-check" type="checkbox" id="isTrade" v-model="product.isTrade">
                            </div>
                            <div class="col-sm-4">
                                <button class="btn btn-primary" @click.prevent="saveProduct">{{mcLabel.save}}</button>
                            </div>
                        </div>
                    </fieldset>
                    <!--TODO: product image-->
                    <!--<div class="form-group">-->
                    <!--<label for="productImage">{{mcLabel.image}}</label>-->
                    <!--<input type="file" class="form-control" id="productImage"-->
                    <!--:placeholder="mcLabel.image" maxlength="255" required-->
                    <!--v-on:change="fileUpdate">-->
                    <!--<span v-if="validateErrors"-->
                    <!--class="help-block w3-yellow">{{validateErrors.productImage}}</span>-->
                    <!--</div>-->
                </div>
            </div>
            <div class="row">
                <div v-if="isMessage" class="w3-container w3-yellow">
                    <p>{{pageMessage}}</p>
                </div>
                <!--TODO: productFeature section or keep separate for flexibility (preferred)-->
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
    import { validateProduct } from'/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';
    const moment = require( 'moment' );

    export default{
        name      : 'searchAdvanced',
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
                product       : {
                    productName         : '',
                    productKeyword      : '',
                    productCat          : '',
                    productGroup        : '',
                    productCountry      : '',
                    productState        : '',
                    productCity         : '',
                    productPostalCode   : '',
                    productOwner        : '',
                    productCost         : 0.00,
                    productCurrency     : 'USD',
                    productCostUnit     : 'Once',
                    productDiscount     : 0.00,
                    productDiscountUnit : '%',
                    productDiscountStart: '',
                    productDiscountEnd  : '',
                    productTax          : '',
                    productQuantity     : 0,
                    productSold         : 0,
                    productImage        : '',
                    productFeature      : {},
                    productDesc         : '',
                    productLang         : this.$constant.getDefaultLanguage(),
                    parentId            : '',
                    isTrade             : false,
                    isActive            : false,
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
            fileUpdate(){
                this.product.productImage = document.getElementById( 'productImage' ).value || '';
            },
            parentItems(){
                return this.productItems.filter( ( item ) => {
                    return ((item._id !== this.itemId) && (item.productOwner === this.product.productOwner));
                } );
            },
            productCategories(){
                return this.orderCatItems.filter( ( item ) => {
                    return (item.catGroup === 'Product');
                } );
            },
            productGroups(){
                return this.codeItems.filter( ( item ) => {
                    return (item.codeCat === 'Product Group' && item.parentId === '');
                } );
            },
            currencies(){
                const parentInfo = this.codeItems.find( ( item ) => {
                    return (item.codeName === 'Currency');
                } );
                return this.codeItems.filter( ( item ) => {
                    return (item.codeCat === 'Measurement' && item.parentId === parentInfo._id);
                } );
            },
            costUnits(){
                const parentInfo = this.codeItems.find( ( item ) => {
                    return (item.codeName === 'Duration');
                } );
                return this.codeItems.filter( ( item ) => {
                    return (item.codeCat === 'Measurement' && item.parentId === parentInfo._id);
                } );
            },
            countries(){
                return this.locationItems.filter( ( item ) => {
                    return (item.locationType === 'Country');
                } );
            },
            states(){
                return this.locationItems.filter( ( item ) => {
                    return ((item.locationType === 'State' || item.locationType === 'Province') && item.parentId === this.product.productCountry);
                } );
            },
            cities(){
                // Current a free text input, TODO: consider making a select/text input, post data updates

            },
            taxes(){
                // TODO: by product/owner location
                return this.taxItems.filter( ( item ) => {
                    return (item.taxCat === 'Sales Tax');
                } );
            },
            wishFolders() {
                return this.orderCatItems.filter( ( item ) => {
                    return ( item.catGroup === 'Wish');
                });
            },
            cartFolders() {
                return this.orderCatItems.filter( ( item ) => {
                    return ( item.catGroup === 'Cart' ) ;
                });
            },
        },
        methods   : {
            addWishItem( itemId ){
                // TODO: Add to wishlist
                const wish = this.wishFolder;

            },
            addCartItem( itemId ){
                // TODO: Add to wishlist
                const cart = this.wishFolder;

            },
            saveProduct() {
                // Set productOwner to currentUser, for non-admin-users
                if( Session.get( 'currentUser' ) ) {
                    const userInfo = Session.get( 'currentUser' );
                    if( !userInfo.isAdmin ) {
                        this.product.productOwner = Session.get( 'currentUser' )._id;
                    }
                }
                // cast number items
                this.product.productCost     = Number( this.product.productCost );
                this.product.productQuantity = Number( this.product.productQuantity );
                this.product.productDiscount = Number( this.product.productDiscount );
                this.product.productSold     = Number( this.product.productSold );

                // validate inputs:
                const errors = validateProduct( this.product );
                if( errors.productName || errors.productKeyword || errors.productCat || errors.productGroup || errors.productOwner || errors.productCost || errors.productCostUnit || errors.productTax || errors.productDesc || errors.productQuantity || errors.productDiscount || errors.productDiscountUnit || errors.productCountry || errors.productDiscountStart || errors.productCity || errors.productPostalCode || errors.productDiscountEnd ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveProduct', this.product, this.itemId, userToken, ( error, result ) => {
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
                        this.pageMessage = 'inputs-errors: ' + errors;
                    }
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Please login';
                }
            },
        },
        created() {
            // admin-user status (true or false)
            if( Session.get( 'currentUser' ) ) {
                this.isAdmin = Session.get( 'currentUser' ).isAdmin;
            }
            // token
            const userToken     = this.$auth.getToken(),
                  queryParams   = {},
                  currentItemId = '';
            this.mcLabel        = this.$label;
            if( Session.get( 'currentProductItem' ) ) {
                const item   = Session.get( 'currentProductItem' );
                this.itemId  = item._id;
                this.product = {
                    productName         : item.productName,
                    productKeyword      : item.productKeyword,
                    productCat          : item.productCat,
                    productGroup        : item.productGroup,
                    productCountry      : item.productCountry,
                    productState        : item.productState,
                    productCity         : item.productCity,
                    productPostalCode   : item.productPostalCode,
                    productOwner        : item.productOwner,
                    productCost         : item.productCost,
                    productCurrency     : item.productCurrency,
                    productCostUnit     : item.productCostUnit,
                    productDiscount     : item.productDiscount,
                    productDiscountUnit : item.productDiscountUnit,
                    productDiscountStart: item.productDiscountStart,
                    productDiscountEnd  : item.productDiscountStart,
                    productTax          : item.productTax,
                    productQuantity     : item.productQuantity || 0,
                    productSold         : item.productSold || 0,
                    productImage        : item.productImage,
                    productFeature      : item.productFeature,
                    productDesc         : item.productDesc,
                    productLang         : item.productLang,
                    parentId            : item.parentId,
                    isTrade             : item.isTrade,
                    isActive            : item.isActive
                };
            } else {
                this.itemId  = '';
                this.product = {
                    productName         : '',
                    productKeyword      : '',
                    productCat          : '',
                    productGroup        : '',
                    productCountry      : '',
                    productState        : '',
                    productCity         : '',
                    productPostalCode   : '',
                    productOwner        : '',
                    productCost         : 0.00,
                    productCurrency     : 'USD',
                    productCostUnit     : 'Once',
                    productDiscount     : 0.00,
                    productDiscountUnit : '%',
                    productDiscountStart: '',
                    productDiscountEnd  : '',
                    productTax          : '',
                    productQuantity     : 0,
                    productSold         : 0,
                    productImage        : '',
                    productFeature      : {},
                    productDesc         : '',
                    productLang         : 'en-US',
                    parentId            : '',
                    isTrade             : false,
                    isActive            : false
                };
            }
            Meteor.call( 'getAllLang', ( error, result ) => {
                if( error ) {
                    this.isMessage   = true;
                    this.pageMessage = 'LanguageError: Retry.';
                } else if( result.code === 'success'
                )
                {
                    this.isMessage   = false;
                    this.pageMessage = 'Items available';
                    this.langItems   = _.sortBy( result.value, 'langName' ).filter( ( item ) => {
                        return item.isActive === true;
                    } )
                    ;
                }
                else
                {
                    this.isMessage   = true;
                    this.pageMessage = `${result.code}: ${result.value}`;
                }
            } )
            ;
            if( userToken ) {
                // products
                Meteor.call( 'getProduct', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'ProductError: Retry.';
                    } else if( result.code === 'success'
                    )
                    {
                        this.isMessage    = false;
                        this.pageMessage  = 'Items available';
                        this.productItems = _.sortBy( result.value, 'productName' ).filter( ( item ) => {
                            return item.isActive === true;
                        }) ;
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
                    } else if( result.code === 'success' )
                    {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.taxItems    = _.sortBy( result.value, 'taxName' );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                }) ;
                // order categories
                Meteor.call( 'getOrderCat', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'OrderCategoryError: Retry.';
                    } else if( result.code === 'success') {
                        this.isMessage     = false;
                        this.pageMessage   = 'Items available';
                        this.orderCatItems = _.sortBy( result.value, 'catName' );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                });
                // locations
                Meteor.call( 'getLocation', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'LocationError: Retry.';
                    } else if( result.code === 'success') {
                        this.isMessage     = false;
                        this.pageMessage   = 'Items available';
                        this.locationItems = _.sortBy( result.value, 'locationName' );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                });
                // user(s)
                Meteor.call( 'getUser', userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'UserError, Retry: ' + error;
                    } else if( result.code === 'success')  {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.userItems   = _.sortBy( result.value, 'username' );
                    } else  {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                });
                // get standard code items
                Meteor.call( 'getCode', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'CodeError: Retry.';
                    } else if( result.code === 'success') {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.codeItems   = _.sortBy( result.value, 'codeName' ).filter( ( item ) => {
                            return item.isActive === true;
                        });
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                }) ;
            } else {
                this.isMessage   = true;
                this.pageMessage = 'Access-key missing or expired. Please login again.';
            }
        },
    }
</script>