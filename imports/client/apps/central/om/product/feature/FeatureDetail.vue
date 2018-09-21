<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.productFeatureDetail}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <fieldset>
                        <legend><h4>Product Feature</h4></legend>
                        <div class="form-group">
                            <label for="featureProduct">{{mcLabel.product}}</label>
                            <select class="form-control" v-model="feature.featureProduct" id="featureProduct" required>
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.product}}</option>
                                <option v-for="item in productItems" :value="item._id">
                                    {{ item.productName }}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.featureProduct}}</span>
                        </div>
                        <div class="form-group">
                            <label for="featureKey">{{mcLabel.key}} [{{mcLabel.attr}}]</label>
                            <input type="text" class="form-control" id="featureKey"
                                   :placeholder="mcLabel.key" maxlength="255" required
                                   v-model="feature.featureKey">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.featureKey}}</span>
                        </div>
                        <div class="form-group">
                            <label for="featureValue">{{mcLabel.value}}</label>
                            <input type="text" class="form-control" id="featureValue"
                                   :placeholder="mcLabel.value" maxlength="255" required
                                   v-model="feature.featureValue">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.featureValue}}</span>
                        </div>
                        <div class="form-group">
                            <label for="featureCost">{{mcLabel.feature}} {{mcLabel.cost}}</label>
                            <input type="number" min="0" class="form-control" id="featureCost"
                                   :placeholder="mcLabel.cost" maxlength="64"
                                   v-model="feature.featureCost">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.featureCost}}</span>
                        </div>
                        <div class="form-group">
                            <label for="featureCostUnit">{{mcLabel.costUnit}}</label>
                            <select class="form-control" v-model="feature.featureCostUnit" id="featureCostUnit">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.costUnit}}</option>
                                <option v-for="item in costUnits" :value="item.codeName">
                                    {{ item.codeName}}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.featureCostUnit}}</span>
                        </div>
                        <div class="form-group">
                            <label for="featureTax">{{mcLabel.tax}}</label>
                            <select class="form-control" v-model="feature.featureTax" id="featureTax">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.tax}}</option>
                                <option v-for="item in taxes" :value="item.taxName">
                                    {{ item.taxName}}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.featureTax}}</span>
                        </div>
                        <div class="form-group">
                            <label for="featureDesc">{{mcLabel.desc}}</label>
                            <textarea class="form-control" id="featureDesc" cols="30" rows="3"
                                      :placeholder="mcLabel.desc" v-model="feature.featureDesc"></textarea>
                            <span v-if="validateErrors" class="alert-warning">{{validateErrors.featureDesc}}</span>
                        </div>
                    </fieldset>
                </div>
                <div class="col-sm-6">
                    <fieldset>
                        <legend><h4>Feature Discount</h4></legend>
                        <div class="form-group">
                            <label for="featureDiscount">{{mcLabel.discount}}</label>
                            <input type="number" min="0" class="form-control" id="featureDiscount"
                                   :placeholder="mcLabel.discount" maxlength="32"
                                   v-model="feature.featureDiscount">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.featureDiscount}}</span>
                        </div>
                        <div class="form-group">
                            <label for="featureDiscountUnit">{{mcLabel.discountUnit}}</label>
                            <input type="text" class="form-control" id="featureDiscountUnit"
                                   :placeholder="mcLabel.discountUnit" maxlength="12"
                                   v-model="feature.featureDiscountUnit">
                            <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.featureDiscountUnit}}</span>
                        </div>
                        <div class="form-group">
                            <label for="featureDiscountStart">{{mcLabel.discount}} {{mcLabel.startDate}}</label>
                            <input type="date" class="form-control" id="featureDiscountStart"
                                   :placeholder="mcLabel.startDate" maxlength="64"
                                   v-model="feature.featureDiscountStart">
                            <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.featureDiscountStart}}</span>
                        </div>
                        <div class="form-group">
                            <label for="featureDiscountEnd">{{mcLabel.discount}} {{mcLabel.endDate}}</label>
                            <input type="date" class="form-control" id="featureDiscountEnd"
                                   :placeholder="mcLabel.endDate" maxlength="64"
                                   v-model="feature.featureDiscountEnd">
                            <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.featureDiscountEnd}}</span>
                        </div>
                        <div class="form-group">
                            <label for="featureQuantity">{{mcLabel.quantity}}</label>
                            <input type="number" min="0" class="form-control" id="featureQuantity"
                                   :placeholder="mcLabel.quantity" maxlength="255"
                                   v-model="feature.featureQuantity">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.featureQuantity}}</span>
                        </div>
                        <div class="form-group">
                            <label for="featureSold">{{mcLabel.sold}}</label>
                            <input type="number" min="0" class="form-control" id="featureSold"
                                   :placeholder="mcLabel.sold" maxlength="255"
                                   v-model="feature.featureSold" disabled>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.featureSold}}</span>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-4">
                                <label for="isActive">{{mcLabel.isActive}} </label>
                                <input class="w3-check" type="checkbox" id="isActive" v-model="feature.isActive">
                            </div>
                            <div class="col-sm-4">
                                <label for="isTrade">{{mcLabel.isTrade}} </label>
                                <input class="w3-check" type="checkbox" id="isTrade" v-model="feature.isTrade">
                            </div>
                            <div class="col-sm-4">
                                <button class="btn btn-primary" @click.prevent="saveFeature">{{mcLabel.save}}</button>
                            </div>
                        </div>
                    </fieldset>
                    <!--TODO: feature image-->
                    <!--<div class="form-group">-->
                    <!--<label for="featureImage">{{mcLabel.image}}</label>-->
                    <!--<input type="file" class="form-control" id="featureImage"-->
                    <!--:placeholder="mcLabel.image" maxlength="255" required-->
                    <!--v-on:change="fileUpdate">-->
                    <!--<span v-if="validateErrors"-->
                    <!--class="help-block w3-yellow">{{validateErrors.featureImage}}</span>-->
                    <!--</div>-->
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
    import { Session } from 'meteor/session';
    import { validateProductFeature } from '/imports/lib/utils/ValidateRecord';

    export default {
        name      : 'productFeatureDetail',
        components: {},
        data() {
            return {
                mcLabel       : {},
                codeItems     : [],
                productItems  : [],
                taxItems      : [],
                userItems     : [],
                langItems     : [],
                featureItems  : [],
                feature       : {
                    featureProduct      : '',
                    featureKey          : '',
                    featureValue        : '',
                    featureCost         : 0.00,
                    featureCostUnit     : 'Once',
                    featureDiscount     : 0.00,
                    featureDiscountUnit : '%',
                    featureDiscountStart: this.formatDate( Date.now() ),
                    featureDiscountEnd  : this.formatDate( Date.now() ),
                    featureTax          : 'No Tax',
                    featureImage        : '',
                    featureDesc         : '',
                    featureQuantity     : 0,
                    featureSold         : 0,
                    isTrade             : true,
                    isActive            : false,
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
            fileUpdate() {
                this.product.productImage = document.getElementById( 'featureImage' ).value || '';
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
        },
        methods   : {
            formatDate( date ) {
                return this.$lo( date ).format( "YYYY-MM-DD" );
            },
            saveFeature() {
                // cast number items
                this.feature.featureCost     = Number( this.feature.featureCost );
                this.feature.featureDiscount = Number( this.feature.featureDiscount );
                this.feature.featureQuantity = Number( this.feature.featureQuantity );
                this.feature.featureSold     = Number( this.feature.featureSold );
                // validate inputs:
                const errors                 = validateProductFeature( this.feature );
                if( errors.featureProduct || errors.featureKey || errors.featureValue || errors.featureCost || errors.featureCostUnit || errors.featureDesc || errors.featureDiscount || errors.featureDiscountUnit || errors.featureDiscountStart || errors.featureDiscountEnd || errors.featureQuantity ) {
                    this.validateErrors = errors;
                }
                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveFeature', this.feature, this.itemId, userToken, ( error, result ) => {
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
            if( Session.get( 'currentUser' ) ) {
                this.isAdmin = Session.get( 'currentUser' ).isAdmin;
            }
            // token
            const userToken     = this.$auth.getToken(),
                  queryParams   = {},
                  currentItemId = '';
            this.mcLabel        = this.$label;
            if( Session.get( 'currentProductFeatureItem' ) ) {
                const item   = Session.get( 'currentProductFeatureItem' );
                this.itemId  = item._id;
                this.feature = {
                    featureProduct      : item.featureProduct,
                    featureKey          : item.featureKey,
                    featureValue        : item.featureValue,
                    featureCost         : item.featureCost,
                    featureCostUnit     : item.featureCostUnit,
                    featureDiscount     : item.featureDiscount,
                    featureDiscountUnit : item.featureDiscountUnit,
                    featureDiscountStart: this.formatDate( item.featureDiscountStart ),
                    featureDiscountEnd  : this.formatDate( item.featureDiscountEnd ),
                    featureTax          : item.featureTax,
                    featureImage        : item.featureImage,
                    featureDesc         : item.featureDesc || '',
                    featureQuantity     : item.featureQuantity || 0,
                    featureSold         : item.featureSold || 0,
                    isTrade             : item.isTrade,
                    isActive            : item.isActive,
                };
            } else {
                this.itemId  = '';
                this.feature = {
                    featureProduct      : '',
                    featureKey          : '',
                    featureValue        : '',
                    featureCost         : 0.00,
                    featureCostUnit     : 'Once',
                    featureDiscount     : 0.00,
                    featureDiscountUnit : '%',
                    featureDiscountStart: this.formatDate( Date.now() ),
                    featureDiscountEnd  : this.formatDate( Date.now() ),
                    featureTax          : 'No Tax',
                    featureImage        : '',
                    featureDesc         : '',
                    featureQuantity     : 0,
                    featureSold         : 0,
                    isTrade             : true,
                    featureQuantity     : 0,
                    featureSold         : 0,
                    isTrade             : true,
                    isActive            : false,
                };
            }
            Meteor.call( 'getAllLang', ( error, result ) => {
                if( error ) {
                    this.isMessage   = true;
                    this.pageMessage = 'LanguageError: Retry.';
                } else if( result.code === 'success' ) {
                    this.isMessage   = false;
                    this.pageMessage = 'Items available';
                    this.langItems   = this.$lo.sortBy( result.value, 'langName' ).filter( ( item ) => {
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
                    } else if( result.code === 'success'
                    ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.taxItems    = this.$lo.sortBy( result.value, 'taxName' );
                    }
                    else {
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
    }
</script>
