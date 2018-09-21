<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.productEmail}} | {{currentItem.productName}}
            </h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="msgTo">{{mcLabel.msgTo}}</label>
                    <input type="text" class="form-control" id="msgTo"
                           :placeholder="mcLabel.msgTo" maxlength="255" required autofocus v-model="message.msgTo">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.msgTo}}</span>
                </div>
                <div class="form-group col-sm-6">
                    <label for="msgSubject">{{mcLabel.msgSubject}}</label>
                    <input type="text" class="form-control" id="msgSubject"
                           :placeholder="mcLabel.msgSubject" maxlength="255"
                           v-model="message.msgSubject">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.msgSubject}}</span>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <span>
                        <button class="btn btn-primary" @click.prevent="sendMessage">{{mcLabel.send}}</button>
                    <br/>
                    </span>
                </div>
            </div>
        </form>
        <!--<span v-if="isMessage">{{pageMessage}}</span>-->
    </div>
</template>

<style>
</style>

<script>
    import { Meteor } from 'meteor/meteor';
    import { validateUser, validateItemMessage } from'/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    export default {
        name   : 'productEmail',
        data() {
            return {
                mcLabel        : '',
                langItems      : [],
                currentItem    : '',
                currentUser    : '',
                currentUserName: '',
                message        : {
                    msgTo     : '',
                    msgFrom   : '',
                    msgSubject: 'Special Product Information',
                    msgText   : '',
                },
                isMessage      : false,
                pageMessage    : '',
                validateErrors : '',
                itemId         : '',
                itemUrl        : '',
            }
        },
        methods: {
            sendMessage() {
                // TODO: resolve email-server access control issue: 535 Incorrect Authentication Data
                // validate inputs:
//                const userInfo        = Session.get( 'currentUser' );
//                const currentUserName = `${userInfo.profile.firstName} ${userInfo.profile.lastName}`;
                this.message.msgFrom = this.currentUser.emails[ '0' ].address || '';
                this.message.msgText = `Message From: ${this.currentUserName} \n\n\n Check this item: ${this.currentItem.productName} | ${this.itemUrl}`;

                let errors = validateItemMessage( this.message );
                if( errors.msgTo || errors.msgSubject ) {
                    this.validateErrors = errors;
                }
                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'sendUserEmail', this.message, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error sending item. Please retry`;
                            } else {
                                this.isMessage   = true;
                                this.pageMessage = `${result.code}: ${result.value}`;
                            }
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = 'inputs-errors: ' + errors;
                    }
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Please login';
                }
            },
        },
        created() {
            // Locales activation
            this.mcLabel = this.$label;

            if( Session.get( 'currentProduct' ) ) {
                this.currentItem = Session.get( 'currentProduct' );
                this.itemId      = Session.get( 'currentProduct' )._id;
            }

            if( Session.get( 'productUrl' ) ) {
                this.itemUrl = Session.get( 'productUrl' );
            }

            if( Session.get( 'currentUser' ) ) {
                const userInfo       = Session.get( 'currentUser' );
                this.currentUser     = Session.get( 'currentUser' );
                this.currentUserName = `${userInfo.profile.firstName} ${userInfo.profile.lastName}`;
            }
        }
    }
</script>
