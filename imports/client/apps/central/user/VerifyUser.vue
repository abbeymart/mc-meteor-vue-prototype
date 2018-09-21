<template>
    <div class="w3-container">
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-th-list"/> {{mcLabel.verifyUser}}</h4>
        </div>

    </div>
</template>

<style>
</style>

<script>
    // View components
    import { Accounts } from 'meteor/accounts-base';

    export default {
        name      : 'verifyUser',
        components: {},
        data(){
            return {
                mcLabel    : '',
                mcMessage  : '',
                isMessage  : false,
                pageMessage: '',
                isVerified : false,
            }
        },
        methods   : {
            goHome() {
                // route to the home page
                window.location.href = '/';
            }
        },
        created() {
            // Locales
            this.mcLabel = this.$label;
            this.mcMessage = this.$message;

            // Verify user email:
            const userToken = this.$route.params;
            if( userToken ) {
                Accounts.verifyEmail( userToken.token, ( error ) => {
                    "use strict";
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = "Error verifying email OR already verified. Please retry.";
                        // TODO: link to home page | option to resend verification email
                    } else {
                        // show verification page-message and link to login
                        this.isMessage   = true;
                        this.isVerified = true;
                        this.pageMessage = "Email Successfully verified.";
                    }
                } );
            } else {
                this.isMessage   = true;
                this.pageMessage = "Token required. Please retry.";
            }
        }
    }
</script>
