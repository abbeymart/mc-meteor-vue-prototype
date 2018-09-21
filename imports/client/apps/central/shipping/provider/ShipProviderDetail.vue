<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.shipProviderDetail}}</h4>
        </div>
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <form class="w3-margin-8">
            <div class="row">
                <div class="col-sm-6">
                    <!--payProvider: input-text-->
                    <div class="form-group">
                        <label for="shipProvider">{{mcLabel.shipProvider}}</label>
                        <input type="text" class="form-control" id="shipProvider"
                               :placeholder="mcLabel.shipProvider" maxlength="255" required autofocus
                               v-model="shipProvider.shipProvider">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.shipProvider}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipEnv">{{mcLabel.shipEnv}}</label>
                        <input type="text" class="form-control" id="shipEnv"
                               :placeholder="mcLabel.shipEnv" maxlength="255" required
                               v-model="shipProvider.shipEnv">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.shipEnv}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipAccess">{{mcLabel.shipAccess}}</label>
                        <input type="text" class="form-control" id="shipAccess"
                               :placeholder="mcLabel.shipAccess" maxlength="255" required
                               v-model="shipProvider.shipAccess">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.shipAccess}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipLocation">{{mcLabel.location}}</label>
                        <select class="form-control" v-model="shipProvider.shipLocation" id="shipLocation" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.location}}</option>
                            <option v-for="item in payLocations" :value="item.locationCode">
                                {{ item.locationName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipLocation}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="shipDesc" cols="30" rows="5"
                                  :placeholder="mcLabel.desc" v-model="shipProvider.shipDesc"></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.shipDesc}}</span>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="shipType">{{mcLabel.shipType}}</label>
                        <select class="form-control" v-model="shipProvider.shipType" id="shipType" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.shipType}}</option>
                            <option v-for="item in shipTypes" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipType}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipEndPoint">{{mcLabel.shipEndPoint}}</label>
                        <input type="text" class="form-control" id="shipEndPoint"
                               :placeholder="mcLabel.shipEndPoint" maxlength="255"
                               v-model="shipProvider.shipEndPoint">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.shipEndPoint}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipLocale">{{mcLabel.shipLocale}}</label>
                        <select class="form-control" v-model="shipProvider.shipLocale" id="shipLocale" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.shipLocale}}</option>
                            <option v-for="item in langItems" :value="item.langCode">
                                {{ item.langName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipLocale}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipOwner">{{mcLabel.user}}</label>
                        <select class="form-control" v-model="shipProvider.shipOwner" id="shipOwner">
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.user}}</option>
                            <option v-for="item in userItems" :value="item._id">
                                {{ item.username }} | {{item.profile.firstName}} {{item.profile.lastName}}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipOwner}}</span>
                    </div>
                    <div class="form-group">
                        <label for="isActive">{{mcLabel.isActive}} </label>
                        <input class="w3-check" type="checkbox" id="isActive" v-model="shipProvider.isActive">
                        <button class="btn btn-primary" @click.prevent="saveShipProvider">
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
    import { validateShipProvider } from '/imports/lib/utils/ValidateRecord';

    export default {
        name    : 'shipProviderDetail',
        data() {
            return {
                mcLabel        : {},
                orderItems     : [],
                userItems      : [],
                langItems      : [],
                codeItems      : [],
                locationItems  : [],
                shipProvider   : {
                    shipProvider: '',
                    shipType    : '',
                    shipEnv     : '',
                    shipAccess  : '',
                    shipLocation: '',
                    shipEndPoint: '',
                    shipLocale  : 'en-US',
                    shipOwner   : '',
                    shipDesc    : '',
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
            shipTypes() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Shipping';
                } );
            },
            payLocations() {
                return this.locationItems.filter( ( item ) => {
                    return item.locationType === 'Country';
                } );
            },
        },
        methods : {
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
            // Retrieve/get current item/record from the the server/database
            saveShipProvider() {
                // validate inputs
                let errors = validateShipProvider( this.shipProvider );
                if( errors.shipProvider || errors.shipType || errors.shipEnv || errors.shipAccess || errors.shipLocation || errors.shipOwner || errors.shipLocale || errors.shipEndPoint ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
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
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveShipProvider', this.shipProvider, this.itemId, userToken, ( error, result ) => {
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
            // locales
            this.mcLabel = this.$label;
            // New or draft message
            const item   = this.$store.getters[ 'central/getShipProviderItem' ];
            if( item ) {
                this.itemId       = item._id;
                this.shipProvider = {
                    shipProvider: item.shipProvider,
                    shipType    : item.shipType,
                    shipEnv     : item.shipEnv,
                    shipAccess  : item.shipAccess,
                    shipLocation: item.shipLocation,
                    shipEndPoint: item.shipEndPoint,
                    shipLocale  : item.shipLocale,
                    shipOwner   : item.shipOwner,
                    shipDesc    : item.shipOwner,
                    isActive    : item.isActive
                };
            } else {
                this.itemId       = '';
                this.shipProvider = {
                    shipProvider: '',
                    shipType    : '',
                    shipEnv     : '',
                    shipAccess  : '',
                    shipLocation: '',
                    shipEndPoint: '',
                    shipLocale  : 'en-US',
                    shipOwner   : '',
                    shipDesc    : '',
                    isActive    : false
                };
            }

            // fetch-data
            this.fetchData();
        },
    }
</script>
