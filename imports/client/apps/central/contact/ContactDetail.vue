<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.contactDetail}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="contactFirstName">{{mcLabel.firstName}}</label>
                        <input type="text" class="form-control" id="contactFirstName"
                               :placeholder="mcLabel.firstName" maxlength="100" required autofocus
                               v-model="contact.contactFirstName">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.contactFirstName}}</span>
                    </div>
                    <div class="form-group">
                        <label for="contactLastName">{{mcLabel.lastName}}</label>
                        <input type="text" class="form-control" id="contactLastName"
                               :placeholder="mcLabel.lastName" maxlength="100" required
                               v-model="contact.contactLastName">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.contactLastName}}</span>
                    </div>
                    <div class="form-group">
                        <label for="contactMiddleName">{{mcLabel.middleName}}</label>
                        <input type="text" class="form-control" id="contactMiddleName"
                               :placeholder="mcLabel.middleName" maxlength="100"
                               v-model="contact.contactMiddleName">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.contactMiddleName}}</span>
                    </div>
                    <div class="form-group">
                        <label for="contactAddress">{{mcLabel.address}}</label>
                        <input type="text" class="form-control" id="contactAddress"
                               :placeholder="mcLabel.address" maxlength="255" required
                               v-model="contact.contactAddress">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.contactAddress}}</span>
                    </div>
                    <div class="form-group">
                        <label for="contactPhone">{{mcLabel.phoneNumber}}</label>
                        <input type="text" class="form-control" id="contactPhone"
                               :placeholder="mcLabel.phone" maxlength="25" required
                               v-model="contact.contactPhone">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.contactPhone}}</span>
                    </div>
                    <div class="form-group">
                        <label for="contactEmail">{{mcLabel.email}}</label>
                        <input type="email" class="form-control" id="contactEmail"
                               :placeholder="mcLabel.email" maxlength="255"
                               v-model="contact.contactEmail" required>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.contactEmail}}</span>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="contactCat">{{mcLabel.cat}}</label>
                        <select class="form-control" v-model="contact.contactCat" id="contactCat" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.cat}}</option>
                            <option v-for="item in contactCategories" :value="item.codeName" :key="item._id">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.contactCat}}</span>
                    </div>
                    <div class="form-group">
                        <label for="contactLang">{{mcLabel.lang}}</label>
                        <select class="form-control" v-model="contact.contactLang" id="contactLang" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                            <option v-for="item in langItems" :value="item.langCode" :key="item._id">
                                {{ item.langName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.contactLang}}</span>
                    </div>
                    <div class="form-group">
                        <label for="contactDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="contactDesc" cols="30" rows="5" :placeholder="mcLabel.desc"
                                  v-model="contact.contactDesc"></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.contactDesc}}</span>
                    </div>
                    <div class="form-group">
                        <label for="isActive">{{mcLabel.isActive}} </label>
                        <input class="w3-check" type="checkbox" id="isActive" v-model="contact.isActive">
                        <button id="saveContact" class="btn btn-primary" @click.prevent="saveContact">{{mcLabel.save}}</button>
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
    import { validateContact } from '/imports/lib/utils/ValidateRecord';

    export default {
        name      : 'contactDetail',
        components: {},
        data() {
            return {
                mcLabel       : {},
                langItems     : [],
                codeItems     : [],
                contact       : {
                    contactFirstName : '',
                    contactLastName  : '',
                    contactMiddleName: '',
                    contactLang      : 'en-US',
                    contactCat       : '',
                    contactAddress   : '',
                    contactPhone     : '',
                    contactEmail     : '',
                    contactDesc      : '',
                    isActive         : false,
                    ownerId          : this.$store.getters[ 'central/getOwnerId' ]  || '',
                    ownerType        : this.$store.getters[ 'central/getOwnerType' ]  || '',
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
            contactCategories() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Contact';
                } );
            },
        },
        methods   : {
            fetchData() {
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
            saveContact() {
                // disable save button
                $('#saveContact').prop('disable', true);

                // validate inputs:
                const errors = validateContact( this.contact );
                if( errors.contactFirstName || errors.contactLastName || errors.contactMiddleName || errors.contactCat || errors.contactDesc || errors.contactAddress || errors.contactLang || errors.contactEmail || errors.contactPhone ) {
                    this.validateErrors = errors;
                    console.log( errors );
                }
                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveContact', this.contact, this.itemId, userToken, ( error, result ) => {
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
                $('#saveContact').prop('disable', false);
            },
        },
        created() {
            this.mcLabel = this.$label;
            const item   = this.$store.getters( 'central/getContactItem' );
            if( !this.$lo.isEmpty( item ) ) {
                this.itemId  = item._id;
                this.contact = {
                    contactFirstName : item.contactFirstName,
                    contactLastName  : item.contactLastName,
                    contactMiddleName: item.contactMiddleName,
                    contactLang      : item.contactLang,
                    contactCat       : item.contactCat,
                    contactAddress   : item.contactAddress,
                    contactPhone     : item.contactPhone,
                    contactEmail     : item.contactEmail,
                    contactDesc      : item.contactDesc,
                    isActive         : item.isActive,
                    ownerId          : item.ownerId || this.$store.getters[ 'central/getOwnerId' ] || '',
                    ownerType        : item.ownerType || this.$store.getters[ 'central/getOwnerType' ] || '',
                };
            } else {
                this.itemId  = '';
                this.contact = {
                    contactFirstName : '',
                    contactLastName  : '',
                    contactMiddleName: '',
                    contactLang      : 'en-US',
                    contactCat       : '',
                    contactAddress   : '',
                    contactPhone     : '',
                    contactEmail     : '',
                    contactDesc      : '',
                    isActive         : false,
                    ownerId          : this.$store.getters[ 'central/getOwnerId' ] || '',
                    ownerType        : this.$store.getters[ 'central/getOwnerType' ] || '',
                };
            }

            // get data
            this.fetchData();

        },
    }
</script>