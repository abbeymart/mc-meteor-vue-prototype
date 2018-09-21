<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.userLogin}}</h4>
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
                    <span v-if="validateLogin.username" class="help-block w3-yellow">login name message</span>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="userPassword">{{mcLabel.loginPassword}}</label>
                    <input type="password" class="form-control" id="userPassword"
                           :placeholder="mcLabel.loginPassword" maxlength="255" required autofocus
                           v-model="user.password">
                    <span v-if="validateLogin.password" class="help-block w3-yellow">password message</span>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <label for="rememberMe">{{mcLabel.rememberMe}} </label>
                    <input class="w3-check" type="checkbox" v-model="rememberMe" id="rememberMe">
                    <!--TODO: terms of service link (new/pop-up page)-->
                    <button class="btn btn-primary" @click.prevent="login">{{mcLabel.login}}</button>
                    <br/>
                </div>
            </div>
        </form>
        <hr>
        <!--<span v-if="isMessage">{{pageMessage}}</span>-->
        <span v-if="notVerified"><a @click.prevent="verifyEmail" href="#">Send Verification Email</a></span>
        <div class="text-center">
            <p>
                <span class="mcBoldLink">Forgot Password?</span>
                <a href="#" @click.prevent="resetPass">Reset Password</a>
            </p>
            <p>
                <span class="mcBoldLink">Forgot Username?</span>
                <a href="#" @click.prevent="getUsername">Recover Username</a>
            </p>
        </div>
    </div>
</template>

<style>

</style>

<script>
    import { Meteor } from 'meteor/meteor';

    export default {
        name: 'login',
        data() {
            return {
                user         : {
                    username: this.$utils.getLoginName(),
                    password: '',
                },
                loginData    : '',
                rememberMe   : true,
                userVerified : false,
                isMessage    : false,
                pageMessage  : '',
                grantedRoles : [],
                currentUser  : '',
                mcLabel      : this.$label,
                mcMessage    : '',
                loginStatus  : '',
                notVerified  : false,
                geoInfo      : '',
                validateLogin: {
                    username: '',
                    password: '',
                }
            }
        },
        // TODO: activate vue-meteor data integration points / params (meteor reactive features)

        methods: {
            login() {
                // Validate inputs
                if( this.$validate.isEmpty( this.user.username ) ) {
                    this.validateLogin.username = 'Login-name is required';
                }
                if( this.$validate.isEmpty( this.user.password ) ) {
                    this.validateLogin.password = 'Password is required';
                }

                // Capture username for registration email verification
                // Session.set( 'currentUsername', this.user.username );
                this.$store.dispatch( 'central/setUserName', this.user.username );
                // if rememberMe is true, save the username locally, expiry date is optional
                if( this.rememberMe ) {
                    this.$utils.setLoginName( this.user.username, Date.now() + this.$constant.getRememberMeTimeout() );
                }

                // capture user-login info: ref-page, ip, browser, ref-url etc.
                const incomingPage                  = document.referrer || '';
                let parts, protocol, host, pathName = '';

                if( incomingPage ) {
                    parts    = incomingPage.toString().split( '://' )[ 1 ].split( '/' );
                    protocol = incomingPage.split( '://' )[ 0 ];
                    host     = parts[ 0 ];
                    pathName = parts.slice( 1 ).join( '/' );
                }

                // Perform login action based on the geoInfo

                if( this.geoInfo ) {
                    // Set additional login information, for audit-log
                    const logParams = {
                        loginDate    : new Date(),
                        loginIp      : this.geoInfo.data.ip || 'User-IP-Not-Set',
                        loginGeo     : this.geoInfo.data,
                        loginBrowser : this.$utils.userBrowser() || 'User-Browser-Not-Set',
                        loginProtocol: protocol,
                        loginHost    : host
                    };

                    // include logParams as part of loginParams
                    const loginParams = this.$lo.extend( this.user, {
                        logParams
                    } );

                    // Meteor method login, perform action, post client/geo-info retrieval
                    Meteor.call( 'loginUser', loginParams, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = `${error}: Error login to the server`;
                        }
                        if( result.code === 'success' ) {
                            this.$auth.setToken( result.loginToken, result.expire );
                            this.isMessage   = true;
                            this.pageMessage = ' Login successfully';
                            // Meteor standard login, for client-side Meteor-user-info access
                            Meteor.loginWithPassword( loginParams.username, loginParams.password, ( error ) => {
                                if( error ) {
                                    this.pageMessage = ' Meteor Login error (stage-2)';
                                }
//                                console.log(Meteor.user(), Meteor.userId(), this.userId);
                            } );
                            // return to referrer-page or home page (refresh to activate page new state)
                            // TODO: refactor/modify this logic
                            if( pathName && (pathName !== 'login' || pathName !== 'verify-email/:token' || pathName !== 'register' || pathName !== 'recoverUsername') ) {
                                window.location.href = pathName;
                            } else {
                                // route to the home page >> page-refresh
                                window.location.href = '/';
                            }
                        }
                        else if( result.code === 'notVerified' ) {
                            this.notVerified = true; // to show re-send verification email link
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                } else {
                    // Login without geoInfo
                    // Set additional login information, for audit-log
                    const logParams = {
                        loginDate    : new Date(),
                        loginIp      : 'User-IP-Not-Set',
                        loginGeo     : 'n/a',
                        loginBrowser : this.$utils.userBrowser() || 'User-Browser-Not-Set',
                        loginProtocol: protocol,
                        loginHost    : host
                    };

                    // include logParams as part of loginParams
                    const loginParams = this.$lo.extend( this.user, {
                        logParams
                    } );

                    // Meteor method login, perform action, post client/geo-info retrieval
                    Meteor.call( 'loginUser', loginParams, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = `${error}: Error login to the server`;
                        }
                        if( result.code === 'success' ) {
                            this.$auth.setToken( result.loginToken, result.expire );
                            this.isMessage   = true;
                            this.pageMessage = ' Login successfully';
                            // Meteor standard login, for client-side Meteor-user-info access
                            Meteor.loginWithPassword( loginParams.username, loginParams.password, ( error ) => {
                                if( error ) {
                                    this.pageMessage = ' Meteor Login error (stage-2)';
                                }
//                                console.log(Meteor.user(), Meteor.userId(), this.userId);
                            } );
                            // return to referrer-page or home page (refresh to activate page new state)
                            // TODO: refactor/modify this logic
                            if( pathName && (pathName !== 'login' || pathName !== 'verify-email/:token' || pathName !== 'register' || pathName !== 'recoverUsername') ) {
                                window.location.href = pathName;
                            } else {
                                // route to the home page >> page-refresh
                                window.location.href = '/';
                            }
                        }
                        else if( result.code === 'notVerified' ) {
                            this.notVerified = true; // to show re-send verification email link
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                }
            },
            verifyEmail() {
                this.$router.push( { name: 'sendVerifyEmail' } );
            },
            resetPass() {
                this.$router.push( { name: 'resetPassword' } );
            },
            getUsername() {
                this.$router.push( { name: 'recoverUsername' } );
            },
        },
        created() {
            // check/set the locally saved username
            this.user.username = this.$utils.getLoginName();
            // if (this.$utils.getLoginName()) this.rememberMe = true;
            // geo-location / ip-address information, TODO: align with login()
            // TODO: move to the store
            const getGeo = this.$ax.get( 'http://ipinfo.io', ( info ) => {
                /*
                 {
                 "ip": "99.235.164.225",
                 "hostname": "CPE788df7b31a63-CM788df7b31a60.cpe.net.cable.rogers.com",
                 "city": "Etobicoke",
                 "region": "Ontario",
                 "country": "CA",
                 "loc": "43.7432,-79.5876",
                 "org": "AS812 Rogers Cable Communications Inc.",
                 "postal": "M9V"
                 }
                 */
                return info;
            } );
            // TODO: wait for a while for geoInfo to complete
            getGeo.then( ( info ) => {
                this.geoInfo = info;
            } ).catch( ( error ) => {
                this.isMessage   = true;
                this.pageMessage = JSON.stringify( error ) + ': Delay/Error getting geo/ip information.'
            } );
        }
    }
</script>
