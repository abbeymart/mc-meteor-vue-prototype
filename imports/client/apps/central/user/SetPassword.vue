<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.resetPassword}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="newPassword">{{mcLabel.newPassword}}</label>
                    <input type="password" class="form-control" id="newPassword"
                           :placeholder="mcLabel.newPassword" maxlength="255" autofocus v-model="newPassword" required>
                </div>
                <div class="form-group col-sm-6">
                    <label for="confirmPassword">{{mcLabel.email}}</label>
                    <input type="password" class="form-control" id="confirmPassword"
                           :placeholder="mcLabel.confirmPassword" maxlength="255" required autofocus
                           v-model="confirmPassword">
                </div>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <button class="btn btn-primary" @click.prevent="resetPassword">{{mcLabel.resetPassword}}</button>
                </div>
            </div>
        </form>
    </div>
</template>

<style>
</style>

<script>
    import { Meteor } from 'meteor/meteor';
    import { Accounts } from 'meteor/accounts-base';

    export default {
        name   : 'setPassword',
        data() {
            return {
                mcLabel        : '',
                newPassword    : '',
                confirmPassword: '',
                userToken      : '',
                isMessage      : false,
                pageMessage    : '',
            }
        },
        methods: {
            resetPassword() {
                // validate password
                const validPass = this.$utils.validatePassword( this.newPassword );
                // Reset password
                const userToken = this.$route.params;
                if( userToken ) {
                    if( this.newPassword === this.confirmPassword ) {
                        if( validPass.result ) {
                            Accounts.resetPassword( userToken.token, this.newPassword, ( error ) => {
                                "use strict";
                                if( error ) {
                                    this.isMessage   = true;
                                    this.pageMessage = "Error verifying email OR already verified. Please retry";
                                } else {
                                    // show verification page-message and link to login
                                    this.isMessage   = true;
                                    this.isVerified  = true;
                                    this.pageMessage = "Password Successfully Reset. Please login.";
                                }
                            } );
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = validPass.message
                        }
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = "New and Confirm Passwords must be the same.";
                    }
                } else {
                    this.isMessage   = true;
                    this.pageMessage = "Token required. Please retry to validate or request verification email.";
                }
            },
        },
        created() {
            this.mcLabel   = this.$label;
            this.mcMessage = this.$message;
        }
    }
</script>
