<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4 class="col-sm-6 w3-left"><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.productReviewDetail}}
            </h4>
        </div>
        <hr>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <fieldset>
                        <legend><h4>Product Review</h4></legend>
                        <div class="form-group">
                            <label for="reviewProduct">{{mcLabel.product}}</label>
                            <select class="form-control" v-model="review.reviewProduct" id="reviewProduct">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.product}}</option>
                                <option v-for="item in productItems" :value="item._id">
                                    {{ item.productName}}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.reviewProduct}}</span>
                        </div>
                        <!--owner/seller for admin-user only, for local market-->
                        <div v-if="isAdmin" class="form-group">
                            <label for="reviewBy">{{mcLabel.owner}}</label>
                            <select class="form-control" v-model="review.reviewBy" id="reviewBy">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.owner}}</option>
                                <option v-for="item in userItems" :value="item._id">
                                    {{ item.username }} | {{item.profile.firstName}} {{item.profile.lastName}}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.reviewBy}}</span>
                        </div>
                        <div class="form-group">
                            <label for="reviewLang">{{mcLabel.lang}}</label>
                            <select class="form-control" v-model="review.reviewLang" id="reviewLang" required>
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                                <option v-for="item in langItems" :value="item.langCode">
                                    {{ item.langName }}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.reviewLang}}</span>
                        </div>
                        <div class="form-group">
                            <label for="reviewDesc">{{mcLabel.desc}}</label>
                            <textarea class="form-control" id="reviewDesc" cols="30" rows="4"
                                      :placeholder="mcLabel.desc" v-model="review.reviewDesc"></textarea>
                            <span v-if="validateErrors" class="alert-warning">{{validateErrors.reviewDesc}}</span>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-4">
                                <label for="isActive">{{mcLabel.isActive}} </label>
                                <input class="w3-check" type="checkbox" id="isActive" v-model="review.isActive">
                            </div>
                            <div class="col-sm-4">
                                <button class="btn btn-primary" @click.prevent="saveItem">{{mcLabel.save}}</button>
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div class="col-sm-6">
                    <fieldset>
                        <legend><h4>Ratings</h4></legend>
                        <div class="form-group">
                            <label for="reviewProductScore">{{mcLabel.productRating}}</label>
                            <select class="form-control" v-model="review.reviewProductScore" id="reviewProductScore">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.productRating}}</option>
                                <option v-for="item in itemQuantities" :value="item">{{item}}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.reviewProductScore}}</span>
                        </div>
                        <div class="form-group">
                            <label for="reviewPriceScore">{{mcLabel.priceRating}}</label>
                            <select class="form-control" v-model="review.reviewPriceScore" id="reviewPriceScore">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.priceRating}}</option>
                                <option v-for="item in itemQuantities" :value="item">{{item}}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.reviewPriceScore}}</span>
                        </div>
                        <div class="form-group">
                            <label for="reviewShipScore">{{mcLabel.shipRating}}</label>
                            <select class="form-control" v-model="review.reviewShipScore" id="reviewShipScore">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.shipRating}}</option>
                                <option v-for="item in itemQuantities" :value="item">{{item}}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.reviewShipScore}}</span>
                        </div>
                        <div class="form-group">
                            <label for="reviewSellerScore">{{mcLabel.sellerRating}}</label>
                            <select class="form-control" v-model="review.reviewSellerScore" id="reviewSellerScore">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.sellerRating}}</option>
                                <option v-for="item in itemQuantities" :value="item">{{item}}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.reviewSellerScore}}</span>
                        </div>
                        <div class="form-group">
                            <label for="reviewValueScore">{{mcLabel.valueRating}}</label>
                            <select class="form-control" v-model="review.reviewValueScore" id="reviewValueScore">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.valueRating}}</option>
                                <option v-for="item in itemQuantities" :value="item">{{item}}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.reviewValueScore}}</span>
                        </div>
                    </fieldset>
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
    import { validateProductReview } from'/imports/lib/utils/ValidateRecord';

    export default{
        name      : 'orderProductReviewDetail',
        components: {},
        data() {
            return {
                mcLabel       : this.$label,
                mcConstant    : this.$constant,
                codeItems     : [],
                locationItems : [],
                userItems     : [],
                langItems     : [],
                productItems  : [],
                review        : {
                    reviewProduct     : '',
                    reviewProductScore: 1,
                    reviewPriceScore  : 1,
                    reviewShipScore   : 1,
                    reviewSellerScore : 1,
                    reviewValueScore  : 1,
                    reviewBy          : '',
                    reviewLang        : this.$constant.getDefaultLanguage(),
                    reviewDesc        : '',
                    isActive          : false,
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
            itemQuantities() {
                let qValue       = [];
                // return 1 to the maximum/available product quantities
                const startValue = 1;
                // TODO: get the least of maximum-allowed from mConstant.maxRating()
                const endValue   = 5; // maximum-allowed or available product quantities
                for( let i = startValue; i <= endValue; i++ ) {
                    qValue.push( i );
                }
                return qValue;
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
            saveItem() {
                // Set productOwner to currentUser, for non-admin-users
                const userInfo = this.$store.getters['central/getCurrentUser'];
                if( userInfo ) {
                    if( !userInfo.isAdmin ) {
                        this.review.reviewBy = userInfo._id;
                    }
                }
                // cast number items
                this.review.reviewProductScore = Number( this.review.reviewProductScore );
                this.review.reviewPriceScore   = Number( this.review.reviewPriceScore );
                this.review.reviewShipScore    = Number( this.review.reviewShipScore );
                this.review.reviewSellerScore  = Number( this.review.reviewSellerScore );
                this.review.reviewValueScore   = Number( this.review.reviewValueScore );

                // validate inputs:
                const errors = validateProductReview( this.review );
                if( errors.reviewProduct || errors.reviewProductScore || errors.reviewSellerScore || errors.reviewPriceScore || errors.reviewShipScore || errors.reviewValueScore || errors.reviewBy || errors.reviewLang || errors.reviewDesc ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveProductReview', this.review, this.itemId, userToken, ( error, result ) => {
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
                        this.pageMessage = 'inputs-errors: ' + JSON.stringify(errors);
                    }
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Please login';
                }
            },
        },
        created() {
            // admin-user status (true or false)
            const userInfo = this.$store.getters['central/getCurrentUser'];
            if( userInfo ) {
                this.isAdmin = userInfo.isAdmin;
            }
            if( Session.get( 'currentReviewItem' ) ) {
                const item  = Session.get( 'currentReviewItem' );
                this.itemId = item._id;
                this.review = {
                    reviewProduct     : item.reviewProduct,
                    reviewProductScore: item.reviewProductScore,
                    reviewPriceScore  : item.reviewPriceScore,
                    reviewShipScore   : item.reviewShipScore,
                    reviewSellerScore : item.reviewSellerScore,
                    reviewValueScore  : item.reviewValueScore,
                    reviewBy          : item.reviewBy,
                    reviewLang        : item.reviewLang || 'en-US',
                    reviewDesc        : item.reviewDesc,
                    isActive          : item.isActive,
                };
            } else {
                this.itemId = '';
                this.review = {
                    reviewProduct     : '',
                    reviewProductScore: 1,
                    reviewPriceScore  : 1,
                    reviewShipScore   : 1,
                    reviewSellerScore : 1,
                    reviewValueScore  : 1,
                    reviewBy          : '',
                    reviewLang        : 'en-US',
                    reviewDesc        : '',
                    isActive          : false,
                };
            }
            // Fetch items from the server, based on role assignment / authorization
            this.fetchData();
        },
    }
</script>
