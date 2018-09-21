<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.recoverUsername}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="userEmail">{{mcLabel.email}}</label>
                    <input type="text" class="form-control" id="userEmail"
                           :placeholder="mcLabel.email" maxlength="255" required autofocus
                           v-model="userEmail">
                </div>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <button class="btn btn-primary" @click.prevent="recoverUsername">{{mcLabel.recoverUsername}}</button>
                </div>
            </div>
        </form>
    </div>
</template>

<style>
</style>

<script>
    import { Meteor } from 'meteor/meteor';
    import _ from 'lodash';

    export default {
        name   : 'recoverUsername',
        data() {
            return {
                mcLabel       : '',
                userEmail     : '',
                recoveryEmail : '',
                isMessage     : false,
                pageMessage   : '',
                validateErrors: '',
            }
        },
        methods: {
            recoverUsername() {

                // Meteor method
                if( this.userEmail ) {
                    // change / reset password
                    Meteor.call( 'recoverUsername', this.userEmail, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = `${error}: Error finding username. Please retry.`;
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
                    this.pageMessage = 'Valid registered email is required.'
                }
            },
        },
        created() {
            this.mcLabel = this.$label;
        }
    }
</script>