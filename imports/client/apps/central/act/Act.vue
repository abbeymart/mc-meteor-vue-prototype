<template>
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.act}} &raquo;&raquo;</h4>
            </li>
            <!--<li class="mcBoldLink"><a href="#" @click.prevent="orderWish">{{mcLabel.wishes}}</a></li>-->
            <router-link :to="{name: 'actList'}" tag="li" class="mcBoldLink" active-class="active" exact>
                <a>{{mcLabel.list}}</a>
            </router-link>
            <!--<router-link :to="{name: 'actDetail'}" tag="li" class="mcBoldLink" active-class="active">-->
                <!--<a v-if="isItem">{{mcLabel.update}}</a>-->
            <!--</router-link>-->
            <li class="mcBoldLink"><a href="#" @click.prevent="newItem">New Activity</a></li>
            <router-link :to="{name: 'actLevel'}" tag="li" class="mcBoldLink" active-class="active">
                <a>{{mcLabel.actLevelTab}}</a>
            </router-link>
            <router-link :to="{name: 'actTask'}" tag="li" class="mcBoldLink" active-class="active">
                <a>{{mcLabel.actTaskTab}}</a>
            </router-link>
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
        name      : 'act',
        components: {},
        data(){
            return {
                mcLabel     : '',
                isMessage   : false,
                pageMessage : '',
                isItem      : false,
            }
        },
        methods   : {
            newItem(){
                this.isItem = false;
                this.$store.dispatch('central/setActItem', '');
                Session.set( 'currentActItem', '' );
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                // go to the new/detail page
                if( parts[ lastIndex ] === 'new' ) {
                    this.$router.push( { name: 'actDetail' } );
                } else {
                    this.$router.push( { name: 'actNew' } );
                }
            },
            actLevel() {
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentActLevelItem', '' );
                this.$router.push( { name: 'actLevel' } );
            },
            actTask() {
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentActTaskItem', '' );
                this.$router.push( { name: 'actLevel' } );
            },
        },
        created(){
            this.mcLabel = this.$label;
        },
        updated(){
            // if update-item, set new tab label to Update
            if( Session.get( 'currentActItem' ) ) {
                this.isItem = true;
            }
        },
    }
</script>
