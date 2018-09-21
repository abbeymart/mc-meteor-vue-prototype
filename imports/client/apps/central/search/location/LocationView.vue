<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4 class="col-sm-6 w3-left"><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.locationView}}</h4>
        </div>
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <hr>
        <!--Display: product-image, name, description, price, location, marketplace, url etc.-->
        <!--optional: include update link for item-owner / authorized-->
        <!--
        Product-Image | Name(bold) | Price | Marketplace | Seller | Location >> link to URL
        Description
        Status: Active | Inactive | Available(#) | Not-Available
        Location: Map
        Links: Bookmark | Add-to-Cart (Qty) | Email (to any-address) | Print | URL
        -->
        <div>
            <div class="col-sm-3">
                <span>Product images</span>
            </div>
            <div class="col-sm-6">
                <span>Product Details</span>
            </div>
            <div class="col-sm-3">
                <div class="form-group">
                    <label for="cartFolder">{{mcLabel.addCart}}</label>
                    <select class="form-control" v-model="cartFolder" id="cartFolder" v-on:change="addCartItem">
                        <option disabled value="">{{mcLabel.select}} {{mcLabel.cart}}</option>
                        <option v-for="item in cartFolders" :value="item._id">{{item.catName}}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="wishFolder">{{mcLabel.addWish}}</label>
                    <select class="form-control" v-model="wishFolder" id="wishFolder" v-on:change="addWishItem">
                        <option disabled value="">{{mcLabel.select}} {{mcLabel.wish}}</option>
                        <option v-for="item in wishFolders" :value="item._id">{{item.catName}} </option>
                    </select>
                </div>
            </div>
        </div>
        <hr>
        <div>
            <span>Other site activities: links and adverts</span>
        </div>
        <hr>
        <!--<span v-if="isMessage" class="alert-info">{{pageMessage}}</span>-->
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
        name      : 'searchLocationDetail',
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
                    productUrl          : '',
                    productMarket       : 'local',
                    productLang         : 'en-US',
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
                wishFolder    : '',
                cartFolder    : '',
                wishName      : 'Wish List',
                cartName      : 'Cart',
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
            markets(){
                const parentInfo = this.codeItems.find( ( item ) => {
                    return (item.codeName === 'Trade Market');
                } );
                return this.codeItems.filter( ( item ) => {
                    return (item.codeCat === 'Trading' && item.parentId === parentInfo._id);
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
                } );
            },
            cartFolders() {
                return this.orderCatItems.filter( ( item ) => {
                    return ( item.catGroup === 'Cart' );
                } );
            },
        },
        methods   : {
            fetchData(){
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
                        this.langItems   = _.sortBy( result.value, 'langName' ).filter( ( item ) => {
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
                            this.productItems = _.sortBy( result.value, 'productName' ).filter( ( item ) => {
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
                            this.taxItems    = _.sortBy( result.value, 'taxName' );
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
                            this.orderCatItems = _.sortBy( result.value, 'catName' );
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
                            this.locationItems = _.sortBy( result.value, 'locationName' );
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
            startDate() {
                return moment( this.product.productDiscountStart ).format( "YYYY-MM-DD" );
            },
            endDate() {
                return moment( this.product.productDiscountEnd ).format( "YYYY-MM-DD" );
            },
            addWishItem( itemId ){
                // TODO: Add to wishlist
                const wish = this.wishFolder;

            },
            addCartItem( itemId ){
                // TODO: Add to wishlist
                const cart = this.wishFolder;

            },
            defaultCartFolder(){
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

                // TODO: auto-generate unique productCode for mConnect entries


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
            this.mcLabel        = this.$label;
            this.mcConstant     = this.$constant;
            if( Session.get( 'currentProductItem' ) ) {
                const item   = Session.get( 'currentProductItem' );
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
                    productUrl          : item.productUrl,
                    productMarket       : item.productMarket || 'local',
                    productLang         : item.productLang,
                    parentId            : item.parentId,
                    isTrade             : item.isTrade,
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
                    productUrl          : '',
                    productMarket       : 'local',
                    productLang         : 'en-US',
                    parentId            : '',
                    isTrade             : false,
                    isActive            : false
                };
            }
            // Fetch items from the server, based on role assignment / authorization
            this.fetchData();
//            this.cartFolder = this.defaultCartFolder(this.cartName);
//            this.wishFolder = this.defaultWishFolder(this.wishName);
        },
        ready(){
            this.cartFolder = this.defaultCartFolder( this.cartName );
            this.wishFolder = this.defaultWishFolder( this.wishName );
        },
    }
</script>