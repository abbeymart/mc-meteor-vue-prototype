<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.sendVerifyEmail}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="userName">{{mcLabel.loginName}}</label>
                    <input type="text" class="form-control" id="userName"
                           :placeholder="mcLabel.loginName" maxlength="255" autofocus v-model="username" required>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <button class="btn btn-primary" @click.prevent="verifyEmail">{{mcLabel.sendVerifyEmail}}</button>
                </div>
            </div>
        </form>
    </div>
</template>

<style>
</style>

<script>
    import { Meteor } from 'meteor/meteor';

    export default {
        name   : 'sendVerifyEmail',
        data() {
            return {
                mcLabel    : '',
                username   : '',
                userEmail  : '',
                isMessage  : false,
                pageMessage: '',
            }
        },
        methods: {
            verifyEmail() {
                // Meteor method
                if( this.username || this.userEmail ) {
                    // change / reset password
                    Meteor.call( 'verifyRegistration', this.username, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = `${error}: Error sending reset password email. Please retry`;
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
                    this.pageMessage = 'Valid user/login-name is required.'
                }
            },
        },
        created() {
            this.mcLabel  = this.$label;
            this.username = Session.get( 'currentUsername' );
        }
    }
</script>