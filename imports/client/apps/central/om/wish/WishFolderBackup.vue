<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4 class="col-sm-6 w3-left"><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.wishFolder}}</h4>
        </div>
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <hr>
        <div class="w3-container">
            <div class="col-sm-2">
                <h4>Wish-Folders</h4>
                <div class="form-group">
                    <label for="currentFolder">{{mcLabel.select}} {{mcLabel.wish}}</label>
                    <select class="form-control" v-model="currentWishFolder" id="currentFolder"
                            v-on:change="listWishItems">
                        <option disabled value="">{{mcLabel.select}} {{mcLabel.wish}}</option>
                        <option v-for="item in wishFolders" :value="item._id">{{item.catName}} </option>
                    </select>
                </div>
            </div>
            <div class="col-sm-10">
                <h4>Wish-Items (by folder)</h4>
                <table class="w3-table w3-striped w3-border w3-hoverable" id="mcOrderWishFolderList">
                    <thead>
                    <tr class="w3-red">
                        <th scope="col">{{mcLabel.product}} {{mcLabel.name}}</th>
                        <th scope="col">{{mcLabel.folder}}</th>
                        <th scope="col">{{mcLabel.quantity}}</th>
                        <th scope="col">{{mcLabel.priority}}</th>
                        <th scope="col">{{mcLabel.dateAdded}}</th>
                        <th scope="col">{{mcLabel.moveWish}}</th>
                        <th scope="col">{{mcLabel.addCart}}</th>
                        <th scope="col">{{mcLabel.update}}</th>
                        <th scope="col">{{mcLabel.delete}}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in orderWishItems" :key="item._id">
                        <td>{{productName( item.wishProduct )}}</td>
                        <td>{{folderName( item.wishFolder )}}</td>
                        <td>{{item.wishQuantity}}</td>
                        <td>{{item.wishPriority}}</td>
                        <td>{{dateInfo( item.createdDate )}}</td>
                        <td>
                            <!--action: add-to-cart / move-wish-to-folder on select or click-->
                            <div>
                                <select class="form-control" v-model="wishFolder" id="wishFolder"
                                        v-on:change="moveWishItem">
                                    <option disabled value="">{{mcLabel.moveWish}}</option>
                                    <option v-for="wish in wishFolders" :value="wish._id">
                                        {{ wish.catName}}
                                    </option>
                                </select>
                            </div>
                        </td>
                        <td>
                            <div>
                                <select class="form-control" v-model="cartFolder" id="cartFolder"
                                        v-on:change="addCartItem">
                                    <option disabled value="">{{mcLabel.select}} {{mcLabel.cart}}</option>
                                    <option v-for="wish in cartFolders" :value="wish._id">
                                        {{ wish.catName}}
                                    </option>
                                </select>
                            </div>
                            <div>
                                <select class="form-control" v-model="cartQuantity" id="cartQuantity">
                                    <option disabled value="">{{mcLabel.select}} {{mcLabel.quantity}}</option>
                                    <option v-for="item in cartQuantities" :value="item">{{item}}
                                    </option>
                                </select>
                            </div>
                        </td>
                        <td>
                            <a id="editItem" href="#" @click.prevent="updateItem(item)">{{mcLabel.detail}}
                                <i class="glyphicon glyphicon-edit"/>
                            </a>
                        </td>
                        <td>
                            <a id="deleteItem" href="#" @click.prevent="deleteItem(item)">
                                {{mcLabel.delete}}<i class="glyphicon glyphicon-remove-circle"/>
                            </a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
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
    import { mcMessage } from '/imports/lib/locales/getMessage';
    import { Images } from '/imports/collections/Central';
    import { Products } from '/imports/collections/Asset';
    import { validateProduct, validateTrade, validateWish, validateCart } from'/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';
    const moment = require( 'moment' );

    export default{
        name      : 'wishFolder',
        components: {},
        data() {
            return {
                mcLabel            : {},
                mcConstant         : {},
                codeItems          : [],
                orderWishItems     : [],
                orderCatItems      : [],
                currentWishItems   : [],
                currentWishFolders : [],
                locationItems      : [],
                taxItems           : [],
                userItems          : [],
                langItems          : [],
                productItems       : [],
                productFeatureItems: [],
                productDocItems    : [],
                pageMessage        : '',
                isMessage          : false,
                currentImageUrl    : '',
                currentImageText   : '',
                currentItem        : '',
                itemId             : '',
                itemParams         : '',
                itemParamId        : '',
                isAdmin            : false,
                currentWishFolder  : '',
                wishFolder         : '',
                cartFolder         : '',
                cartQuantity       : '',
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
            itemRecord(){
                return Products.findOne( { _id: this.itemParamId } ) || this.product;
            },
            productImages(){
                return Images.find( {} ).fetch();
            },
            productFeatures(){
                // return features for the current item / product (this.itemId)
                return this.productFeatureItems.filter( ( item ) => {
                    return (item.featureProduct === this.itemId);
                } );
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
            wishItems(){
                const defaultFolder = this.currentWishFolder;
                console.log( defaultFolder );
                if( defaultFolder ) {
                    return this.orderWishItems.filter( ( item ) => {
                        return ( item.wishFolder === defaultFolder);
                    } );
                } else {
                    return this.orderWishItems;
                }
            },
            cartQuantities() {
                let qValue       = [];
                // return 1 to the maximum/available product quantities
                const startValue = 1;
                // TODO: get the least of maximum-allowed or available product quantities, from products
                const endValue   = 10; // maximum-allowed or available product quantities
                for( let i = startValue; i <= endValue; i++ ) {
                    qValue.push( i );
                }
                return qValue;
            },
        },
        methods   : {
            fetchData(){
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
                    // order categories
                    Meteor.call( 'getOrderCat', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'OrderCategoryError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage         = false;
                            this.pageMessage       = 'Items available';
                            this.orderCatItems     = _.sortBy( result.value, 'catName' );
                            this.currentWishFolder = result.value.filter( ( item ) => {
                                return ( item.catGroup === 'Wish');
                            } );

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
                    // wishes
                    Meteor.call( 'getWish', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'WishError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage      = false;
                            this.pageMessage    = 'Items available';
                            this.orderWishItems = _.sortBy( result.value, 'wishProductName' );
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
            dateInfo( longDate ){
                return moment( longDate ).format( "YYYY-MMM-DD" );
            },
            shortDesc ( item ) {
                // set the short description for item.desc
                return this.$utils.shortString( item, this.$constant.getShortDesc() );
            },
            productName( itemId ) {
                const product = this.productItems.find( ( item ) => {
                    return item._id === itemId;
                } );
                return product ? product.productName : 'n/a';
            },
            folderName( itemId ) {
                const folder = this.orderCatItems.find( ( item ) => {
                    return item._id === itemId;
                } );
                return folder ? folder.catName : 'n/a';
            },
            getItem( itemId ){
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
            userName( userId ){
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
            catName ( itemId ) {
                const itemInfo = this.orderCatItems.find( ( item ) => {
                    return (item._id === itemId && item.catGroup === 'Product');
                } );
                return itemInfo ? itemInfo.catName : 'n/a';
            },
            itemCost( item ) {
                return `${item.productCurrency}${item.productCost}`;
            },
            itemLocation( itemLoc ){
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
            addWishItem(){
                // Add to wish-list
                let currentWishId = '';
                let wish          = {
                    wishProduct    : this.itemId || this.currentItem._id,
                    wishProductName: this.product.productName || this.currentItem.productName,
                    wishFolder     : this.wishFolder,
                    wishPriority   : 'Medium',
                    wishUrl        : '',
                    wishQuantity   : this.cartQuantity || 1,
                    wishPurchased  : 0,
                    wishDesc       : '',
                    wishOwner      : Session.get( 'currentUser' )._id,
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
                    if( _.isEmpty( errors ) ) {
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
                        this.pageMessage = 'inputs-errors: ' + errors;
                    }
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Please login';
                }

            },
            addCartItem(){
                // Add to cart
                let currentCartId = '';
                let cart          = {
                    tradeProduct : this.itemId || this.currentItem._id,
                    tradeGroup   : 'B2C',
                    tradeFolder  : this.cartFolder,
                    tradeQuantity: this.cartQuantity || 1,
                    tradeStatus  : 'CartTrade',
                    tradeOwner   : Session.get( 'currentUser' )._id,
                    tradeDesc    : '',
                    tradeShipping: '',
                    tradePayment : '',
                    isActive     : true,
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
                    if( _.isEmpty( errors ) ) {
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
                                this.pageMessage = `${result.code}: ${result.value} |  ${cart.tradeQuantity} of ${this.product.productName} added to ${cartBox.catName}`;
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
            moveWishItem(){
                // TODO: Move item to another folder
                let currentWishId = '';
                let wish          = {
                    wishProduct    : this.itemId || this.currentItem._id,
                    wishProductName: this.product.productName || this.currentItem.productName,
                    wishFolder     : this.wishFolder,
                    wishPriority   : 'Medium',
                    wishUrl        : '',
                    wishQuantity   : this.cartQuantity || 1,
                    wishPurchased  : 0,
                    wishDesc       : '',
                    wishOwner      : Session.get( 'currentUser' )._id,
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
                    if( _.isEmpty( errors ) ) {
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
                        this.pageMessage = 'inputs-errors: ' + errors;
                    }
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Please login';
                }

            },
            listWishItems(){
                const defaultFolder = this.currentWishFolder;
                if( defaultFolder ) {
                    this.orderWishItems = this.orderWishItems.filter( ( item ) => {
                        return ( item.wishFolder === defaultFolder);
                    } );
                }
            },
            bookItem( itemId ){
                // TODO: bookmark item | add to favourites (browser)
                console.log( 'book item' );
                // Get URL information for the current page
                Session.set( 'productUrl', window.location.href + '/' + this.itemId );
                // Go to send page and send the page URL to specified email address
                console.log( Session.get( 'productUrl' ) );
            },
            sendItem(){
                // send item (page url) to self or friends / others
                // current item /product record:
                Session.set( 'currentProduct', this.product || this.currentItem );
                // Get URL information for the current page
                Session.set( 'productUrl', window.location.href + '/' + this.itemId );
                // Go to send page and send the page URL to specified email address
                this.$router.push( { name: 'searchProductEmail' } );
            },
            printItem( itemId ){
                // TODO: Print item (page content) to screen / printer / pdf
                console.log( 'print item' );
                // Simple print current page content/screen
                window.print();
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
            productAvailable( item ){
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
            showImage( item ){
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
            updateItem( item ) {
                // Set current item
                Session.set( 'currentOrderWishItem', item );
                // Route to detail page
                this.$router.push( { name: 'orderWishDetail' } );
            },
            deleteItem( item ) {
                const userToken = this.$auth.getToken();
                if( confirm( this.$message.confirmDelete ) ) {
                    const itemId = item._id;
                    if( !itemId ) {
                        this.isMessage   = false;
                        this.pageMessage = mcMessage.itemMissing;
                    }
                    // Meteor method
                    if( userToken ) {
                        Meteor.call( 'removeWishItem', itemId, userToken, ( error, result ) => {
                                if( error ) {
                                    this.isMessage   = true;
                                    this.pageMessage = `${error}: Error deleting item. Please retry`;
                                }
                                this.isMessage   = true;
                                this.pageMessage = `${result.code}: ${result.value}`;
                            }
                        )
                        ;
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = 'Please login';
                    }
                }
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
            this.mcLabel    = this.$label;
            this.mcConstant = this.$constant;

            // Fetch items from the server, based on role assignment / authorization
            this.fetchData();
        },
        updated() {
            // TODO: fix the table-data/display issue (data from computed/method not displaying)
            $( '#mcOrderWishFolderList' ).DataTable( {
                destroy     : true,
                "pagingType": "full_numbers",
            } );
        },
        ready(){
            this.cartFolder = this.defaultCartFolder( this.cartName );
            this.wishFolder = this.defaultWishFolder( this.wishName );
        },
    }
</script>