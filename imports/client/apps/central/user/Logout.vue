<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.userLogout}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="userEmailName">{{mcLabel.loginName}}</label>
                    <input type="text" class="form-control" id="userEmailName"
                           :placeholder="mcLabel.loginName" maxlength="255" required autofocus v-model="user.username">
                    <span v-if="validateUser.username" class="help-block">login name message</span>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="userPassword">{{mcLabel.loginPassword}}</label>
                    <input type="password" class="form-control" id="userPassword"
                           :placeholder="mcLabel.loginPassword" maxlength="255" required autofocus
                           v-model="user.password">
                    <span v-if="validateUser.password" class="help-block">password message</span>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <label for="userRemember">{{mcLabel.rememberMe}} </label>
                    <input class="w3-check" type="checkbox" id="userRemember">
                    <!--TODO: terms of service link (new/pop-up page)-->
                    <button class="btn btn-primary" @click.prevent="login">{{mcLabel.login}}</button>
                    <br/>
                </div>
                <div class="col-sm-offset-3">
                    <div v-if="loginStatus" id="loginStatusId" class="row alert alert-info" role="alert">
                        <span>{{loginStatus}}: </span>
                        <a href="#" id="loginAgain">{{mcLabel.login}}</a> |
                        <p class="text-center">
                            Don't have an account?
                            <router-link to="{name: 'register'}">Sign up!</router-link>
                        </p>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<style>

</style>

<script>
    import axios from 'axios';
    import { ddp } from '/imports/startup/client/appStart';
    import { Meteor } from 'meteor/meteor';
    import { Users, StandardCodes, Grants } from '/imports/collections/Central';
    import { mcLabel } from '/imports/lib/locales/getLabel';
    import { utils } from '/imports/lib/utils/Utility';

    export default {
        name   : 'logout',
        data() {
            return {
                user        : {
                    username: '',
                    password: '',
                },
                loginData   : '',
                rememberMe  : false,
                userVerified: false,
                isMessage   : false,
                pageMessage : '',
                grantedRoles: [],
                currentUser : '',
                mcLabel     : mcLabel,
                loginStatus : '',
                validateUser: {
                    username  : '',
                    password  : '',
                    rememberMe: ''
                },
            }
        },
        // TODO: activate vue-meteor data integration points / params
        methods: {
            login() {
                let userParams                      = this.user;
                // capture user-login info: ref-page, ip, browser, ref-url etc.
                const incomingPage                  = document.referrer || '';
                let parts, protocol, host, pathName = '';

                if( incomingPage ) {
                    parts    = incomingPage.split( '://' )[ 1 ].split( '/' );
                    protocol = incomingPage.split( '://' )[ 0 ];
                    host     = parts[ 0 ];
                    pathName = parts.slice( 1 ).join( '/' );
                }

                // Get user browser information
                let currentBrowser = utils.userBrowser();
                if( !currentBrowser ) {
                    currentBrowser = 'User-Browser-Not-Set';
                }

                const logParams = {
                    loginDate    : new Date(),
                    loginIp      : 'Default-IP-TBD',
                    loginBrowser : currentBrowser,
                    loginProtocol: protocol,
                    loginHost    : host
                };

                // include logParams as part of loginParams
                const loginParams = this.$lo.extend( userParams, {
                    logParams
                } );

                // DDP login || *Meteor method login
                Meteor.call( 'loginUser', loginParams, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = `${error}: Error login to the server`;
                    }
                    if( result.code === 'success' ) {
                        this.$auth.setToken( result.loginToken, result.expire );
                        this.isMessage   = true;
                        this.pageMessage = ' Login successfully';
                        // return to referrer-page or home page (refresh to activate page new state
                        if( pathName && pathName !== 'mainLogin' ) {
                            window.location.href = pathName;
                        } else {
                            // route to the home page
                            window.location.href = '/';
//                        this.$router.push( { name: 'home' } );
                        }
                    } else if( result.code === 'notVerified' ) {
                        this.userVerified = false; // to initialize email re-verification message
                        this.isMessage    = true;
                        this.pageMessage  = `${result.code}: ${result.value}`;
                        // TODO: Link / redirect to the verified user page/link
                    }
                    else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
            },
        }
    }
</script>
