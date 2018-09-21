<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.addressDetail}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="contactName">{{mcLabel.fullName}}</label>
                        <input type="text" class="form-control" id="contactName"
                               :placeholder="mcLabel.contactName" maxlength="25" required autofocus
                               v-model="address.contactName">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.contactName}}</span>
                    </div>
                    <div class="form-group">
                        <label for="streetNumber">{{mcLabel.streetNumber}}</label>
                        <input type="number" min="1" step="1" class="form-control" id="streetNumber"
                               :placeholder="mcLabel.streetNumber" maxlength="25" required autofocus
                               v-model="address.streetNumber">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.streetNumber}}</span>
                    </div>
                    <div class="form-group">
                        <label for="streetName">{{mcLabel.streetName}}</label>
                        <input type="text" class="form-control" id="streetName"
                               :placeholder="mcLabel.streetName" maxlength="255" required
                               v-model="address.streetName">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.streetName}}</span>
                    </div>
                    <div class="form-group">
                        <label for="postalCode">{{mcLabel.postalCode}}</label>
                        <input type="text" class="form-control" id="postalCode"
                               :placeholder="mcLabel.postalCode" maxlength="25"
                               v-model="address.postalCode" required>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.postalCode}}</span>
                    </div>
                    <div class="form-group">
                        <label for="addressCity">{{mcLabel.addressCity}}</label>
                        <input type="text" min="0" class="form-control" id="addressCity"
                               :placeholder="mcLabel.addressCity" maxlength="100" required
                               v-model="address.addressCity">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.addressCity}}</span>
                    </div>
                    <div class="form-group">
                        <label for="addressDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="addressDesc" cols="30" rows="5" :placeholder="mcLabel.desc"
                                  v-model="address.addressDesc"></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.addressDesc}}</span>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="addressType">{{mcLabel.addressType}}</label>
                        <select class="form-control" v-model="address.addressType" id="addressType" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.addressType}}</option>
                            <option v-for="item in addressTypes" :value="item.codeName" :key="item._id">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.addressType}}</span>
                    </div>
                    <div class="form-group">
                        <label for="streetType">{{mcLabel.streetType}}</label>
                        <select class="form-control" v-model="address.streetType" id="streetType" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.streetType}}</option>
                            <option v-for="item in streetTypes" :value="item.codeName" :key="item._id">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.streetType}}</span>
                    </div>
                    <div class="form-group">
                        <label for="addressCountry">{{mcLabel.addressCountry}}</label>
                        <select class="form-control" v-model="address.addressCountry" id="addressCountry" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.country}}</option>
                            <option v-for="item in addressCountries" :value="item._id" :key="item._id">
                                {{ item.locationName }}
                            </option>
                        </select>
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.addressCountry}}</span>
                    </div>
                    <div class="form-group">
                        <label for="addressState">{{mcLabel.addressState}}</label>
                        <select class="form-control" v-model="address.addressState" id="addressState" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.state}}</option>
                            <option v-for="item in addressStates" :value="item._id" :key="item._id">
                                {{ item.locationName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.addressState}}</span>
                    </div>
                    <div class="form-group">
                        <label for="contactPhone">{{mcLabel.phoneNumber}}</label>
                        <input type="text" class="form-control" id="contactPhone"
                               :placeholder="mcLabel.contactPhone" maxlength="25" required autofocus
                               v-model="address.contactPhone">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.contactPhone}}</span>
                    </div>
                    <div class="form-group">
                        <label for="addressLang">{{mcLabel.lang}}</label>
                        <select class="form-control" v-model="address.addressLang" id="addressLang" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                            <option v-for="item in langItems" :value="item.langCode" :key="item._id">
                                {{ item.langName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.addressLang}}</span>
                    </div>
                    <div class="form-group">
                        <label for="isActive">{{mcLabel.isActive}} </label>
                        <input class="w3-check" type="checkbox" id="isActive" v-model="address.isActive">
                        <button id="saveAddress" class="btn btn-primary" @click.prevent="saveAddress">{{mcLabel.save}}</button>
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
    import { validateAddress } from '/imports/lib/utils/ValidateRecord';
    import { centralMixin } from '../../../include/mixins/centralMixin';
    import { locationMixin } from '../../../include/mixins/locationMixin';


    export default {
        name      : 'addressDetail',
        components: {},
        mixins    : [
            centralMixin,
            locationMixin,
        ],
        data() {
            return {
                langItems     : [],
                codeItems     : [],
                locationItems : [],
                address       : {
                    contactName   : '',
                    contactId     : '',
                    contactPhone  : '',
                    streetNumber  : '',
                    streetName    : '',
                    streetType    : '',
                    postalCode    : '',
                    addressCity   : '',
                    addressState  : '',
                    addressCountry: '',
                    addressLang   : 'en-US',
                    addressType   : '',
                    addressDesc   : '',
                    isActive      : false,
                    ownerId       : this.$store.getters['central/getOwnerId'] || '',
                    ownerType     : this.$store.getters['central/getOwnerType'] || '',
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
            addressTypes() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Address';
                } );
            },
            streetTypes() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Street';
                } );
            },
            streetDirections() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Direction';
                } );
            },
            addressCountries() {
                return this.locationItems.filter( ( item ) => {
                    return item.locationType === 'Country';
                } );
            },
            addressStates() {
                return this.locationItems.filter( ( item ) => {
                    return ((item.parentId === this.address.addressCountry) && (item.locationType === 'Province' || item.locationType === 'State'));
                } );
            },
        },
        methods   : {
            fetchData() {
                // token
                const userToken     = this.$auth.getToken(),
                      queryParams   = {},
                      currentItemId = '';
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
            // Retrieve/get current item/record from the the server/database
            saveAddress() {
                // disable save button
                $('#saveAddress').prop('disable', true);

                // cast data/number and validate inputs:
                this.address.streetNumber = Number( this.address.streetNumber );

                const errors = validateAddress( this.address );
                if( errors.contactName || errors.contactPhone || errors.streetNumber || errors.streetName || errors.postalCode || errors.addressCity || errors.addressState || errors.addressCountry || errors.addressLang || errors.addressType ) {
                    this.validateErrors = errors;
                }
                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveAddress', this.address, this.itemId, userToken, ( error, result ) => {
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
                        this.pageMessage = 'inputs-errors: ' + JSON.stringify(errors);
                    }
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Please login';
                }
                // enable save button
                $('#saveAddress').prop('disable', false);
            },
        },
        created() {
            // currentItem
            const item = this.$store.getters['central/getAddressItem'];
            if(!this.$lo.isEmpty(item)) {
                this.itemId  = item._id;
                this.address = {
                    contactName   : item.contactName,
                    contactId     : item.contactId,
                    contactPhone  : item.contactPhone,
                    streetNumber  : item.streetNumber,
                    streetName    : item.streetName,
                    streetType    : item.streetType,
                    postalCode    : item.postalCode,
                    addressCity   : item.addressCity,
                    addressState  : item.addressState,
                    addressCountry: item.addressCountry,
                    addressLang   : item.addressLang,
                    addressType   : item.addressType,
                    addressDesc   : item.addressDesc,
                    isActive      : item.isActive,
                    ownerId       : item.ownerId || this.$store.getters['central/getOwnerId'] || '',
                    ownerType     : item.ownerType || this.$store.getters['central/getOwnerType'] || '',
                };
            } else {
                this.itemId  = '';
                this.address = {
                    contactName   : '',
                    contactId     : '',
                    contactPhone  : '',
                    streetNumber  : '',
                    streetName    : '',
                    streetType    : '',
                    postalCode    : '',
                    addressCity   : '',
                    addressState  : '',
                    addressCountry: '',
                    addressLang   : 'en-US',
                    addressType   : '',
                    addressDesc   : '',
                    isActive      : false,
                    ownerId       : this.$store.getters['central/getOwnerId'] || '',
                    ownerType     : this.$store.getters['central/getOwnerType'] || '',
                };
            }
            // if currentUserItem, set address-contactName and contactId
            const userInfo = this.$store.getters[ 'central/getUserItem' ];
            if( userInfo && this.address.contactName === '' ) {
                this.address.contactName = `${userInfo.profile.firstName} ${userInfo.profile.lastName}`;
                this.address.contactId   = userInfo._id;
            }
            // fetch data
            // this.fetchData();
        },
    }
</script>
