<template>
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.stdCodeTitle}} &raquo;&raquo;</h4>
            </li>
            <router-link :to="{name: 'standardCodeList'}" tag="li" class="mcBoldLink" active-class="active" exact>
                <a>{{mcLabel.list}}</a>
            </router-link>
            <!--<router-link :to="{name: 'standardCodeDetail'}" tag="li" class="mcBoldLink" active-class="active">-->
                <!--<a v-if="isItem">{{mcLabel.update}}</a>-->
            <!--</router-link>-->
            <li class="mcBoldLink"><a href="#" @click.prevent="newItem">New Code-Item</a></li>
        </ul>
        <div>
            <router-view class="w3-animate-left"></router-view>
        </div>
    </div>
</template>

<style>
</style>

<script>

    import { Session } from 'meteor/session';

    export default {
        name      : 'define',
        components: {},
        data(){
            return {
                mcLabel    : '',
                isItem     : false,
                isMessage  : false,
                pageMessage: '',
            }
        },
        methods   : {
            newItem(){
                this.isItem = false;
                Session.set( 'currentCodeItem', '' );
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                // go to the new/detail page
                if( parts[ lastIndex ] === 'new' ) {
                    this.$router.push( { name: 'standardCodeDetail' } );
                } else {
                    this.$router.push( { name: 'standardCodeNew' } );
                }
            },
        },
        created(){
            this.mcLabel = this.$label;
        },
        updated(){
            // if update-item, set new tab label to Update
            this.isItem = !!Session.get( 'currentCodeItem' );
        }
    }

</script>