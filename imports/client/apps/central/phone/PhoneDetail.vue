<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.phoneDetail}}</h4>
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
                               v-model="phone.contactName">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.contactName}}</span>
                    </div>
                    <div class="form-group">
                        <label for="phoneNumber">{{mcLabel.phoneNumber}}</label>
                        <input type="text" class="form-control" id="phoneNumber"
                               :placeholder="mcLabel.phoneNumber" maxlength="25" required autofocus
                               v-model="phone.phoneNumber">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.phoneNumber}}</span>
                    </div>
                    <div class="form-group">
                        <label for="phoneDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="phoneDesc" cols="30" rows="5" :placeholder="mcLabel.desc"
                                  v-model="phone.phoneDesc"></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.phoneDesc}}</span>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="phoneType">{{mcLabel.type}}</label>
                        <select class="form-control" v-model="phone.phoneType" id="phoneType" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.type}}</option>
                            <option v-for="item in phoneTypes" :value="item.codeName" :key="item._id">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.phoneType}}</span>
                    </div>
                    <div class="form-group">
                        <label for="phoneLang">{{mcLabel.lang}}</label>
                        <select class="form-control" v-model="phone.phoneLang" id="phoneLang" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                            <option v-for="item in langItems" :value="item.langCode" :key="item._id">
                                {{ item.langName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.phoneLang}}</span>
                    </div>
                    <div class="form-group">
                        <label for="isActive">{{mcLabel.isActive}} </label>
                        <input class="w3-check" type="checkbox" id="isActive" v-model="phone.isActive">
                        <button id="savePhone" class="btn btn-primary" @click.prevent="savePhone">{{mcLabel.save}}
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
    import { validatePhone } from '/imports/lib/utils/ValidateRecord';

    export default {
        name      : 'phoneDetail',
        components: {},
        data() {
            return {
                mcLabel       : {},
                langItems     : [],
                codeItems     : [],
                phone         : {
                    contactName: '',
                    contactId  : '',
                    phoneNumber: '',
                    phoneType  : '',
                    phoneLang  : '',
                    phoneDesc  : '',
                    isActive   : false,
                    ownerId    : Session.get( 'currentOwnerId' ) || '',
                    ownerType  : Session.get( 'currentOwnerType' ) || '',
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
            phoneTypes() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Phone';
                } );
            },
        },
        methods   : {
            fetchData() {
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
            savePhone() {
                // disable save button
                document.getElementById( 'savePhone' ).prop( 'disable', true );
                // validate inputs:
                const errors = validatePhone( this.phone );
                if( errors.contactName || errors.phoneNumber || errors.phoneType || errors.phoneLang || errors.phoneDesc ) {
                    this.validateErrors = errors;
                }
                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'savePhone', this.phone, this.itemId, userToken, ( error, result ) => {
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
                // enable save button
                document.getElementById( 'savePhone' ).prop( 'disable', false );
            },
        },
        created() {
            // locales: labels
            this.mcLabel = this.$label;
            // currentItem
            const item = this.$store.getters['central/getPhoneItem'];
            if( !this.$lo.isEmpty(item) ) {
                this.itemId = item._id;
                this.phone  = {
                    contactName: '',
                    contactId  : '',
                    phoneNumber: item.phoneNumber,
                    phoneType  : item.phoneType,
                    phoneLang  : item.phoneLang,
                    phoneDesc  : item.phoneDesc,
                    isActive   : item.isActive,
                    ownerId    : item.ownerId || this.$store.getters['central/getOwnerId'] || '',
                    ownerType  : item.ownerType || this.$store.getters['central/getOwnerType'] || '',
                };
            } else {
                this.itemId = '';
                this.phone  = {
                    contactName: '',
                    contactId  : '',
                    phoneNumber: '',
                    phoneType  : '',
                    phoneLang  : 'en-US',
                    phoneDesc  : '',
                    isActive   : false,
                    ownerId    : this.$store.getters['central/getOwnerId'] || '',
                    ownerType  : this.$store.getters['central/getOwnerType'] || '',
                };
            }
            // if currentUserItem, set address-contactName and contactId
            const userInfo = this.$store.getters[ 'central/getUserItem' ];
            if( userInfo && this.phone.contactName === '' ) {
                this.phone.contactName = `${userInfo.profile.firstName} ${userInfo.profile.lastName}`;
                this.phone.contactId   = userInfo._id;
            }
            // fetch data
            this.fetchData();
        },
    }
</script>
