<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4 class="col-sm-6 w3-left"><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.productView}}</h4>
        </div>
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <hr>
        <div class="w3-container">
            <div class="col-sm-4">
                <span>Product images</span>
                <div v-for="item in productDocItems">
                    <!--<a :href="item.docUrl" target="_blank">[{{item.docName}}]</a>-->
                    <!--<a href="#" @click-prevent="showImage(item)">[{{item.docName}}]</a>-->
                    <img v-if="item.docType === 'image/jpeg'" :src="item.docUrl" :alt="item.docFile" width="60"
                         height="60" id="imgItem" @click.prevent="showImage(item)">
                    <br>
                </div>
                <div v-if="currentImageUrl">
                    <img :src="currentImageUrl" :alt="currentImageText" height="240" width="240">
                </div>
            </div>
            <div class="col-sm-6">
                <div v-if="product.productName">
                    <h4>{{product.productName}}</h4>
                    <span><b>{{mcLabel.cat}}:</b>: {{catName( product.productCat )}}</span>
                    <br>
                    <span><b>{{mcLabel.price}}:</b> {{itemCost( product )}}</span>
                    <br>
                    <span><b>{{mcLabel.market}}:</b> {{product.productMarket}}</span>
                    <br>
                    <span><b>{{mcLabel.location}}:</b> {{itemLocation( product )}} | Map | Direction</span>
                    <br>
                    <span><b>{{mcLabel.seller}}:</b> {{userName( product.productOwner )}}</span>
                    <br>
                    <span><b>{{mcLabel.desc}}:</b> {{product.productDesc}}</span>
                    <br>
                    <span><b>{{mcLabel.avail}}:</b> {{productAvailable( product )}} </span>
                    <br>
                    <span><b>{{mcLabel.sold}}:</b> {{product.productSold || 0}}</span>
                </div>
                <div v-else-if="currentItem.productName">
                    <h4>{{currentItem.productName}}</h4>
                    <span><b>{{mcLabel.cat}}:</b>: {{catName( currentItem.productCat )}}</span>
                    <br>
                    <span><b>{{mcLabel.price}}:</b> {{itemCost( currentItem )}}</span>
                    <br>
                    <span><b>{{mcLabel.market}}:</b> {{currentItem.productMarket}}</span>
                    <br>
                    <span><b>{{mcLabel.location}}:</b> {{itemLocation( currentItem )}} | Map | Direction</span>
                    <br>
                    <span><b>{{mcLabel.seller}}:</b> {{userName( currentItem.productOwner )}}</span>
                    <br>
                    <span><b>{{mcLabel.desc}}:</b> {{currentItem.productDesc}}</span>
                    <br>
                    <span><b>{{mcLabel.avail}}:</b>{{productAvailable( currentItem )}} </span>
                    <br>
                    <span><b>{{mcLabel.sold}}:</b> {{currentItem.productSold || 0}}</span>
                </div>
                <div v-else="">No item / product to display</div>
            </div>
            <div class="col-sm-2">
                <div class="form-group">
                    <label for="itemQuantity">{{mcLabel.quantity}}</label>
                    <select class="form-control" v-model="itemQuantity" id="itemQuantity">
                        <option disabled value="">{{mcLabel.select}} {{mcLabel.quantity}}</option>
                        <option v-for="item in itemQuantities" :value="item">{{item}}
                        </option>
                    </select>
                </div>
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
                <div>
                    <a href="#" @click.prevent="printItem">{{mcLabel.printItem}}</a>
                </div>
                <div>
                    <!--TODO: bookmark/favourites => wish-list-->
                    <a href="#" @click.prevent="bookItem">{{mcLabel.bookItem}}</a>
                </div>
                <div>
                    <!--TODO: send email-->
                    <a href="#" @click.prevent="sendItem">{{mcLabel.sendItem}}</a>
                </div>
            </div>
        </div>
        <hr>
        <div class="w3-container">
            <h4>Product Details / Features</h4>
            <ul>
                <li v-for="item in productFeatures">
                    <span>{{item.featureKey}}: {{item.featureValue}}</span>
                </li>
            </ul>
        </div>
        <hr>
        <div class="w3-container">
            <h4>Product Reviews / Ratings</h4>
            <span>Average Rating: *****</span>
            <br>
            <span>All Ratings / Details</span>
            <hr>
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
    // import { Session } from 'meteor/session';
    import { Images } from '/imports/collections/Central';
    import { Products } from '/imports/collections/Asset';
    import { validateProduct, validateTrade, validateWish } from '/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    const moment = require( 'moment' );

    export default {
        name      : 'searchProductDetail',
        components: {},
        data() {
            return {
                mcLabel            : {},
                mcConstant         : {},
                codeItems          : [],
                orderCatItems      : [],
                locationItems      : [],
                taxItems           : [],
                userItems          : [],
                langItems          : [],
                productItems       : [],
                productFeatureItems: [],
                productDocItems    : [],
                product            : {
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
                pageMessage        : '',
                isMessage          : false,
                currentImageUrl    : '',
                currentImageText   : '',
                currentItem        : '',
                itemId             : '',
                itemParams         : '',
                itemParamId        : '',
                isAdmin            : false,
                wishFolder         : '',
                cartFolder         : '',
                itemQuantity       : 1,
                wishName           : 'Wish List',
                cartName           : 'Cart',
                currentUser        : '',
                validateErrors     : '',
                imageSubReady      : '',
                imageItems         : [],
                productSubReady    : '',
            }
        },
        computed  : {
            itemRecord() {
                return Products.findOne( { _id: this.itemParamId } ) || this.product;
            },
            productImages() {
                return Images.find( {} ).fetch();
            },
            productFeatures() {
                // return features for the current item / product (this.itemId)
                return this.productFeatureItems.filter( ( item ) => {
                    return (item.featureProduct === this.itemId);
                } );
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
            cities() {
                // Current a free text input, TODO: consider making a select/text input, post data updates

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
                const userToken      = this.$auth.getToken();
                let queryParams      = {},
                      currentItemId  = '';
                // Subscribe to published collections:
                this.imageSubReady   = Meteor.subscribe( 'imageAll', queryParams, currentItemId, userToken );
                // Subscribe to published collections:
                this.productSubReady = Meteor.subscribe( 'productAll', queryParams, currentItemId, userToken );
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
                    // products
                    Meteor.call( 'getProduct', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'ProductError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage    = false;
                            this.pageMessage  = 'Items available';
                            this.productItems = _.sortBy( result.value, 'productName' ).filter( ( item ) => {
                                return item.isActive === true;
                            } );
                            this.currentItem  = this.productItems.find( ( item ) => {
                                return item._id === this.itemParamId;
                            } )
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                    // features
                    Meteor.call( 'getFeature', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'ProductFeatureError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage           = false;
                            this.pageMessage         = 'Items available';
                            this.productFeatureItems = _.sortBy( result.value, 'productName' );
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                    // documents / images
                    const docParams = {
                        docProduct: this.itemId || this.itemParamId,
                    };
                    Meteor.call( 'getProductDoc', docParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'ProductDocumentError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage       = false;
                            this.pageMessage     = 'Items available';
                            this.productDocItems = _.sortBy( result.value, 'docName' );
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
                            this.orderCatItems = _.sortBy( result.value, 'catGroup' );
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
                    // TODO: get all users information, securely
                    Meteor.call( 'getUserAll', userToken, ( error, result ) => {
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
                    // find currentUser
                    if( Session.get( 'currentUser' ) ) {
                        currentItemId = Session.get( 'currentUser' )._id;
                    }
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Access-key missing or expired. Please login again.';
                }
                // image items
                if( this.imageSubReady ) {
                    this.imageItems = Images.find( {} ).fetch();
                }
            },
            getItem( itemId ) {
                // token
                const userToken = this.$auth.getToken();
                let queryParams = {};
                // product
                Meteor.call( 'getProduct', queryParams, itemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'ProductError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Item available';
                        Session.set( 'currentProductItem', result.value );
                        this.currentItem = result.value;
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
            },
            userName( userId ) {
                const userInfo = this.userItems.find( ( item ) => {
                    return (item._id === userId);
                } );
                if( userInfo ) {
                    return `${userInfo.username}`;
//                    return `${userInfo.username} | ${userInfo.profile.firstName} ${userInfo.profile.lastName}`;
                } else {
                    return '';
                }
            },
            catName( itemId ) {
                const itemInfo = this.orderCatItems.find( ( item ) => {
                    return (item._id === itemId && item.catGroup === 'Product');
                } );
                return itemInfo ? itemInfo.catName : 'n/a';
            },
            itemCost( item ) {
                return `${item.productCurrency}${item.productCost}`;
            },
            itemLocation( itemLoc ) {
                const country = this.locationItems.find( ( item ) => {
                    return item._id === itemLoc.productCountry;
                } );
                const state   = this.locationItems.find( ( item ) => {
                    return item._id === itemLoc.productState;
                } );
                if( country && state ) {
                    return `${itemLoc.productCity}, ${state.locationName}, ${country.locationName}`;
                } else {
                    return `${itemLoc.productCity}` || 'n/a';
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
                    wishOwner      : this.$store.getters[ 'central/getCurrentUser' ]._id,
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
                                this.pageMessage = `${result.code}: ${result.value} |  ${wish.wishQuantity} of ${wish.wishProductName} added to ${wishBox.catName} wish-category`;
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
            addCartItem() {
                // Add to cart
                let currentCartId = '';
                let cart          = {
                    tradeProduct    : this.itemId || this.currentItem._id,
                    tradeProductName: this.product.productName || this.currentItem.productName,
                    tradeGroup      : 'B2C',
                    tradeFolder     : this.cartFolder,
                    tradeQuantity   : this.itemQuantity || 1,
                    tradeStatus     : 'CartTrade',
                    tradeOwner      : this.$store.getters[ 'central/getCurrentUser' ]._id,
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
                                this.pageMessage = `${result.code}: ${result.value} |  ${cart.tradeQuantity} of ${this.product.productName} added to ${cartBox.catName} cart-category`;
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
            bookItem( itemId ) {
                // TODO: bookmark item | add to favourites (browser)
                console.log( 'book item' );
                // Set URL information for the current page
                this.$store.dispatch( 'central/setProductUrl', window.location.href + '/' + this.itemId );
                // Session.set( 'productUrl', window.location.href + '/' + this.itemId );
                // Go to send page and send the page URL to specified email address
                // console.log( Session.get( 'productUrl' ) );
            },
            sendItem() {
                // send item (page url) to self or friends / others
                // current item /product record:
                this.$store.dispatch( 'central/setProductItem', this.product || this.currentItem );
                // Session.set( 'currentProduct', this.product || this.currentItem );
                // Set URL information for the current page
                this.$store.dispatch( 'central/setProductUrl', window.location.href + '/' + this.itemId );
                // Session.set( 'productUrl', window.location.href + '/' + this.itemId );
                // Go to send page and send the page URL to specified email address
                this.$router.push( { name: 'searchProductEmail' } );
            },
            printItem( itemId ) {
                // TODO: Print item (page content) to screen / printer / pdf
                // console.log( 'print item' );
                // Simple print current page content/screen
                window.print();
            },
            defaultCartFolder() {
                const cartName = this.$constant.getDefaultCart();
                const cartInfo = this.orderCatItems.find( ( item ) => {
                    return ( item.catName === cartName && item.catGroup === 'Wish');
                } );
                return cartInfo ? cartInfo._id : '';
            },
            defaultWishFolder() {
                const wishName = this.$constant.getDefaultWish();
                const wishInfo = this.orderCatItems.find( ( item ) => {
                    return ( item.catName === wishName && item.catGroup === 'Folder');
                } );
                return wishInfo ? wishInfo._id : '';
            },
            productAvailable( item ) {
                let qtyTotal = 0,
                    qtySold  = 0;
                if( item.productQuantity ) {
                    qtyTotal = item.productQuantity;
                }
                // TODO: activate productQuantitySold section, after order creation
                if( item.productQuantitySold ) {
                    qtySold = item.productQuantitySold;
                }
                return (qtyTotal - qtySold);
            },
            showImage( item ) {
                this.currentImageUrl  = item.docUrl;
                this.currentImageText = item.docFile;
            },
            bigImg( x ) {
                const imgItem  = document.getElementById( 'imgItem' );
                x.style.height = "240px";
                x.style.width  = "240px";
            },
            normalImg( x ) {
                const imgItem  = document.getElementById( 'imgItem' );
                x.style.height = "60px";
                x.style.width  = "60px";
            },
            saveProduct() {
                // Set productOwner to currentUser, for non-admin-users
                const userInfo = this.$store.getters[ 'central/getCurrentUser' ];
                if( userInfo ) {
                    if( !userInfo.isAdmin ) {
                        this.product.productOwner = userInfo._id;
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
            // TODO: load current/prior item on page refresh (session may have cleared), all UIs
            // admin-user status (true or false)
            if( this.$store.getters[ 'central/getCurrentUser' ] ) {
                this.isAdmin = this.$store.getters[ 'central/getCurrentUser' ].isAdmin;
            }

            this.mcLabel    = this.$label;
            this.mcConstant = this.$constant;

            // capture id params from the bookmark/direct-search URL
            this.itemParamId = this.$route.params.id || '';

            const productItem = this.$store.getters[ 'central/getProductItem' ];
            if( productItem || !this.$lo.isEmpty( productItem ) ) {
                this.currentItem = productItem;
                this.itemId      = productItem._id;
            }

//            console.log(productItem);
//            return;

            // Fetch items from the server, based on role assignment / authorization
            this.fetchData();

            if( this.currentItem || !this.$lo.isEmpty( this.currentItem ) ) {
                const item   = this.currentItem;
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
                    productQuantity     : item.productQuantityTotal || 0,
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
            } else if( !this.$lo.isEmpty( productItem ) ) {
                const item       = productItem;
                this.currentItem = item;
                this.itemId      = item._id;
                this.product     = {
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
                    productQuantity     : item.productQuantityTotal || 0,
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
                    productCurrency     : 'US$',
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
        },
        ready() {
            this.cartFolder = this.defaultCartFolder( this.cartName );
            this.wishFolder = this.defaultWishFolder( this.wishName );
        },
    }
</script>
