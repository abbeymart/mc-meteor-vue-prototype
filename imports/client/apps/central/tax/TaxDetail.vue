<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.taxDetail}}</h4>
        </div>
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <form class="w3-margin-8">
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="taxName">{{mcLabel.name}}</label>
                        <input type="text" class="form-control" id="taxName"
                               :placeholder="mcLabel.name" maxlength="255" required autofocus
                               v-model="tax.taxName">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.taxName}}</span>
                    </div>
                    <div class="form-group">
                        <label for="taxCat">{{mcLabel.cat}}</label>
                        <select class="form-control" v-model="tax.taxCat" id="taxCat" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.cat}}</option>
                            <option v-for="item in taxCategories" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.taxCat}}</span>
                    </div>
                    <div class="form-group">
                        <label for="taxAmount">{{mcLabel.taxAmount}}</label>
                        <input type="number" min="0" step="0.01" class="form-control" id="taxAmount"
                               :placeholder="mcLabel.taxAmount" maxlength="25" required
                               v-model="tax.taxAmount">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.taxAmount}}</span>
                    </div>
                    <div class="form-group">
                        <label for="taxUnit">{{mcLabel.taxUnit}}</label>
                        <input type="text" class="form-control" id="taxUnit"
                               :placeholder="mcLabel.taxUnit" maxlength="25" required
                               v-model="tax.taxUnit">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.taxUnit}}</span>
                    </div>
                    <div v-if="tax.taxCat === 'Business Tax' || tax.taxCat === 'Property Tax' || tax.taxCat === 'Income Tax'"
                         class="form-group">
                        <label for="taxRangeFrom">{{mcLabel.taxRangeFrom}}</label>
                        <input type="number" min="0" step="0.01" class="form-control" id="taxRangeFrom"
                               :placeholder="mcLabel.taxRangeFrom" maxlength="50"
                               v-model="tax.taxRangeFrom">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.taxRangeFrom}}</span>
                    </div>
                    <div v-if="tax.taxCat === 'Business Tax' || tax.taxCat === 'Property Tax' || tax.taxCat === 'Income Tax' "
                         class="form-group">
                        <label for="taxRangeTo">{{mcLabel.taxRangeTo}}</label>
                        <input type="number" min="0" step="0.01" class="form-control" id="taxRangeTo"
                               :placeholder="mcLabel.taxRangeTo" maxlength="50"
                               v-model="tax.taxRangeTo">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.taxRangeTo}}</span>
                    </div>
                    <div class="form-group">
                        <label for="taxLang">{{mcLabel.lang}}</label>
                        <select class="form-control" v-model="tax.taxLang" id="taxLang" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                            <option v-for="item in langItems" :value="item.langCode">
                                {{item.langName}}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="taxJuri">{{mcLabel.taxJuri}}</label>
                        <select class="form-control" v-model="tax.taxJuri" id="taxJuri" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.taxJuri}}</option>
                            <option v-for="item in taxJuries" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.taxJuri}}</span>
                    </div>
                    <div class="form-group">
                        <label for="taxRegion">{{mcLabel.taxRegion}}</label>
                        <select class="form-control" v-model="tax.taxRegion" id="taxRegion" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.region}}</option>
                            <option v-for="item in taxRegions" :value="item._id">
                                {{item.locationName}}
                            </option>
                        </select>
                    </div>
                    <div v-if="tax.taxJuri==='Country' || tax.taxJuri==='State' || tax.taxJuri==='Province' || tax.taxJuri==='City'"
                         class="form-group">
                        <label for="taxCountry">{{mcLabel.taxCountry}}</label>
                        <select class="form-control" v-model="tax.taxCountry" id="taxCountry" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.country}}</option>
                            <option v-for="item in taxCountries" :value="item._id">
                                {{item.locationName}}
                            </option>
                        </select>
                    </div>
                    <div v-if="tax.taxJuri==='State' || tax.taxJuri==='Province' || tax.taxJuri==='City'"
                         class="form-group">
                        <label for="taxState">{{mcLabel.taxState}}</label>
                        <select class="form-control" v-model="tax.taxState" id="taxState" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.state}}</option>
                            <option v-for="item in taxStates" :value="item._id">
                                {{item.locationName}}
                            </option>
                        </select>
                    </div>
                    <div v-if="tax.taxJuri==='City'" class="form-group">
                        <label for="taxCity">{{mcLabel.taxCity}}</label>
                        <select class="form-control" v-model="tax.taxCity" id="taxCity" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.city}}</option>
                            <option v-for="item in taxCities" :value="item._id">
                                {{item.locationName}}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="taxDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="taxDesc" cols="30" rows="5"
                                  :placeholder="mcLabel.desc" v-model="tax.taxDesc" required></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.taxDesc}}</span>
                    </div>
                    <div class="form-group">
                        <label for="isActive">{{mcLabel.isActive}} </label>
                        <input class="w3-check" type="checkbox" id="isActive" v-model="tax.isActive">
                        <button class="btn btn-primary" @click.prevent="saveTax">
                            {{mcLabel.save}}
                        </button>
                    </div>
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
    import { validateTax } from'/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    export default{
        name    : 'taxDetail',
        data() {
            return {
                mcLabel        : {},
                langItems      : [],
                codeItems      : [],
                userItems      : [],
                locationItems  : [],
                tax            : {
                    taxName     : '',
                    taxCat      : '',
                    taxJuri     : '',
                    taxLocation : '',
                    taxRegion   : '',
                    taxCountry  : '',
                    taxState    : '',
                    taxCity     : '',
                    taxLang     : 'en-US',
                    taxAmount   : 0.00,
                    taxUnit     : '%',
                    taxRangeFrom: 0.00,
                    taxRangeTo  : 0.00,
                    taxDesc     : '',
                    isActive    : false
                },
                pageMessage    : '',
                isMessage      : false,
                currentUsername: '',
                itemId         : '',
                itemParams     : '',
                itemParamId    : '',
                validateErrors : '',
            }
        },
        computed: {
            taxCategories() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Taxes';
                } );
            },
            taxJuries() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Jurisdiction';
                } );
            },
            taxRegions() {
                return this.locationItems.filter( ( item ) => {
                    return item.locationType === 'Region';
                } );
            },
            taxCountries() {
                return this.locationItems.filter( ( item ) => {
                    return item.locationType === 'Country';
                } );
            },
            taxStates() {
                return this.locationItems.filter( ( item ) => {
                    return ((item.locationType === 'State' || item.locationType === 'Province') && (item.parentId = this.tax.taxCountry));
                } );
            },
            taxCities() {
                return this.locationItems.filter( ( item ) => {
                    return ((item.locationType === 'City') && (item.parentId = this.tax.taxState));
                } );
            },
        },
        methods : {
            catName( itemId ){
                const catName = _.find( this.codeItems, { _id: itemId } );
                return catName ? catName.codeName : 'n/a';
            },
            // Retrieve/get current item/record from the the server/database
            saveTax() {
                // taxLocation based on taxJuri, by region, country, state and city

//                this.tax.taxLocation = this.tax.taxRegion || '';
//                this.tax.taxCountry  = this.tax.taxCountry || '';
//                this.tax.taxState    = this.tax.taxState || '';
//                this.tax.taxCity     = this.tax.taxCity || '';

                const juri = this.tax.taxJuri;
                switch( juri ) {
                    case 'Region':
                        this.tax.taxLocation = this.tax.taxRegion;
                        this.tax.taxCountry  = '';
                        this.tax.taxState    = '';
                        this.tax.taxCity     = '';
                        break;
                    case 'Country':
                        this.tax.taxLocation = this.tax.taxCountry;
                        this.tax.taxRegion   = this.tax.taxRegion || '';
                        this.tax.taxState    = '';
                        this.tax.taxCity     = '';
                        break;
                    case 'State':
                        this.tax.taxLocation = this.tax.taxState;
                        this.tax.taxRegion   = this.tax.taxRegion || '';
                        this.tax.taxCity     = '';
                        break;
                    case 'City':
                        this.tax.taxLocation = this.tax.taxCity;
                        this.tax.taxRegion   = this.tax.taxRegion || '';
                        break;
                }

                // cast numbers
                this.tax.taxAmount    = Number( this.tax.taxAmount );
                this.tax.taxRangeFrom = Number( this.tax.taxRangeFrom );
                this.tax.taxRangeTo   = Number( this.tax.taxRangeTo );

                let errors = validateTax( this.tax );
                if( errors.taxName || errors.taxCat || errors.taxJuri || errors.taxLocation || errors.taxAmount || errors.taxUnit || errors.taxRangeFrom || errors.taxDesc || errors.taxLang ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveTax', this.tax, this.itemId, userToken, ( error, result ) => {
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
                    this.pageMessage = 'Please login';
                }
            },
        },
        created(){
            // token
            const userToken     = this.$auth.getToken(),
                  queryParams   = {},
                  currentItemId = '';
            this.mcLabel        = this.$label;
            // New or draft message
            if( Session.get( 'currentTaxItem' ) ) {
                const item  = Session.get( 'currentTaxItem' );
                this.itemId = item._id;
                this.tax    = {
                    taxName     : item.taxName,
                    taxCat      : item.taxCat,
                    taxJuri     : item.taxJuri,
                    taxLocation : item.taxLocation,
                    taxRegion   : item.taxRegion,
                    taxCountry  : item.taxCountry,
                    taxState    : item.taxState,
                    taxCity     : item.taxCity,
                    taxLang     : item.taxLang,
                    taxAmount   : item.taxAmount,
                    taxUnit     : item.taxUnit,
                    taxRangeFrom: item.taxRangeFrom,
                    taxRangeTo  : item.taxRangeTo,
                    taxDesc     : item.taxDesc,
                    isActive    : item.isActive,
                };
            } else {
                this.itemId = '';
                this.tax    = {
                    taxName     : '',
                    taxCat      : '',
                    taxJuri     : '',
                    taxLocation : '',
                    taxRegion   : '',
                    taxCountry  : '',
                    taxState    : '',
                    taxCity     : '',
                    taxLang     : 'en-US',
                    taxAmount   : 0.00,
                    taxUnit     : '%',
                    taxRangeFrom: 0.00,
                    taxRangeTo  : 0.00,
                    taxDesc     : '',
                    isActive    : false
                };
            }

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

            // current user information / record
            let currentUser = '';
            if( Session.get( 'currentUser' ) ) {
                currentUser = Session.get( 'currentUser' );
            }

            // currentUsername
            if( currentUser ) {
                this.currentUsername = `${currentUser.username} | ${currentUser.profile.firstName} ${currentUser.profile.lastName}`;
            }
        },
    }
</script>
