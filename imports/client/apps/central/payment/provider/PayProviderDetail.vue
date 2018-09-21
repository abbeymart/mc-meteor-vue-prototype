<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.payProviderDetail}}</h4>
        </div>
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <form class="w3-margin-8">
            <div class="row">
                <div class="col-sm-6">
                    <!--payProvider: input-text-->
                    <div class="form-group">
                        <label for="payProvider">{{mcLabel.payProvider}}</label>
                        <input type="text" class="form-control" id="payProvider"
                               :placeholder="mcLabel.payProvider" maxlength="255" required autofocus
                               v-model="payProvider.payProvider">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.payProvider}}</span>
                    </div>
                    <!--payEnv: input-text-->
                    <div class="form-group">
                        <label for="payEnv">{{mcLabel.payEnv}}</label>
                        <input type="text" class="form-control" id="payEnv"
                               :placeholder="mcLabel.payEnv" maxlength="255" required
                               v-model="payProvider.payEnv">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.payEnv}}</span>
                    </div>
                    <!--payAccess: input-text-->
                    <div class="form-group">
                        <label for="payAccess">{{mcLabel.payAccess}}</label>
                        <input type="text" class="form-control" id="payAccess"
                               :placeholder="mcLabel.payAccess" maxlength="255" required
                               v-model="payProvider.payAccess">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.payAccess}}</span>
                    </div>
                    <!--payLocation: input-text / select  Country code -->
                    <div class="form-group">
                        <label for="payLocation">{{mcLabel.location}}</label>
                        <select class="form-control" v-model="payProvider.payLocation" id="payLocation" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.location}}</option>
                            <option v-for="item in payLocations" :value="item.locationCode">
                                {{ item.locationName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.payLocation}}</span>
                    </div>
                    <!--payDesc: text-->
                    <div class="form-group">
                        <label for="payDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="payDesc" cols="30" rows="5"
                                  :placeholder="mcLabel.desc" v-model="payProvider.payDesc"></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.payDesc}}</span>
                    </div>
                </div>
                <div class="col-sm-6">
                    <!--payType: select-->
                    <div class="form-group">
                        <label for="payType">{{mcLabel.payType}}</label>
                        <select class="form-control" v-model="payProvider.payType" id="payType" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.payType}}</option>
                            <option v-for="item in payTypes" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.payType}}</span>
                    </div>
                    <!--payEndPoint: input-text -->
                    <div class="form-group">
                        <label for="payEndPoint">{{mcLabel.payEndPoint}}</label>
                        <input type="text" class="form-control" id="payEndPoint"
                               :placeholder="mcLabel.payEndPoint" maxlength="255"
                               v-model="payProvider.payEndPoint">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.payEndPoint}}</span>
                    </div>
                    <!--payLocale: select Lang -->
                    <div class="form-group">
                        <label for="payLocale">{{mcLabel.payLocale}}</label>
                        <select class="form-control" v-model="payProvider.payLocale" id="payLocale" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                            <option v-for="item in langItems" :value="item.langCode">
                                {{ item.langName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.payLocale}}</span>
                    </div>
                    <!--payOwner: select User-->
                    <div class="form-group">
                        <label for="payOwner">{{mcLabel.user}}</label>
                        <select class="form-control" v-model="payProvider.payOwner" id="payOwner">
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.owner}}</option>
                            <option v-for="item in userItems" :value="item._id">
                                {{ item.username }} | {{item.profile.firstName}} {{item.profile.lastName}}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.payOwner}}</span>
                    </div>
                    <div class="form-group">
                        <label for="isActive">{{mcLabel.isActive}} </label>
                        <input class="w3-check" type="checkbox" id="isActive" v-model="payProvider.isActive">
                        <button class="btn btn-primary" @click.prevent="savePayProvider">
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
    import { validatePayProvider } from'/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    export default{
        name    : 'payProviderDetail',
        data() {
            return {
                mcLabel        : {},
                orderItems     : [],
                userItems      : [],
                langItems      : [],
                codeItems      : [],
                locationItems  : [],
                payProvider    : {
                    payProvider: '',
                    payType    : '',
                    payEnv     : '',
                    payAccess  : '',
                    payLocation: '',
                    payEndPoint: '',
                    payLocale  : 'en-US',
                    payOwner   : '',
                    payDesc    : '',
                    isActive   : false
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
            payTypes() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Payment';
                } );
            },
            payLocations() {
                return this.locationItems.filter( ( item ) => {
                    return item.locationType === 'Country';
                } );
            },
        },
        methods : {
            // Retrieve/get current item/record from the the server/database
            savePayProvider() {
                // validate inputs
                let errors = validatePayProvider( this.payProvider );
                if( errors.payProvider || errors.payType || errors.payEnv || errors.payAccess || errors.payLocation || errors.payOwner || errors.payLocale || errors.payEndPoint ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'savePayProvider', this.payProvider, this.itemId, userToken, ( error, result ) => {
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
        created(){
            // token
            const userToken     = this.$auth.getToken(),
                  queryParams   = {},
                  currentItemId = '';
            this.mcLabel        = this.$label;
            // New or draft message
            if( Session.get( 'currentPayProviderItem' ) ) {
                const item  = Session.get( 'currentPayProviderItem' );
                this.itemId = item._id;
                this.payProvider    = {
                    payProvider: item.payProvider,
                    payType    : item.payType,
                    payEnv     : item.payEnv,
                    payAccess  : item.payAccess,
                    payLocation: item.payLocation,
                    payEndPoint: item.payEndPoint,
                    payLocale  : item.payLocale,
                    payOwner   : item.payOwner,
                    payDesc    : item.payOwner,
                    isActive   : item.isActive
                };
            } else {
                this.itemId = '';
                this.payProvider    = {
                    payProvider: '',
                    payType    : '',
                    payEnv     : '',
                    payAccess  : '',
                    payLocation: '',
                    payEndPoint: '',
                    payLocale  : 'en-US',
                    payOwner   : '',
                    payDesc    : '',
                    isActive   : false
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
        },
    }
</script>
