<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4 class="col-sm-10 w3-left"><i class="glyphicon glyphicon-th-list"/> {{mcLabel.wishFolder}}</h4>
            <span class="col-sm-2">
                <!--TODO: resolve conflict of wishFolders with orderWishItems-->
                <div class="form-group">
                    <select class="form-control" v-model="currentWishFolder" id="currentFolder"
                            v-on:change="listWishItems">
                        <option disabled value="">{{mcLabel.select}} {{mcLabel.wish}}</option>
                        <option v-for="item in wishFolders" :value="item._id">{{item.catName}} </option>
                    </select>
                </div>
            </span>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="w3-container">
                <!--resolve conflict of wishFolders with orderWishItems-->
                <!--
                <div>
                    <h4>Wish-Folders</h4>
                    <div>
                        <select class="form-control" v-model="currentWishFolder" id="currentFolder"
                                v-on:change="listWishItems">
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.wish}}</option>
                            <option v-for="wish in wishFolders" :value="wish._id">
                                {{ wish.catName}}
                            </option>
                        </select>
                    </div>
                </div>
                -->
                <div>
                    <table class="w3-table w3-striped w3-border w3-hoverable" id="mcOrderWishFolder">
                        <thead>
                        <tr v-if="isWishItems" class="w3-red">
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
                        <tr v-if="isWishItems" v-for="item in currentWishItems" :key="item._id">
                            <td>{{productName( item.wishProduct )}}</td>
                            <td>{{folderName( item.wishFolder )}}</td>
                            <td>{{item.wishQuantity}}</td>
                            <td>{{item.wishPriority}}</td>
                            <td>{{dateInfo( item.createdDate )}}</td>
                            <td>
                                <!--action: add-to-cart / wish-list on select or click-->
                                <div>
                                    <select class="form-control" v-model="wishFolder" id="wishFolder"
                                            v-on:change="moveWishItem(item)">
                                        <option disabled value="">{{mcLabel.select}} {{mcLabel.wish}}</option>
                                        <option v-for="wish in wishFolders" :value="wish._id">
                                            {{ wish.catName}}
                                        </option>
                                    </select>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <select class="form-control" v-model="cartFolder" id="cartFolder"
                                            v-on:change="addCartItem(item)">
                                        <option disabled value="">{{mcLabel.select}} {{mcLabel.cart}}</option>
                                        <option v-for="wish in cartFolders" :value="wish._id">
                                            {{ wish.catName}}
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
                <div v-if="!isWishItems">
                    <h4>No items in the current/selected wish-list: {{folderName(currentWishFolder)}}</h4>
                </div>
            </div>
        </div>
    </div>
</template>
<style>

</style>
<script>
    import { Meteor } from 'meteor/meteor';
    import { Session } from 'meteor/session';
    import { mcMessage } from '/imports/lib/locales/getMessage';
    import { validateProduct, validateTrade, validateWish, validateCart } from'/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';
    const moment = require( 'moment' );

    export default {
        name      : 'wishFolder',
        components: {},
        data() {
            return {
                mcLabel           : '',
                isMessage         : false,
                pageMessage       : '',
                orderWishItems    : [],
                orderCatItems     : [],
                productItems      : [],
                currentWishItems  : [],
                currentWishFolders: [],
                itemParams        : {},
                itemQuantity      : 1,
                itemId            : '',
                currentItem       : '',
                currentWishFolder : '',
                wishFolder        : '',
                cartFolder        : '',
                cartQuantity      : '',
                isWishItems       : false,
                isAdmin           : false,
                isSave            : false,
            }
        },
        computed  : {
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
                if( defaultFolder ) {

                    this.currentWishItems = this.orderWishItems.filter( ( item ) => {
                        return ( item.wishFolder === defaultFolder);
                    } );

                    if( this.currentWishItems.length >= 1 ) {
                        this.isWishItems = true;
                    } else {
                        this.isWishItems = false;
                    }

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
                // Fetch items from the server, based on role assignment / authorization
                // Get current logged-in user's token, for resource access
                const userToken     = this.$auth.getToken(),
                      queryParams   = {},
                      currentItemId = '';
                // DDP || Meteor.method
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
//                            this.currentWishFolders = result.value.filter( ( item ) => {
//                                return ( item.catGroup === 'Wish');
//                            } );
                            // Default wish folder ID:
                            const folder = result.value.find( ( item ) => {
                                return (item.catName === 'Wish List' && item.catGroup === 'Wish');
                            } );
                            if( !this.currentWishFolder ) {
                                this.currentWishFolder = folder._id;
                            }
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
                    // languages
                    Meteor.call( 'getLang', queryParams, currentItemId, userToken, ( error, result ) => {
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
                    // locations
                    Meteor.call( 'getLocation', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'LocationError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage     = false;
                            this.pageMessage   = 'Items available';
                            this.locationItems = _.sortBy( result.value, 'locationName' ).filter( ( item ) => {
                                return item.isActive === true;
                            } );
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
                            this.isMessage        = false;
                            this.pageMessage      = 'Items available';
                            this.orderWishItems   = _.sortBy( result.value, 'wishProductName' );
                            this.currentWishItems = result.value.filter( ( item ) => {
                                return ( item.wishFolder === this.currentWishFolder);
                            } );
                            if( result.value.length >= 1 ) {
                                this.isWishItems = true;
                            } else {
                                this.isWishItems = false;
                            }

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
            addCartItem( item ){
                // Add to cart
                let currentCartId = '';
                let cart          = {
                    tradeProduct : item.wishProduct,
                    tradeGroup   : 'B2C',
                    tradeFolder  : this.cartFolder,
                    tradeQuantity: this.itemQuantity || 1,
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
                                this.pageMessage = `${result.code}: ${result.value} |  ${cart.tradeQuantity} of ${item.wishProductName} added to ${cartBox.catName}`;
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
            moveWishItem( item ){
                // move item to another folder (change wishFolder only)
                let currentWishId = item._id;
//                const productName = productName( item.wishProduct );
                let wish          = {
                    wishProduct    : item.wishProduct,
                    wishProductName: item.wishProductName,
                    wishFolder     : this.wishFolder,
                    wishPriority   : item.wishPriority,
                    wishUrl        : '',
                    wishQuantity   : this.itemQuantity || 1,
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
                    this.currentWishItems = this.orderWishItems.filter( ( item ) => {
                        return ( item.wishFolder === defaultFolder);
                    } );
                }
                if( this.currentWishItems.length >= 1 ) {
                    this.isWishItems = true;
                } else {
                    this.isWishItems = false;
                }
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
            updateItems( items ) {
                // update multiple selected items

            },
            deleteItems( items ) {
                // delete multiple selected items

            },
        },
        created() {
            this.mcLabel = this.$label;
            // Fetch items from the server, based on role assignment / authorization
            // Get current logged-in user's token, for resource access
            this.fetchData();
        },
        updated() {
            // TODO: fix the DataTable/folder-select conflict or get ui-paging alternative to DataTable
//            $( '#mcOrderWishFolder' ).DataTable( {
//                destroy     : true,
//                "pagingType": "full_numbers",
//            } );
        },
    }
</script>