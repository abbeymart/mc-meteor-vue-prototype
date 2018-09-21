<template>
    <div>
        <div class="w3-container">
            <div class="w3-left">
                <h3>
                    <img src="/images/logo.png" width="20" height="25">
                    <a href="/" @click.prevent="mcLink('home')">{{prodTag}}&trade;</a>
                    <small class="text-primary mcBoldLink"> :: {{currentProdName}} (home)</small>
                </h3>
            </div>
            <div class="w3-right">
                    <span v-if="loggedIn">
                        <!--For login user only -->
                        <i class="glyphicon glyphicon-user" style=" color:steelblue;"></i>
                        <label class="text-info">{{mcLabel.welcome}} {{currentUser || userName}}</label> |
                        <a href="userLogout" @click.prevent="userLogout" id="userMainLogout">Logout</a> |
                        <a href="userAccount" @click.prevent="userAccount">My Account</a>
                    </span>
                <span v-else>
                        <!-- For non-login or new user -->
                    <i class="glyphicon glyphicon-user" style="color:steelblue;"></i>
                        <label class="text-info">{{mcLabel.welcome}} {{userName}}</label> |
                        <a href="userLogin" @click.prevent="userLogin">Login</a> |
                        <a href="userRegister" @click.prevent="userRegister">Register</a>
                    </span>
            </div>
        </div>
        <!--@Nov-28-2016: fixed the dropdown menu issue, using the w3.css option (worked!!!)-->
        <!-- Split button -->
        <div class="w3-container">
            <ul class="w3-navbar w3-padding-8 w3-left">
                <li>
                    <a href="/" @click.prevent="mcLink('home')">
                        <i class="glyphicon glyphicon-home" style="color:mediumvioletred;"></i>
                        <span class="mcBoldLink">Home</span>
                    </a>
                </li>
                <li v-if="loggedIn" class="w3-dropdown-hover">
                    <a href="#">
                        <i class="glyphicon glyphicon-briefcase" style="color: tomato"></i>
                        <span class="mcBoldLink">{{mcLabel.solutions}}</span>
                        <span class="caret"/>
                    </a>
                    <div class="w3-dropdown-content w3-white w3-card-4 w3-round-medium">
                        <a v-for="item in serviceItems" :key="item.servicePath" :href="item.servicePath"
                           @click.prevent="serviceName(item)">{{item.serviceName}}</a>
                    </div>
                </li>
                <li v-if="loggedIn" class="w3-dropdown-hover">
                    <a href="#">
                        <i class="glyphicon glyphicon-briefcase" style="color:limegreen;"></i>
                        <span class="mcBoldLink">{{mcLabel.documentation}}</span>
                        <span class="caret"></span>
                    </a>
                    <div class="w3-dropdown-content w3-white w3-card-4 w3-round-medium">
                        <a v-for="item in docItems" :key="item.servicePath" :href="item.servicePath"
                           @click.prevent="serviceName(item)">{{item.serviceName}}</a>
                    </div>
                </li>
                <li v-if="loggedIn" class="w3-dropdown-hover">
                    <a href="#">
                        <i class="glyphicon glyphicon-briefcase" style="color: gold"></i>
                        <span class="mcBoldLink">{{mcLabel.fastLink}}</span>
                        <span class="caret"></span>
                    </a>
                    <div class="w3-dropdown-content w3-white w3-card-4 w3-round-medium">
                        <a v-for="item in fastLinkItems" :key="item.servicePath" :href="item.servicePath"
                           @click.prevent="serviceName(item)">{{item.serviceName}}</a>
                    </div>
                </li>
                <li class="w3-right">
                    <div class="col-sm-7">
                        <input type="search" v-model="searchKeyword" name="mcSearch" id="mcSearch" size="50"
                               :placeholder="mcLabel.search">
                    </div>
                    <div class="col-sm-3">
                        <select class="form-control" v-model="searchCategory" id="roleGroup" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.cat}}</option>
                            <option v-for="item in searchCategories" :key="item._id" :value="item.codeName">
                                {{ item.codeName }}


                            </option>
                        </select>
                    </div>
                    <button id="btnSearch" class="btn btn-default" @click.prevent="mcSearch">
                        <i class="glyphicon glyphicon-search"></i> {{mcLabel.search}}
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>
<style>

</style>
<script>
    import { Meteor } from 'meteor/meteor';
    import { Session } from 'meteor/session';
    import { mcInfo } from '/imports/lib/locales/getInfo';
    import { ddp } from '/imports/startup/client/appStart';

    const initialProdName = mcInfo.getSlogan();

    export default {
        name      : 'homeHeader',
        data(){
            return {
                prodTag        : this.$info.getName(),
                currentUser    : '',
                loggedIn       : false,
                userName       : 'Guest',
                currentProdName: initialProdName,
                servicePath    : 'central',
                currentDocPath : 'getStarted',
                currentFastPath: 'userAccount',
                itemPath       : '',
                mcLabel        : '',
                codeItems      : [],
                serviceItems   : [],
                docItems       : [],
                fastLinkItems  : [],
                userLang       : 'en-US',
                isMessage      : false,
                pageMessage    : '',
                testItems      : [],
                geoInfo        : '',
                searchKeyword  : '',
                searchCategory : 'Services',
            };
        },
        components: {},
        methods   : {
            serviceName( item ) {
                this.currentProdName = item.serviceName || initialProdName;
                // Store current item-path in the session / appBus
                Session.set( 'productPath', item.servicePath );
                appBus.currentProdPath( item.servicePath );
                this.$router.push( { name: item.servicePath } );
            },
            mcLink( pathName ) {
                if( pathName === 'home' ) {
                    Session.set( 'productPath', 'central' );
                    appBus.currentProdPath( 'central' );
                    this.currentProdName = initialProdName;
                }
                this.$router.push( { name: pathName } );
            },
            mcSearch() {
                // capture the search-keywords and search-category (default: services)
                Session.set( {
                    mcSearchKey: this.searchKeyword,
                    mcSearchCat: this.searchCategory || 'Services',
                } );
                // TODO: route to the searchList to retrieve and display search-result by searchCategory
//                window.location.href = '/search/list';
                this.$router.push( ({ name: 'searchList' }) );
            },
            loginName() {
                // Current logged-in user first and last names, and set it to userName (default: Guest)

            },
            userRegister() {
                // logout by deleteToken()
                this.$router.push( { name: 'register' } );
            },
            userLogin() {
                // logout by deleteToken()
                this.$router.push( { name: 'login' } );
            },
            userLogout() {
                // server: logout on the server (remove the access token)
                const userToken = this.$auth.getToken();
                if( userToken ) {
                    Meteor.call( 'logoutUser', userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'Unable to logout on the server.';
                        } else if( result.code === 'success' ) {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                            // client: logout by deleting token - removeToken()
                            this.$auth.removeToken();
                            // back to the home page (or login-page), refresh page
                            window.location.href = '/';
                        } else {
                            this.isMessage       = true;
                            this.pageMessage     = `${result.code}: ${result.value}`;
                            // back to the home page (or login-page), refresh page
                            window.location.href = '/';
                        }
                    } );
                }
            },
            userAccount() {
                this.$router.push( { name: 'userAccount' } );
            },
        },
        computed  : {
            searchCategories(){
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Search';
                } )
            },
        },
        meteor    : {},
        created() {
            // localization
            this.mcLabel        = this.$label;
            // Determine the login status | activate loggedIn status to true
            const userToken     = this.$auth.getToken();
            this.loggedIn       = this.$auth.loggedIn();
            const queryParams   = {},
                  currentItemId = '';
            if( userToken ) {
                // Get login user full name || call meteor-method, TODO: refactor to utils?
                Meteor.call( 'currentUserInfo', userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = `${error}: UserInfoError: Retry.`;
                    }
                    if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Item(s) available';
                        const userInfo   = result.value;
                        // capture current user information for other component usage
                        Session.set( 'currentUser', userInfo );
                        this.currentUser = `${userInfo.profile.firstName} ${userInfo.profile.lastName}`;
                        //user-language: already part of currentUser information (i.e. profile.userLang)
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
                // services
                Meteor.call( 'getService', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'ServiceError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage     = false;
                        this.pageMessage   = 'Items available';
                        const services     = _.sortBy( result.value, 'servicePriority' );
                        this.serviceItems  = services.filter( ( item ) => {
                            return item.serviceType === 'Solution' && item.isActive === true && item.serviceLang === this.userLang;
                        } );
                        this.docItems      = services.filter( ( item ) => {
                            return item.serviceType === 'Documentation' && item.isActive === true && item.serviceLang === this.userLang;
                        } );
                        this.fastLinkItems = services.filter( ( item ) => {
                            return item.serviceType === 'Fast Links' && item.isActive === true && item.serviceLang === this.userLang;
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
                // standard codes
                Meteor.call( 'getCode', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'CodeError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.codeItems   = _.sortBy( result.value, 'codeName' ).filter( ( item ) => {
                            return item.isActive === true;
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
            } else {
                this.isMessage   = true;
                this.pageMessage = 'Please login';
            }
        },
    }
</script>
