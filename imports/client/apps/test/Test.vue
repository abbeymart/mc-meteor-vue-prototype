<template>
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.test}} &raquo;&raquo;</h4>
            </li>
            <!--<li class="mcBoldLink"><a href="#" @click.prevent="testOrderMessage">{{mcLabel.testOrderMessage}}</a></li>-->
            <li class="w3-dropdown-hover">
                <a href="#" class="mcBoldLink">
                    <i class="glyphicon glyphicon-briefcase" style="color: tomato"></i>
                    {{mcLabel.testCentral}}
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
            <li class="w3-dropdown-hover">
                <a href="#" class="mcBoldLink">
                    <i class="glyphicon glyphicon-briefcase" style="color: tomato"></i>
                    {{mcLabel.testOM}}
                    <span class="caret"/>
                </a>
                <!--dropdown list-->
                <div class="w3-dropdown-content w3-blue w3-bar-block w3-round-medium">
                    <div v-if="loggedIn">
                        <router-link :to="{name: 'testOrderMessage'}" tag="li" active-class="active" exact>
                            <a class="w3-bar-item w3-button">{{mcLabel.testOrderMessage}}</a>
                        </router-link>
                        <router-link :to="{name: 'testOrderCancelMessage'}" tag="li" active-class="active" exact>
                            <a class="w3-bar-item w3-button">{{mcLabel.testOrderCancelMessage}}</a>
                        </router-link>
                        <router-link :to="{name: 'testOrderReturnMessage'}" tag="li" active-class="active" exact>
                            <a class="w3-bar-item w3-button">{{mcLabel.testOrderReturnMessage}}</a>
                        </router-link>
                        <router-link :to="{name: 'testOrderPayMessage'}" tag="li" active-class="active" exact>
                            <a class="w3-bar-item w3-button">{{mcLabel.testOrderPayMessage}}</a>
                        </router-link>
                        <router-link :to="{name: 'testOrderRefundMessage'}" tag="li" active-class="active" exact>
                            <a class="w3-bar-item w3-button">{{mcLabel.testOrderRefundMessage}}</a>
                        </router-link>
                        <router-link :to="{name: 'testOrderShipMessage'}" tag="li" active-class="active" exact>
                            <a class="w3-bar-item w3-button">{{mcLabel.testOrderShipMessage}}</a>
                        </router-link>
                    </div>
                </div>
            </li>
        </ul>
        <div>
            <router-view class="w3-animate-left"></router-view>
        </div>
    </div>
</template>
<style>

</style>
<script>

    export default {
        name      : 'mcTest',
        components: {},
        data() {
            return {
                mcLabel    : '',
                isMessage  : false,
                pageMessage: '',
                loggedIn   : false,
            }
        },
        methods   : {
            testOrderMessage() {
                this.$router.push( { name: 'testOrderMessage' } );
            },
        },
        created() {
            this.mcLabel = this.$label;
            this.loggedIn = !!this.$auth.getToken();
        },
    }

</script>
