<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.changePassword}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="userName">{{mcLabel.loginName}}</label>
                    <input type="text" class="form-control" id="userName"
                           :placeholder="mcLabel.loginName" maxlength="255" autofocus v-model="user.username" disabled>
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.username}}</span>
                </div>
                <div class="form-group col-sm-6">
                    <label for="fullName">{{mcLabel.fullName}}</label>
                    <input type="text" class="form-control" id="fullName"
                           :placeholder="mcLabel.fullName" maxlength="255" required autofocus
                           v-model="user.fullName" disabled>
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.currentPassword}}</span>
                </div>
            </div>
            <div class="row">
                <span v-if="loggedIn">
                    <div class="form-group col-sm-6">
                    <label for="newPassword">{{mcLabel.newPassword}}</label>
                    <input type="password" class="form-control" id="newPassword"
                           :placeholder="mcLabel.newPassword" maxlength="255" required autofocus
                           v-model="user.newPassword">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.newPassword}}</span>
                    </div>
                    <div class="form-group col-sm-6">
                        <label for="confirmPassword">{{mcLabel.confirmPassword}}</label>
                        <input type="password" class="form-control" id="confirmPassword"
                               :placeholder="mcLabel.confirmPassword" maxlength="255" required autofocus
                               v-model="user.confirmPassword">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.confirmPassword}}</span>
                    </div>
                </span>
                <span v-else>Login first, to change password</span>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <button class="btn btn-primary" @click.prevent="changePassword">{{mcLabel.changePassword}}</button>
                </div>
            </div>
        </form>
    </div>
</template>

<style>
</style>

<script>
    import { Meteor } from 'meteor/meteor';
    import { validateUser, validateProfile } from'/imports/lib/utils/ValidateRecord';

    export default {
        name   : 'changePassword',
        data() {
            return {
                mcLabel       : '',
                user          : {
                    username       : '',
                    currentPassword: '',
                    newPassword    : '',
                    confirmPassword: '',
                    fullName       : '',
                },
                isMessage     : false,
                pageMessage   : '',
                userInfo      : '',
                validateErrors: '',
                loggedIn      : false,
            }
        },
        methods: {
            changePassword() {
                // user-token
                const userToken     = this.$auth.getToken();
                // validate password
                const validPass     = this.$utils.validatePassword( this.user.newPassword );

                // Meteor method
                if( userToken ) {
                    // validate new and confirm password
                    if( this.user.newPassword === this.user.confirmPassword ) {
                        if( validPass.result ) {
                            // change / reset password
                            Meteor.call( 'changeUserPassword', this.user.newPassword, userToken, ( error, result ) => {
                                if( error ) {
                                    this.isMessage   = true;
                                    this.pageMessage = `${error}: Error changing password. Please retry`;
                                } else if( result.code === 'success' ) {
                                    this.isMessage   = true;
                                    this.pageMessage = `${result.code}: ${result.value}`;
                                } else {
                                    this.isMessage   = true;
                                    this.pageMessage = `${result.code}: ${result.value}`;
                                }
                            } );
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = validPass.message
                        }
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = 'New and Confirm Passwords must be the same.'
                    }
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Invalid token / access key: Please login';
                }
            },
        },
        created() {
            this.mcLabel    = this.$label;
            // current user-info: TODO: refactor
            const userToken = this.$auth.getToken();
            if( userToken ) {
                Meteor.call( 'currentUserInfo', userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = `${error}: UserInfoError: Retry.`;
                    } else if( result.code === 'success' ) {
                        this.isMessage     = false;
                        this.pageMessage   = 'Item(s) available';
                        this.user.username = result.value.username;
                        this.userInfo      = result.value;
                        this.user.fullName = `${result.value.profile.firstName} ${result.value.profile.lastName}` || 'n/a';
                        this.loggedIn      = true;
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
            } else {
                this.isMessage   = true;
                this.pageMessage = 'Please login';
            }
        }
    }
</script>
