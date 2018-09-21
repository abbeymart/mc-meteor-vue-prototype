<template>
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.userAccount}} &raquo;&raquo;</h4>
            </li>
            <router-link :to="{name: 'userList'}" tag="li" class="mcBoldLink" active-class="active" exact>
                <a>{{mcLabel.list}}</a>
            </router-link>
            <!--role / grant for admin/permitted users only-->
            <router-link v-if="isAdmin" :to="{name: 'role'}" tag="li" class="mcBoldLink" active-class="active">
                <a>{{mcLabel.role}}</a>
            </router-link>
            <router-link v-if="isAdmin" :to="{name: 'grant'}" tag="li" class="mcBoldLink" active-class="active">
                <a>{{mcLabel.grant}}</a>
            </router-link>
            <li class="w3-dropdown-hover">
                <a href="#" class="mcBoldLink">
                    <i class="glyphicon glyphicon-briefcase" style="color: tomato"></i>
                    {{mcLabel.utility}}
                    <span class="caret"/>
                </a>
                <!--dropdown list-->
                <div class="w3-dropdown-content w3-blue w3-bar-block w3-round-medium">
                    <div v-if="loggedIn">
                        <router-link :to="{name: 'userList'}" tag="li" active-class="active" exact>
                            <a class="w3-bar-item w3-button">Change/Switch Role</a>
                        </router-link>
                        <router-link :to="{name: 'changePassword'}" tag="li" active-class="active">
                            <a class="w3-bar-item w3-button">{{mcLabel.changePassword}}</a>
                        </router-link>
                        <router-link :to="{name: 'changeUsername'}" tag="li" active-class="active">
                            <a class="w3-bar-item w3-button">{{mcLabel.changeUsername}}</a>
                        </router-link>
                        <router-link v-if="isAdmin" :to="{name: 'userRole'}" tag="li" class="mcBoldLink"
                                     active-class="active">
                            <a class="w3-bar-item w3-button">{{mcLabel.userRole}}</a>
                        </router-link>
                    </div>
                    <div v-if="!loggedIn">
                        <router-link :to="{name: 'resetPassword'}" tag="li" active-class="active">
                            <a>{{mcLabel.resetPassword}}</a>
                        </router-link>
                        <router-link :to="{name: 'recoverUsername'}" tag="li" active-class="active">
                            <a>{{mcLabel.recoverUsername}}</a>
                        </router-link>
                    </div>
                </div>
            </li>
            <li v-if="isItem" class="mcBoldLink"><a href="#" @click.prevent="userAddress">{{mcLabel.address}}</a></li>
            <li v-if="isItem" class="mcBoldLink"><a href="#" @click.prevent="userPhone">{{mcLabel.phone}}</a></li>
            <li v-if="isItem" class="mcBoldLink"><a href="#" @click.prevent="userContact">{{mcLabel.contact}}</a></li>
        </ul>
        <div>
            <router-view class="w3-animate-left"></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        name      : 'userAccount',
        components: {},
        data() {
            return {
                mcLabel    : '',
                isMessage  : false,
                pageMessage: '',
                loggedIn   : false,
                itemId     : '',
                isAdmin    : false,
                isItem     : false,
                ownerType  : '',
            }
        },
        computed  : {},
        methods   : {
            userAddress() {
                // set currentOwnerType
                this.$store.dispatch( 'central/setOwnerType', { type: 'User' } );
                // route to currentOwnerType page
                this.$router.push( { name: 'userAddress' } );
            },
            userPhone() {
                // set currentOwnerType
                this.$store.dispatch( 'central/setOwnerType', { type: 'User' } );
                // route to currentOwnerType page
                this.$router.push( { name: 'userPhone' } );
            },
            userContact() {
                // set currentOwnerType
                this.$store.dispatch( 'central/setOwnerType', { type: 'User' } );
                // route to currentOwnerType page
                this.$router.push( { name: 'userContact' } );
            },
        },
        created() {
            this.loggedIn  = this.$auth.loggedIn();
            this.mcLabel   = this.$label;
            const userItem = this.$store.getters[ 'central/getUserItem' ];
            if( userItem ) {
                // determine the isAdmin / permitted status for role / grant packages
                this.isAdmin = userItem.isAdmin;
            }
            // get the current ownerType
            this.ownerType = this.$store.getters[ 'central/getOwnerType' ];
        },
        updated() {
            const userItem = this.$store.getters[ 'central/getUserItem' ];
            if( userItem ) {
                // current userId
                this.itemId = userItem._id;
                this.isItem = true;
            }
        },
    }
</script>

<style>

</style>
