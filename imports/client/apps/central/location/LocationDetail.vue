<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.locationDetail}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="locationCode">{{mcLabel.code}}</label>
                        <input type="text" class="form-control" id="locationCode"
                               :placeholder="mcLabel.code" maxlength="100" required autofocus
                               v-model="location.locationCode">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.locationCode}}</span>
                    </div>
                    <div class="form-group">
                        <label for="locationName">{{mcLabel.name}}</label>
                        <input type="text" class="form-control" id="locationName"
                               :placeholder="mcLabel.name" maxlength="255" required
                               v-model="location.locationName">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.locationCode}}</span>
                    </div>
                    <div class="form-group">
                        <label for="locationTimezone">{{mcLabel.timezone}}</label>
                        <input type="text" class="form-control" id="locationTimezone"
                               :placeholder="mcLabel.timezone" maxlength="100"
                               v-model="location.locationTimezone">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.locationCode}}</span>
                    </div>
                    <div class="form-group">
                        <label for="locationPhoneCode">{{mcLabel.phoneCode}}</label>
                        <input type="number" min="0" class="form-control" id="locationPhoneCode"
                               :placeholder="mcLabel.phoneCode" maxlength="25" required
                               v-model="location.locationPhoneCode">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.locationCode}}</span>
                    </div>
                    <div class="form-group">
                        <label for="locationDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="locationDesc" cols="30" rows="5"
                                  :placeholder="mcLabel.desc" v-model="location.locationDesc"></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.locationDesc}}</span>
                    </div>

                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="locationLat">{{mcLabel.lat}}</label>
                        <input type="number" class="form-control" id="locationLat"
                               :placeholder="mcLabel.lat" maxlength="25"
                               v-model="location.locationLat">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.locationLat}}</span>
                    </div>
                    <div class="form-group">
                        <label for="locationLong">{{mcLabel.long}}</label>
                        <input type="number" class="form-control" id="locationLong"
                               :placeholder="mcLabel.long" maxlength="25"
                               v-model="location.locationLong">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.locationLong}}</span>
                    </div>
                    <div class="form-group">
                        <label for="locationLang">{{mcLabel.lang}}</label>
                        <select class="form-control" v-model="location.locationLang" id="locationLang" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                            <option v-for="item in langItems" :value="item.langCode" :key="item._id">
                                {{ item.langName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.locationLang}}</span>
                    </div>
                    <div class="form-group">
                        <label for="locationType">{{mcLabel.type}}</label>
                        <select class="form-control" v-model="location.locationType" id="locationType" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.type}}</option>
                            <option v-for="item in locationTypes" :value="item.codeName" :key="item._id">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.locationType}}</span>
                    </div>
                    <div class="form-group">
                        <label for="locationCurrency">{{mcLabel.currency}}</label>
                        <select class="form-control" v-model="location.locationCurrency" id="locationCurrency" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.currency}}</option>
                            <option v-for="item in locationCurrencies" :value="item.codeName" :key="item._id">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.locationCurrency}}</span>
                    </div>
                    <div class="form-group">
                        <label for="locationParent">{{mcLabel.parent}}</label>
                        <select class="form-control" v-model="location.parentId" id="locationParent">
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.parent}}</option>
                            <option v-for="item in parentItems" :value="item._id" :key="item._id">
                                {{ item.locationName }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="isActive">{{mcLabel.isActive}} </label>
                        <input class="w3-check" type="checkbox" id="isActive" v-model="location.isActive">
                        <button class="btn btn-primary" @click.prevent="saveLocation">{{mcLabel.save}}</button>
                    </div>
                </div>
            </div>
        </form>
        <hr>
        <!--<span v-if="isMessage" class="alert-info">{{pageMessage}}</span>-->
    </div>
</template>

<style>

</style>
<script>
    // View components, locales...
    import { Meteor } from 'meteor/meteor';
    import { validateLocation } from '/imports/lib/utils/ValidateRecord';
    import { centralMixin } from '../../../include/mixins/centralMixin';

    export default {
        name      : 'locationDetail',
        components: {},
        mixins    : [
            centralMixin,
        ],
        data() {
            return {
                mcLabel       : this.$label,
                langItems     : [],
                codeItems     : [],
                locationItems : [],
                location      : {
                    locationCode     : '',
                    locationName     : '',
                    locationDesc     : '',
                    locationTimezone : '',
                    locationLat      : 0,
                    locationLong     : 0,
                    locationPhoneCode: 0,
                    locationType     : '',
                    locationCurrency : '',
                    parentId         : '',
                    locationLang     : this.$constant.getDefaultLanguage(),
                    isActive         : false
                },
                pageMessage   : '',
                isMessage     : false,
                itemId        : '',
                itemParams    : '',
                itemParamId   : '',
                validateErrors: '',

            }
        },
        computed  : {
            // Lookup parents-items, by solution hierarchy (solution-packageGroup-package-function...)
            parentItems() {
                const itemType = this.location.locationType;
                switch( itemType ) {

                    case 'Shelve': {
                        return this.locationItems.filter( ( item ) => {
                            return ((item._id !== this.itemId) && (item.locationType === 'Cabinet'));
                        } );
                        break;
                    }
                    case 'Cabinet': {
                        return this.locationItems.filter( ( item ) => {
                            return ((item._id !== this.itemId) && (item.locationType === 'Storage'));
                        } );
                        break;
                    }
                    case 'Storage': {
                        return this.locationItems.filter( ( item ) => {
                            return ((item._id !== this.itemId) && (item.locationType === 'City' || item.locationType === 'Town'));
                        } );
                        break;
                    }
                    case 'Place': {
                        return this.locationItems.filter( ( item ) => {
                            return ((item._id !== this.itemId) && (item.locationType === 'City' || item.locationType === 'Town'));
                        } );
                        break;
                    }
                    case 'Town':
                    case 'City': {
                        return this.locationItems.filter( ( item ) => {
                            return ((item._id !== this.itemId) && (item.locationType === 'Province' || item.locationType === 'State'));
                        } );
                        break;
                    }
                    case 'Province':
                    case 'State': {
                        return this.locationItems.filter( ( item ) => {
                            return ((item._id !== this.itemId) && (item.locationType === 'Country'));
                        } );
                        break;
                    }
                    case 'Country': {
                        return this.locationItems.filter( ( item ) => {
                            return ((item._id !== this.itemId) && (item.locationType === 'Continent' || item.locationType === 'Region'));
                        } );
                        break;
                    }
                    case 'Continent':
                    case 'Region': {
                        return this.locationItems.filter( ( item ) => {
                            return ((item._id !== this.itemId) && (item.locationType === 'Planet'));
                        } );
                        break;
                    }
                    case 'Planet': {
                        return this.locationItems.filter( ( item ) => {
                            return ((item._id !== this.itemId) && (item.locationType === 'Solar'));
                        } );
                        break;
                    }
                    case 'Solar': {
                        return this.locationItems.filter( ( item ) => {
                            return ((item._id !== this.itemId) && (item.locationType === 'Galaxy'));
                        } );
                        break;
                    }
                    case 'Galaxy': {
                        return this.locationItems.filter( ( item ) => {
                            return ((item._id !== this.itemId) && (item.locationType === 'Universe'));
                        } );
                        break;
                    }
                }
            },
            locationTypes() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Location';
                } );
            },
            locationCurrencies() {
                // id for Currency sub-category
                const currency = this.codeItems.find( item => {
                    return item.codeName === 'Currency';
                } );
                if( currency ) {
                    return this.codeItems.filter( ( item ) => {
                        return item.codeCat === 'Measurement' && item.parentId === currency._id;
                    } );
                }
            },
        },
        methods   : {
            // Retrieve/get current item/record from the the server/database
            saveLocation() {
                // validate inputs:
                this.location.locationPhoneCode = Number( this.location.locationPhoneCode );
                this.location.locationLat       = Number( this.location.locationLat );
                this.location.locationLong      = Number( this.location.locationLong );

                const errors = validateLocation( this.location );
                if( errors.locationCode || errors.locationName || errors.locationDesc || errors.locationType || errors.locationLang || errors.locationPhoneCode ) {
                    this.validateErrors = errors;
                }
                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveLocation', this.location, this.itemId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage = true;
                                // capture new record itemId
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
            // token
            const userToken     = this.$auth.getToken(),
                  queryParams   = {},
                  currentItemId = '',
                  item          = this.$store.getters[ 'central/getLocItem' ];

            if( item ) {
                this.itemId   = item._id;
                this.location = {
                    locationCode     : item.locationCode,
                    locationName     : item.locationName,
                    locationDesc     : item.locationDesc,
                    locationTimezone : item.locationTimezone,
                    locationLat      : item.locationLat,
                    locationLong     : item.locationLong,
                    locationPhoneCode: item.locationPhoneCode,
                    locationType     : item.locationType,
                    locationCurrency : item.locationCurrency,
                    parentId         : item.parentId,
                    locationLang     : item.locationLang,
                    isActive         : item.isActive,
                };
            } else {
                this.itemId   = '';
                this.location = {
                    locationCode     : '',
                    locationName     : '',
                    locationDesc     : '',
                    locationTimezone : '',
                    locationLat      : 0,
                    locationLong     : 0,
                    locationPhoneCode: 0,
                    locationType     : '',
                    locationCurrency : '',
                    parentId         : '',
                    locationLang     : this.$constant.getDefaultLanguage(),
                    isActive         : false
                };
            }
            if( userToken ) {
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
            } else {
                this.isMessage   = true;
                this.pageMessage = 'Access-key missing or expired. Please login again.';
            }
        },
    }

</script>