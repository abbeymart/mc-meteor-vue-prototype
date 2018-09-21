<template>
    <div>
        <!--userName, userPassword/userConfirmPassword, userEmail, userLang, userRecoveryEmail, firstName, lastName, userAcceptTerm -->
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.userRegister}}</h4>
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
                    <input type="text" class="form-control" id="userEmail" required
                           :placeholder="mcLabel.email" maxlength="255" v-model="user.userEmail">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.userEmail}}</span>
                </div>
                <!--TODO: confirm email-->
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="userPassword">{{mcLabel.loginPassword}}</label>
                    <input type="password" class="form-control" id="userPassword"
                           :placeholder="mcLabel.loginPassword" maxlength="255" required
                           v-model="user.password">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.password}}</span>
                </div>
                <div class="form-group col-sm-6">
                    <label for="confirmPassword">{{mcLabel.confirmPassword}}</label>
                    <input type="password" class="form-control" id="confirmPassword"
                           :placeholder="mcLabel.confirmPassword" maxlength="255" required
                           v-model="confirmPassword">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.confirmPassword}}</span>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="firstName">{{mcLabel.firstName}}</label>
                    <input type="text" class="form-control" id="firstName"
                           :placeholder="mcLabel.firstName" maxlength="255" required
                           v-model="user.firstName">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.firstName}}</span>
                </div>
                <div class="form-group col-sm-6">
                    <label for="lastName">{{mcLabel.lastName}}</label>
                    <input type="text" class="form-control" id="lastName"
                           :placeholder="mcLabel.lastName" maxlength="255" required
                           v-model="user.lastName">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.lastName}}</span>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="userLang">{{mcLabel.lang}}</label>
                    <select class="form-control" v-model="user.userLang" id="userLang" required>
                        <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                        <option v-for="item in langItems" :value="item.langCode">
                            {{ item.langName }}
                        </option>
                    </select>
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.userLang}}</span>
                </div>
                <div class="form-group col-sm-6">
                    <label for="recoveryEmail">{{mcLabel.recoveryEmail}}</label>
                    <input type="text" class="form-control" id="recoveryEmail"
                           :placeholder="mcLabel.recoveryEmail" maxlength="255"
                           v-model="user.recoveryEmail">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.recoveryEmail}}</span>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <label for="userAcceptTerm">{{mcLabel.acceptTerm}} </label>
                    <input class="w3-check" type="checkbox" id="userAcceptTerm" v-model="user.userAcceptTerm" required>
                    <!--TODO: terms of service link (new/pop-up page)-->
                    <!--TODO: if itemId (for updates),change button label to Update-->
                    <span v-if="itemId">
                        <button class="btn btn-primary" @click.prevent="register">{{mcLabel.update}}</button>
                    <br/>
                    </span>
                    <span v-else>
                        <button class="btn btn-primary" @click.prevent="register">{{mcLabel.register}}</button>
                    <br/>
                    </span>
                </div>
                <div class="col-sm-offset-3">
                    <div v-if="registerStatus" id="registerStatusId" class="row alert alert-info" role="alert">
                        <span>{{registerStatus}}: </span>
                    </div>
                </div>
            </div>
        </form>
        <!--<span v-if="isMessage">{{pageMessage}}</span>-->
        <hr>
        <p class="text-center">
            Already have an account?
            <a href="#" @click.prevent="loginPage">Login Now</a>
        </p>
    </div>
</template>

<style>
</style>

<script>
    import { Meteor } from 'meteor/meteor';
    import { validateUser } from '/imports/lib/utils/ValidateRecord';

    export default {
        name   : 'register',
        data() {
            return {
                mcLabel        : '',
                langItems      : [],
                user           : {
                    username      : '',
                    password      : '',
                    userEmail     : '',
                    userLang      : 'en-US',
                    firstName     : '',
                    lastName      : '',
                    recoveryEmail : '',
                    userAcceptTerm: false
                },
                confirmPassword: '',
                isMessage      : false,
                pageMessage    : '',
                registerStatus : '',
                validateErrors : '',
                itemId         : ''
            }
        },
        methods: {
            register() {
                // validate inputs:
                const userParams = this.$lo.extend( this.user, {
                    confirmPassword: this.confirmPassword
                } );
                let errors       = validateUser( userParams );
                if( errors.username || errors.password || errors.userEmail || errors.userLang || errors.firstName || errors.lastName || errors.recoveryEmail || errors.userAcceptTerm || errors.confirmPassword ) {
                    this.validateErrors = errors;
                }
                // Meteor method
                if( this.$lo.isEmpty( errors ) ) {
                    // reset validateErrors
                    this.validateErrors = '';
                    Meteor.call( 'registerUser', userParams, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = `${error}: Error registering new user. Please retry`;
                        }
                        if( result.code === 'success' ) {
                            this.isMessage = true;
                            // capture new/updated record itemId
                            if( result.code === 'inserted' || result.code === 'updated' ) {
                                this.itemId = result.docId;
                            }
                            this.pageMessage = `${result.code}: ${result.value}`;
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'inputs-errors: ' + JSON.stringify( errors );
                }
            },
            loginPage() {
                // go to login page
                this.$router.push( { name: 'login' } );
            }
        },
        created() {
            // Locales activation
            this.mcLabel = this.$label;

            // Handling update record / profile | if currentItem, set this.user to it.
            //capture the current item, from the user-list items, via the userBus state
            this.user   = this.$store.getters[ 'central/getCurrentUser' ];
            this.itemId = this.user._id;

            // languages,
            // TODO: Get a copy from the appBus or get it from the server or refactor for sharing
            Meteor.call( 'getAllLang', ( error, result ) => {
                if( error ) {
                    this.isMessage   = true;
                    this.pageMessage = 'LanguageError: Retry.';
                } else if( result.code === 'success' ) {
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
        }
    }
</script>
