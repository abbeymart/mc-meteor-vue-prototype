<template>
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.stdCat}} &raquo;&raquo;</h4>
            </li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listItems">{{mcLabel.list}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="newItem">{{mcLabel.new}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="goCode">{{mcLabel.stdCode}}</a></li>
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
        name      : 'standardCategory',
        components: {},
        data() {
            return {
                mcLabel    : '',
                isItem     : false,
                isMessage  : false,
                pageMessage: '',
            }
        },
        methods   : {
            newItem() {
                this.isItem = false;
                Session.set( 'currentCatItem', '' );
                Session.set( 'currentCodeItem', '' );
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                // go to the new/detail page
                if( parts[ lastIndex ] === 'new' ) {
                    this.$router.push( { name: 'standardCategoryDetail' } );
                } else {
                    this.$router.push( { name: 'standardCategoryNew' } );
                }
            },
            listItems() {
                this.isItem = false;
                Session.set( 'currentCatItem', '' );
                Session.set( 'currentCodeItem', '' );
                this.$router.push( { name: 'standardCategoryList' } );
            },
            goCode() {
                this.isItem = false;
                Session.set( 'currentCatItem', '' );
                Session.set( 'currentCodeItem', '' );
                this.$router.push( { name: 'standardCode' } );
            }
        },
        created() {
            this.mcLabel = this.$label;
        },
        updated() {
            // if update-item, set new tab label to Update
            this.isItem = !!Session.get( 'currentCatItem' );
        },
    }

</script>