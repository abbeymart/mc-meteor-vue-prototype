<template>
    <div>
        <!--updates: recovery-email, profile(first/lastName...) -->
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.userDetail}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="userName">{{mcLabel.loginName}}</label>
                    <input type="text" class="form-control" id="userName"
                           :placeholder="mcLabel.loginName" maxlength="255" required autofocus v-model="user.username">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.username}}</span>
                </div>
                <div class="form-group col-sm-6">
                    <label for="userEmail">{{mcLabel.email}}</label>
                    <input type="text" class="form-control" id="userEmail"
                           :placeholder="mcLabel.email" maxlength="255" required autofocus v-model="user.userEmail">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.userEmail}}</span>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="firstName">{{mcLabel.firstName}}</label>
                    <input type="text" class="form-control" id="firstName"
                           :placeholder="mcLabel.firstName" maxlength="255" required autofocus
                           v-model="user.firstName">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.firstName}}</span>
                </div>
                <div class="form-group col-sm-6">
                    <label for="lastName">{{mcLabel.lastName}}</label>
                    <input type="text" class="form-control" id="lastName"
                           :placeholder="mcLabel.lastName" maxlength="255" required autofocus
                           v-model="user.lastName">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.lastName}}</span>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="userLang">{{mcLabel.lang}}</label>
                    <select class="form-control" v-model="user.userLang" id="userLang" required>
                        <option v-for="item in langItems" :value="item.langCode">
                            {{ item.langName }}
                        </option>
                    </select>
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.userLang}}</span>
                </div>
                <div class="form-group col-sm-6">
                    <label for="recoveryEmail">{{mcLabel.recoveryEmail}}</label>
                    <input type="text" class="form-control" id="recoveryEmail"
                           :placeholder="mcLabel.recoveryEmail" maxlength="255" autofocus
                           v-model="user.recoveryEmail">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.recoveryEmail}}</span>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <span v-if="userInfo.isAdmin">
                        <label for="isActive">{{mcLabel.isActive}} </label>
                        <input class="w3-check" type="checkbox" id="isActive" v-model="user.isActive">
                        <label for="isAdmin">{{mcLabel.isAdmin}} </label>
                        <input class="w3-check" type="checkbox" id="isAdmin" v-model="user.isAdmin">
                    </span>
                    <button class="btn btn-primary" @click.prevent="updateUser">{{mcLabel.update}}</button>
                </div>
                <div class="col-sm-offset-3">
                    <div v-if="updateStatus" id="updateStatusId" class="row alert alert-info" role="alert">
                        <span>{{updateStatus}}: </span>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<style>
</style>

<script>
    import { Meteor } from 'meteor/meteor';
    import { validateUser, validateProfile } from '/imports/lib/utils/ValidateRecord';

    export default {
        name   : 'userDetail',
        data() {
            return {
                mcLabel       : '',
                langItems     : [],
                currentUser   : '',
                userInfo      : '',
                user          : {
                    username     : '',
                    userEmail    : '',
                    userLang     : 'en-US',
                    firstName    : '',
                    lastName     : '',
                    recoveryEmail: '',
                    isActive     : false,
                    isAdmin      : false
                },
                isMessage     : false,
                pageMessage   : '',
                updateStatus  : '',
                validateErrors: '',
                itemId        : '',
            }
        },
        methods: {
            fetchData(){
                // languages
                Meteor.call( 'getAllLang', ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'LanguageError: Retry.';
                    }
                    if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.langItems   = result.value.filter( ( item ) => {
                            return item.isActive === true;
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
                // current user-info:
                const userToken = this.$auth.getToken();
                if( userToken ) {
                    Meteor.call( 'currentUserInfo', userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage = true;
                            if( this.currentUser ) {
                                this.isMessage = false;
                            }
                            this.pageMessage = `${error}: UserInfoError: Retry.`;
                        }
                        if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Item(s) available';
                            this.userInfo    = result.value;
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                } else {
                    this.isMessage   = true;
                    this.pageMessage = this.$message.accessKeyMissing;
                }
            },
            updateUser() {
                // validate inputs:
                const errors = validateProfile( this.user );
                if( errors.username || errors.userEmail || errors.userLang || errors.firstName || errors.lastName || errors.recoveryEmail ) {
                    this.validateErrors = errors;
                }
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'updateUser', this.user, this.itemId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error registering new user. Please retry`;
                            }
                            if( result.code === 'success' ) {
                                this.isMessage   = true;
                                this.pageMessage = `${result.code}: ${result.value}`;
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
        created() {
            // Locales activation: labels, messages, constants etc.
            this.mcLabel   = this.$label;
            // current user record / document
            const userItem = this.$store.getters[ 'central/getUserItem' ];
            if( !this.$lo.isEmpty(userItem) ) {
                this.itemId = userItem._id;
                this.user   = {
                    username     : userItem.username,
                    userEmail    : userItem.emails[ 0 ].address,
                    userLang     : userItem.profile.userLang,
                    firstName    : userItem.profile.firstName,
                    lastName     : userItem.profile.lastName,
                    recoveryEmail: userItem.profile.recoveryEmail,
                    isActive     : userItem.isActive || false,
                    isAdmin      : userItem.isAdmin || false,
                };
            } else {
                this.itemId = '';
                this.user   = {
                    username     : '',
                    userEmail    : '',
                    userLang     : 'en-US',
                    firstName    : '',
                    lastName     : '',
                    recoveryEmail: '',
                    isActive     : false,
                    isAdmin      : false,
                };
            }
            //
            this.fetchData();
        },
        updated() {
            const userItem = this.$store.getters[ 'central/getUserItem' ];
            if( userItem ) {
                this.currentUser = userItem;
                this.itemId      = userItem._id;
                this.isItem      = true;
            }
        }
    }
</script>
