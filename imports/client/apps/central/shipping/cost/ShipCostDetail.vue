<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.shipCostDetail}}</h4>
        </div>
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <form class="w3-margin-8">
            <div class="row">
                <div class="col-sm-6">
                    <!--payProvider: input-text-->
                    <div class="form-group">
                        <label for="shipName">{{mcLabel.name}}</label>
                        <input type="text" class="form-control" id="shipName"
                               :placeholder="mcLabel.name" maxlength="255" required autofocus
                               v-model="shipCost.shipName">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.shipName}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipCat">{{mcLabel.cat}}</label>
                        <select class="form-control" v-model="shipCost.shipCat" id="shipCat" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.cat}}</option>
                            <option v-for="item in shipCategories" :value="item._id">
                                {{ item.catName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipCat}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipType">{{mcLabel.type}}</label>
                        <select class="form-control" v-model="shipCost.shipType" id="shipType" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.type}}</option>
                            <option v-for="item in shipTypes" :value="item._id">
                                {{ item.catName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipType}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipDuration">{{mcLabel.shipDuration}}</label>
                        <input type="number" min="1" class="form-control" id="shipDuration"
                               :placeholder="mcLabel.shipDuration" maxlength="255" required autofocus
                               v-model="shipCost.shipDuration">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.shipDuration}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipProvider">{{mcLabel.provider}}</label>
                        <select class="form-control" v-model="shipCost.shipProvider" id="shipProvider" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.provider}}</option>
                            <option v-for="item in shipProviderItems" :value="item._id">
                                {{ item.shipProvider }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipProvider}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipFixedCost">{{mcLabel.fixedCost}}</label>
                        <input type="number" min="0" step="0.01" class="form-control" id="shipFixedCost"
                               :placeholder="mcLabel.fixedCost" maxlength="255" required
                               v-model="shipCost.shipFixedCost">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.shipFixedCost}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipCost">{{mcLabel.cost}}</label>
                        <input type="number" min="0" step="0.01" class="form-control" id="shipCost"
                               :placeholder="mcLabel.cost" maxlength="255" required
                               v-model="shipCost.shipCost">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.shipCost}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipCurrency">{{mcLabel.currency}}</label>
                        <select class="form-control" v-model="shipCost.shipCurrency" id="shipCurrency" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.currency}}</option>
                            <option v-for="item in currencies" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipCurrency}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipCostType">{{mcLabel.costType}}</label>
                        <select class="form-control" v-model="shipCost.shipCostType" id="shipCostType" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.costType}}</option>
                            <option v-for="item in costTypes" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipCostType}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipMeasure">{{mcLabel.measure}}</label>
                        <input type="text" min="0" step="0.01" class="form-control" id="shipMeasure"
                               :placeholder="mcLabel.measure" maxlength="255" required
                               v-model="shipCost.shipMeasure">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.shipMeasure}}</span>
                    </div>
                </div>
                <div class="col-sm-6">
                    <!--TODO: Base location: Country/State/City | seller/production location-->
                    <!--shipFrom Country/State-->
                    <div class="form-group">
                        <label for="shipFrom">{{mcLabel.shipFrom}} {{mcLabel.location}}</label>
                        <select class="form-control" v-model="shipCost.shipFrom" id="shipFrom" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.shipFrom}} {{mcLabel.location}}
                            </option>
                            <option v-for="item in fromLocations" :value="item.locationCode">
                                {{ item.locationName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipFrom}}</span>
                    </div>
                    <!--TODO: Destination: Country/State/City/zipCode ( >> buyer address) -->
                    <div class="form-group">
                        <label for="locationType">{{mcLabel.shipTo}} {{mcLabel.location}} {{mcLabel.type}}</label>
                        <select class="form-control" v-model="shipCost.shipToType" id="locationType" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.location}} {{mcLabel.type}}</option>
                            <option v-for="item in locationTypes" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipToType}}</span>
                    </div>
                    <div v-if="shipCost.shipToType==='Country' || shipCost.shipToType==='State' || shipCost.shipToType==='Province' || shipCost.shipToType==='City'"
                         class="form-group">
                        <label for="shipCountry">{{mcLabel.shipTo}} {{mcLabel.country}}</label>
                        <select class="form-control" v-model="shipCost.shipToCountry" id="shipCountry" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.country}}</option>
                            <option v-for="item in shipCountries" :value="item._id">
                                {{item.locationName}}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipToCountry}}</span>
                    </div>
                    <div v-if="shipCost.shipToType==='State' || shipCost.shipToType==='Province' || shipCost.shipToType==='City'"
                         class="form-group">
                        <label for="shipState">{{mcLabel.shipTo}} {{mcLabel.state}}</label>
                        <select class="form-control" v-model="shipCost.shipToState" id="shipState" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.state}}</option>
                            <option v-for="item in shipStates" :value="item._id">
                                {{item.locationName}}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipToState}}</span>
                    </div>
                    <div v-if="shipCost.shipToType==='City'" class="form-group">
                        <label for="shipCity">{{mcLabel.shipTo}} {{mcLabel.city}}</label>
                        <select class="form-control" v-model="shipCost.shipToCity" id="shipCity" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.city}}</option>
                            <option v-for="item in shipCities" :value="item._id">
                                {{item.locationName}}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipToCity}}</span>
                    </div>

                    <div class="form-group">
                        <label for="shipDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="shipDesc" cols="30" rows="3"
                                  :placeholder="mcLabel.desc" v-model="shipCost.shipDesc"></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.shipDesc}}</span>
                    </div>
                    <div class="form-group">
                        <label for="isActive">{{mcLabel.isActive}} </label>
                        <input class="w3-check" type="checkbox" id="isActive" v-model="shipCost.isActive">
                        <button class="btn btn-primary" @click.prevent="saveShipCost">
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
    import { validateShipCost } from'/imports/lib/utils/ValidateRecord';

    export default{
        name    : 'shipCostDetail',
        data() {
            return {
                mcLabel          : {},
                orderItems       : [],
                userItems        : [],
                langItems        : [],
                codeItems        : [],
                catItems         : [],
                shipProviderItems: [],
                locationItems    : [],
                locationFromId   : '',
                shipCost         : {
                    shipName        : '',
                    shipProvider    : '',
                    shipCat         : '',
                    shipType        : '',
                    shipDuration    : 10,
                    shipFrom        : 'CA',
                    shipToType      : 'Country',
                    shipToCountry   : '',
                    shipToState     : '',
                    shipToCity      : '',
                    shipToPostalCode: '',
                    shipFixedCost   : 0.00001,
                    shipCost        : 0.00001,
                    shipCostType    : '',
                    shipCurrency    : '',
                    shipMeasure     : '',
                    shipDesc        : '',
                    isActive        : false,
                },
                pageMessage      : '',
                isMessage        : false,
                itemId           : '',
                itemParams       : '',
                itemParamId      : '',
                validateErrors   : '',
            }
        },
        computed: {
            shipCategories() {
                return this.catItems.filter( ( item ) => {
                    return ( item.catGroup === 'Shipping' );
                } );
            },
            shipTypes() {
                return this.catItems.filter( ( item ) => {
                    return (item.catGroup === 'Shipping Type');
                } );
            },
            locationTypes() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Location';
                } );
            },
            shipCountries() {
                return this.locationItems.filter( ( item ) => {
                    return item.locationType === 'Country';
                } );
            },
            shipStates() {
                return this.locationItems.filter( ( item ) => {
                    return ((item.locationType === 'State' || item.locationType === 'Province') && (item.parentId = this.shipCost.shipToCountry));
                } );
            },
            shipCities() {
                return this.locationItems.filter( ( item ) => {
                    return ((item.locationType === 'City') && (item.parentId = this.shipCost.shipToState));
                } );
            },
            currencies(){
                const parentInfo = this.codeItems.find( ( item ) => {
                    return item.codeName === 'Currency';
                } );
                if( parentInfo ) {
                    return this.codeItems.filter( ( item ) => {
                        return item.codeCat === 'Measurement' && item.parentId === parentInfo._id;
                    } );
                }

            },
            costTypes(){
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Cost Type';
                } );
            },
            fromLocations() {
                return this.locationItems.filter( ( item ) => {
                    return item.locationType === 'Country';
                } );
            },
            toLocations() {
                // TODO: shipTo depend on locationFrom and this.locationType (Region, Country, State)
                if( this.locationType === 'State' || this.locationType === 'Province' ) {
                    // Get the locationId of the source country (from seller-profile)
                    const locInfo = this.locationItems.find( ( item ) => {
                        return (item.locationCode === this.shipCost.shipFrom);
                    } );
                    if( locInfo ) {
                        return this.locationItems.filter( ( item ) => {
                            return ((item.locationType === 'State' || item.locationType === 'Province' ) && item.parentId === locInfo._id);
                        } );
                    }
                }
                return this.locationItems.filter( ( item ) => {
                    return item.locationType === this.locationType;
                } );
            },
            shipLocations() {
                return this.locationItems.filter( ( item ) => {
                    return item.locationType === this.locationType;
                } );
            },
        },
        methods : {
            fetchData(){
                // token
                const userToken     = this.$auth.getToken(),
                      queryParams   = {},
                      currentItemId = '';

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
                    // providers
                    Meteor.call( 'getShipProvider', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'ShipProviderError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage         = false;
                            this.pageMessage       = 'Items available';
                            this.shipProviderItems = this.$lo.sortBy( result.value, 'shipProvider' );
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                    // order categories
                    Meteor.call( 'getOrderCat', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'categoryError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.catItems    = this.$lo.sortBy( result.value, 'catName' ).filter( ( item ) => {
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
                            this.locationItems = this.$lo.sortBy( result.value, 'locationName' ).filter( ( item ) => {
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
            setFromLocation( item ){
                this.locationFromId = item._id;
            },
            // Retrieve/get current item/record from the the server/database
            saveShipCost() {

                // validate numbers
                this.shipCost.shipFixedCost = Number( this.shipCost.shipFixedCost );
                this.shipCost.shipCost      = Number( this.shipCost.shipCost );
                this.shipCost.shipDuration  = Number( this.shipCost.shipDuration );

                // valid, non-mandatory fields
                this.shipCost.shipToCountry    = this.shipCost.shipToCountry || '';
                this.shipCost.shipToState      = this.shipCost.shipToState || '';
                this.shipCost.shipToCity       = this.shipCost.shipToCity || '';
                this.shipCost.shipToPostalCode = this.shipCost.shipToPostalCode || '';

                // validate inputs
                let errors = validateShipCost( this.shipCost );
                if( errors.shipName || errors.shipCat || errors.shipType || errors.shipDuration || errors.shipFrom || errors.shipToCountry || errors.shipToState || errors.shipToCity || errors.shipToPostalCode || errors.shipFixedCost || errors.shipCost || errors.shipCostType || errors.shipCurrency || errors.shipDesc ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveShipCost', this.shipCost, this.itemId, userToken, ( error, result ) => {
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
            if( Session.get( 'currentShipCostItem' ) ) {
                const item    = Session.get( 'currentShipCostItem' );
                this.itemId   = item._id;
                this.shipCost = {
                    shipName        : item.shipName,
                    shipProvider    : item.shipProvider,
                    shipCat         : item.shipCat,
                    shipType        : item.shipType,
                    shipDuration    : item.shipDuration,
                    shipFrom        : item.shipFrom,
                    shipToType      : item.shipToType,
                    shipToCountry   : item.shipToCountry,
                    shipToState     : item.shipToState,
                    shipToCity      : item.shipToCity,
                    shipToPostalCode: item.shipToPostalCode,
                    shipFixedCost   : item.shipFixedCost,
                    shipCost        : item.shipCost,
                    shipCostType    : item.shipCostType,
                    shipCurrency    : item.shipCurrency,
                    shipMeasure     : item.shipMeasure,
                    shipDesc        : item.shipDesc,
                    isActive        : item.isActive,
                };
            } else {
                this.itemId   = '';
                this.shipCost = {
                    shipName        : '',
                    shipProvider    : '',
                    shipCat         : '',
                    shipType        : '',
                    shipDuration    : 10,
                    shipFrom        : 'CA',
                    shipToType      : 'Country',
                    shipToCountry   : '',
                    shipToState     : '',
                    shipToCity      : '',
                    shipToPostalCode: '',
                    shipFixedCost   : 0.00001,
                    shipCost        : 0.00001,
                    shipCostType    : '',
                    shipCurrency    : '',
                    shipMeasure     : '',
                    shipDesc        : '',
                    isActive        : false,
                };
            }

            // get/fetch data
            this.fetchData();
        },
    }
</script>
