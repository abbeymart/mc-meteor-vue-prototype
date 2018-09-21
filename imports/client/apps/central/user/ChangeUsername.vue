<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.changeUsername}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="userName">{{mcLabel.loginName}}</label>
                    <input type="text" class="form-control" id="userName"
                           :placeholder="mcLabel.loginName" maxlength="255" autofocus v-model="username" required disabled>
                </div>
                <div class="form-group col-sm-6">
                    <label for="newUsername">{{mcLabel.newUsername}}</label>
                    <input type="email" class="form-control" id="newUsername"
                           :placeholder="mcLabel.newUsername" maxlength="255" required autofocus
                           v-model="newUsername">
                </div>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <button class="btn btn-primary" @click.prevent="changeUsername">{{mcLabel.changeUsername}}</button>
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
        name   : 'changeUsername',
        data() {
            return {
                mcLabel    : '',
                username   : '',
                newUsername: '',
                isMessage  : false,
                pageMessage: '',
            }
        },
        methods: {
            changeUsername() {
                // user-token
                const userToken = this.$auth.getToken();
                if( userToken ) {
                    // change / reset password
                    Meteor.call( 'changeUsername', this.newUsername, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = `${error}: Error changing/resetting username. Please retry.`;
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
                    this.pageMessage = "Token required. Please retry.";
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
                        this.isMessage   = false;
                        this.pageMessage = 'Item(s) available';
                        this.username    = result.value.username;
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
            } else {
                this.isMessage   = true;
                this.pageMessage = 'Missing access-key. Please login';
            }
        }
    }
</script>
