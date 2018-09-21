<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4 class="col-sm-6 w3-left"><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.productDetail}}</h4>
            <!--TODO: action: add-to-cart / wish-list on select or click-->
            <span v-if="itemId" class="w3-container col-sm-6">
                <div class="form-group col-sm-6 w3-left">
                    <label for="cartFolder">{{mcLabel.addCart}}</label>
                    <select class="form-control" v-model="cartFolder" id="cartFolder" v-on:change="addCartItem">
                        <option disabled value="">{{mcLabel.select}} {{mcLabel.cart}}</option>
                        <option v-for="item in cartFolders" :value="item._id">{{item.catName}}
                        </option>
                    </select>
                </div>
                <div class="form-group col-sm-6 w3-right">
                     <label for="wishFolder">{{mcLabel.addWish}}</label>
                     <select class="form-control" v-model="wishFolder" id="wishFolder" v-on:change="addWishItem">
                         <option disabled value="">{{mcLabel.select}} {{mcLabel.wish}}</option>
                         <option v-for="item in wishFolders" :value="item._id">{{item.catName}} </option>
                     </select>
                </div>
            </span>
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
                            <label for="productCode">{{mcLabel.productCode}}</label>
                            <input type="text" class="form-control" id="productCode"
                                   :placeholder="mcLabel.productName" maxlength="255"
                                   v-model="product.productCode">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productCode}}</span>
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
                                <option v-for="item in productCategories" :value="item._id">
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
                                <option v-for="item in productGroups" :value="item.codeName">
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
                                <option v-for="item in countries" :value="item._id">
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
                                <option v-for="item in states" :value="item._id">
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
                        <!--TODO: owner/seller for admin-user only, for local market-->
                        <div v-if="isAdmin" class="form-group">
                            <label for="productOwner">{{mcLabel.owner}}</label>
                            <select class="form-control" v-model="product.productOwner" id="productOwner">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.owner}}</option>
                                <option v-for="item in userItems" :value="item._id">
                                    {{ item.username }} | {{item.profile.firstName}} {{item.profile.lastName}}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productOwner}}</span>
                        </div>
                        <div class="form-group">
                            <label for="productMarket">{{mcLabel.market}}</label>
                            <select class="form-control" v-model="product.productMarket" id="productMarket" required>
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.market}}</option>
                                <option v-for="item in markets" :value="item.codeName">
                                    {{ item.codeName }}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productMarket}}
                            </span>
                        </div>
                        <div class="form-group">
                            <label for="productLang">{{mcLabel.lang}}</label>
                            <select class="form-control" v-model="product.productLang" id="productLang" required>
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                                <option v-for="item in langItems" :value="item.langCode">
                                    {{ item.langName }}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productLang}}</span>
                        </div>
                        <!--TODO: owner/seller for non-admin user, for non-local market or general marketplace, text-input-->
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
                                <option v-for="item in currencies" :value="item.codeName">
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
                                <option v-for="item in costUnits" :value="item.codeName">
                                    {{ item.codeName}}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productCostUnit}}</span>
                        </div>
                        <div>
                            <div class="form-group col-sm-6">
                                <label for="productQuantity">{{mcLabel.quantity}}</label>
                                <input type="number" min="0" class="form-control" id="productQuantity"
                                       :placeholder="mcLabel.quantity" maxlength="255" disabled
                                       v-model="product.productQuantityTotal">
                                <span v-if="validateErrors"
                                      class="help-block w3-yellow">{{validateErrors.productQuantity}}</span>
                            </div>
                            <div class="form-group col-sm-6">
                                <label for="productSold">{{mcLabel.sold}}</label>
                                <input type="number" min="0" class="form-control" id="productSold"
                                       :placeholder="mcLabel.sold" maxlength="255"
                                       v-model="product.productSold" disabled>
                                <span v-if="validateErrors"
                                      class="help-block w3-yellow">{{validateErrors.productSold}}</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="productShip">{{mcLabel.ship}} {{mcLabel.cat}}</label>
                            <select class="form-control" v-model="product.productShip" id="productShip">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.ship}} {{mcLabel.cat}}</option>
                                <option v-for="item in productShips" :value="item._id">
                                    {{ item.catName}}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productShip}}</span>
                        </div>
                        <div class="form-group">
                            <label for="productTax">{{mcLabel.tax}}</label>
                            <select class="form-control" v-model="product.productTax" id="productTax">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.tax}}</option>
                                <option v-for="item in taxes" :value="item.taxName">
                                    {{ item.taxName}}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productTax}}</span>
                        </div>
                        <div class="form-group">
                            <label for="productUrl">{{mcLabel.url}}</label>
                            <input type="text" min="0" class="form-control" id="productUrl"
                                   :placeholder="mcLabel.url" maxlength="255"
                                   v-model="product.productUrl" required>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.productUrl}}</span>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-3">
                                <label for="isActive">{{mcLabel.isActive}} </label>
                                <input class="w3-check" type="checkbox" id="isActive" v-model="product.isActive">
                            </div>
                            <div class="col-sm-3">
                                <label for="isTax">{{mcLabel.isTax}} </label>
                                <input class="w3-check" type="checkbox" id="isTax" v-model="product.isTax">
                            </div>
                            <div class="col-sm-3">
                                <label for="isTrade">{{mcLabel.isTrade}} </label>
                                <input class="w3-check" type="checkbox" id="isTrade" v-model="product.isTrade">
                            </div>
                            <div class="col-sm-3">
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
    import { validateProduct, validateTrade, validateWish, validateCart } from '/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    const moment    = require( 'moment' );
    const randomize = require( 'randomatic' );

    export default {
        name      : 'orderProductDetail',
        components: {},
        data() {
            return {
                mcLabel       : {},
                mcConstant    : {},
                codeItems     : [],
                orderCatItems : [],
                locationItems : [],
                taxItems      : [],
                userItems     : [],
                langItems     : [],
                productItems  : [],
                product       : {
                    productCode         : '', // auto-generate (unique)
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
                    productCurrency     : 'US$',
                    productCostUnit     : 'Once',
                    productTax          : '',
                    productQuantity     : 0,
                    productSold         : 0,
                    productQuantityTotal: 0,
                    productImage        : '',
                    productFeature      : {},
                    productDesc         : '',
                    productShip         : '',
                    productUrl          : '',
                    productMarket       : 'local',
                    productLang         : 'en-US',
                    parentId            : '',
                    isTrade             : false,
                    isTax               : true,
                    isActive            : false,
                },
                pageMessage   : '',
                isMessage     : false,
                itemId        : '',
                itemParams    : '',
                itemParamId   : '',
                isAdmin       : false,
                itemQuantity  : 1,
                wishFolder    : '',
                cartFolder    : '',
                wishName      : 'Wish List',
                cartName      : 'Cart',
                validateErrors: '',
            }
        },
        computed  : {
            fileUpdate() {
                this.product.productImage = document.getElementById( 'productImage' ).value || '';
            },
            parentItems() {
                return this.productItems.filter( ( item ) => {
                    return ((item._id !== this.itemId) && (item.productOwner === this.product.productOwner));
                } );
            },
            productCategories() {
                return this.orderCatItems.filter( ( item ) => {
                    return (item.catGroup === 'Product');
                } );
            },
            productShips() {
                return this.orderCatItems.filter( ( item ) => {
                    return (item.catGroup === 'Shipping');
                } );
            },
            productGroups() {
                return this.codeItems.filter( ( item ) => {
                    return (item.codeCat === 'Product Group' && item.parentId === '');
                } );
            },
            markets() {
                const parentInfo = this.codeItems.find( ( item ) => {
                    return (item.codeName === 'Trade Market');
                } );
                return this.codeItems.filter( ( item ) => {
                    return (item.codeCat === 'Trading' && item.parentId === parentInfo._id);
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
            countries() {
                return this.locationItems.filter( ( item ) => {
                    return (item.locationType === 'Country');
                } );
            },
            states() {
                return this.locationItems.filter( ( item ) => {
                    return ((item.locationType === 'State' || item.locationType === 'Province') && item.parentId === this.product.productCountry);
                } );
            },
            taxes() {
                // TODO: by product/owner location
                return this.taxItems.filter( ( item ) => {
                    return (item.taxCat === 'Sales Tax');
                } );
            },
            wishFolders() {
                return this.orderCatItems.filter( ( item ) => {
                    return ( item.catGroup === 'Wish');
                } );
            },
            cartFolders() {
                return this.orderCatItems.filter( ( item ) => {
                    return ( item.catGroup === 'Cart' );
                } );
            },
            itemQuantities() {
                // define return quantity values
                let qValue       = [];
                // start and end for the quantity list
                const startValue = 1;   // minimum-allowed for display / select-list
                let endValue     = this.$constant.getMaxProductQuantity() || 10; // maximum-allowed for display / select-list
                // get the least of maximum-allowed or available product quantities, from products
                const prodId     = this.itemId || '';
                let qtyAvailable = 0,
                      prodInfo;
                if( prodId ) {
                    prodInfo = this.productItems.find( ( item ) => {
                        return item._id === prodId;
                    } );
                }

                if( prodInfo ) {
                    qtyAvailable = prodInfo.productQuantityTotal - prodInfo.productSold;
                }
                // limit select-list to the qtyAvailable if qtyAvailable is less than endValue
                if( qtyAvailable > 0 && qtyAvailable < endValue ) {
                    endValue = qtyAvailable;
                }

                for( let i = startValue; i <= endValue; i++ ) {
                    qValue.push( i );
                }
                return qValue;
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
            startDate() {
                return moment( this.product.productDiscountStart ).format( "YYYY-MM-DD" );
            },
            endDate() {
                return moment( this.product.productDiscountEnd ).format( "YYYY-MM-DD" );
            },
            addWishItem() {
                // Add to wish-list
                let currentWishId = '';
                let wish          = {
                    wishProduct    : this.itemId || this.currentItem._id,
                    wishProductName: this.product.productName || this.currentItem.productName,
                    wishFolder     : this.wishFolder,
                    wishPriority   : 'Medium',
                    wishUrl        : '',
                    wishQuantity   : this.itemQuantity || 1,
                    wishPurchased  : 0,
                    wishDesc       : '',
                    wishOwner      : this.$store.getters[ 'central/getUserItem' ]._id,
                    isActive       : true,
                };

                // cast number items
                wish.wishQuantity  = Number( wish.wishQuantity );
                wish.wishPurchased = Number( wish.wishPurchased );

                // validate inputs
                let errors = validateWish( wish );
                if( errors.wishProduct || errors.wishProductName || errors.wishFolder || errors.wishPriority || errors.wishUrl || errors.wishQuantity || errors.wishDesc ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveWishItem', wish, currentWishId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage   = true;
                                const wishBox    = this.orderCatItems.find( ( item ) => {
                                    return (item._id === wish.wishFolder && item.catGroup === 'Wish');
                                } );
                                this.pageMessage = `${result.code}: ${result.value} |  ${wish.wishQuantity} of ${wish.wishProductName} added to ${wishBox.catName}`;
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
            addCartItem() {
                // Add to cart
                let currentCartId = '';
                let cart          = {
                    tradeProduct    : this.itemId || this.currentItem._id,
                    tradeProductName: this.product.productName,
                    tradeGroup      : 'B2C',
                    tradeFolder     : this.cartFolder,
                    tradeQuantity   : this.cartQuantity || 1,
                    tradeStatus     : 'CartTrade',
                    tradeOwner      : this.$store.getters[ 'central/getUserItem' ]._id,
                    tradeDesc       : '',
                    tradeShipping   : '',
                    tradePayment    : '',
                    isActive        : true,
                };

                // cast/format number parameters
                cart.tradeQuantity = Number( cart.tradeQuantity );

                // validate inputs
                let errors = validateTrade( cart );
                if( errors.tradeProduct || errors.tradeGroup || errors.tradeFolder || errors.tradeQuantity || errors.tradeStatus || errors.tradeOwner || errors.tradeDesc || errors.tradeShipping || errors.tradePayment ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveTradeItem', cart, currentCartId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage   = true;
                                const cartBox    = this.orderCatItems.find( ( item ) => {
                                    return (item._id === cart.tradeFolder && item.catGroup === 'Cart');
                                } );
                                this.pageMessage = `${result.code}: ${result.value} |  ${cart.tradeQuantity} of ${cart.tradeProductName} added to ${cartBox.catName}`;
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
            bookItem( itemId ) {
                // TODO: bookmark item | add to favourites (browser)
                console.log( 'book item' );
                // Get/Set URL information for the current page
                this.$store.dispatch( 'central/setProductUrl', window.location.href + '/' + this.itemId );
                // Session.set( 'productUrl', window.location.href + '/' + this.itemId );
                // Go to send page and send the page URL to specified email address
                console.log( this.$store.getters['central/getProductUrl'] );
            },
            defaultCartFolder() {
                const cartName = this.mcConstant.getDefaultCart();
                const cartInfo = this.orderCatItems.find( ( item ) => {
                    return ( item.catName === cartName && item.catGroup === 'Wish');
                } );
                return cartInfo ? cartInfo._id : '';
            },
            defaultWishFolder() {
                const wishName = this.mcConstant.getDefaultWish();
                const wishInfo = this.orderCatItems.find( ( item ) => {
                    return ( item.catName === wishName && item.catGroup === 'Folder');
                } );
                return wishInfo ? wishInfo._id : '';
            },
            saveProduct() {
                // Set productOwner to currentUser, for non-admin-users
                const user = this.$store.getters( 'central/getCurrentUser' );
                if( user && !user.isAdmin ) {
                    this.product.productOwner = user._id;
                }
                // cast number items | productQuantityTotal: 0,
                this.product.productCost          = Number( this.product.productCost );
                this.product.productQuantity      = Number( this.product.productQuantity );
                this.product.productQuantityTotal = Number( this.product.productQuantityTotal );
                this.product.productDiscount      = Number( this.product.productDiscount );
                this.product.productSold          = Number( this.product.productSold );

                // auto-generate unique productCode, for mConnect entries
                this.product.productCode = this.product.productCode || randomize( 'A0', 12 );
                this.product.productUrl  = this.product.productUrl || '';

                // validate inputs:
                const errors = validateProduct( this.product );
                if( errors.productName || errors.productKeyword || errors.productCat || errors.productGroup || errors.productOwner || errors.productCost || errors.productCostUnit || errors.productTax || errors.productDesc || errors.productQuantity || errors.productShip || errors.productCountry || errors.productState || errors.productCity || errors.productPostalCode || errors.productUrl ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveProduct', this.product, this.itemId, userToken, ( error, result ) => {
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
                    this.pageMessage = this.$message.accessKeyMissing;
                }
            },
        },
        created() {
            // admin-user status (true or false)

            // get the isAdmin status for the current user (set from the main Header)
            const userItem = this.$store.getters[ 'central/getUserItem' ];
            if( !this.$lo.isEmpty( userItem ) ) {
                this.isAdmin = userItem.isAdmin;
            }

            this.mcLabel    = this.$label;
            this.mcConstant = this.$constant;
            // current item
            const item      = this.$store.getters[ 'central/getProductItem' ];
            if( item ) {
                this.itemId  = item._id;
                this.product = {
                    productCode         : item.productCode,
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
                    productTax          : item.productTax,
                    productQuantity     : item.productQuantityTotal || 0,
                    productQuantityTotal: item.productQuantityTotal,
                    productSold         : item.productSold || 0,
                    productImage        : item.productImage,
                    productFeature      : item.productFeature,
                    productDesc         : item.productDesc,
                    productShip         : item.productShip,
                    productUrl          : item.productUrl,
                    productMarket       : item.productMarket || 'local',
                    productLang         : item.productLang,
                    parentId            : item.parentId,
                    isTrade             : item.isTrade,
                    isTax               : item.isTax,
                    isActive            : item.isActive
                };
            } else {
                this.itemId  = '';
                this.product = {
                    productCode         : '',
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
                    productCurrency     : 'US$',
                    productCostUnit     : 'Once',
                    productTax          : '',
                    productQuantity     : 0,
                    productQuantityTotal: 0,
                    productSold         : 0,
                    productImage        : '',
                    productFeature      : {},
                    productDesc         : '',
                    productShip         : '',
                    productUrl          : '',
                    productMarket       : 'local',
                    productLang         : 'en-US',
                    parentId            : '',
                    isTrade             : false,
                    isTax               : true,
                    isActive            : false
                };
            }
            // Fetch items from the server, based on role assignment / authorization
            this.fetchData();
        },
        ready() {
            this.cartFolder = this.defaultCartFolder( this.cartName );
            this.wishFolder = this.defaultWishFolder( this.wishName );
        },
    }
</script>
