<template>
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.lang}} &raquo;&raquo;</h4>
            </li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listItems">{{mcLabel.list}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="newItem">{{mcLabel.new}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="goLabel">{{mcLabel.label}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="goContent">{{mcLabel.content}}</a></li>
        </ul>
        <div>
            <router-view class="w3-animate-left"></router-view>
        </div>
    </div>
</template>

<style>
</style>

<script>
    import { Meteor } from 'meteor/meteor';

    export default {
        name      : 'mcLanguage',
        components: {},
        data() {
            return {
                mcLabel    : '',
                isItem     : false,
                isMessage  : false,
                pageMessage: '',
                mUser      : Meteor.user(),
            }
        },
        methods   : {
            newItem() {
                this.isItem = false;
                // reset current item value
                this.$store.dispatch( 'central/setLangItem', '' );
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                // refactor to return parts and lastIndex values:
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                // go to the new/detail page
                if( parts[ lastIndex ] === 'new' ) {
                    this.$router.push( { name: 'languageDetail' } );
                } else {
                    this.$router.push( { name: 'languageNew' } );
                }
            },
            listItems() {
                this.isItem = false;
                this.$store.dispatch( 'central/setLangItem', '' );
                this.$store.dispatch( 'central/setLabelItem', '' );
                this.$store.dispatch( 'central/setContentItem', '' );
                this.$router.push( { name: 'languageList' } );
            },
            goLabel() {
                this.isItem = false;
                this.$store.dispatch( 'central/setLangItem', '' );
                this.$store.dispatch( 'central/setLabelItem', '' );
                this.$store.dispatch( 'central/setContentItem', '' );
                this.$router.push( { name: 'label' } );
            },
            goContent() {
                this.isItem = false;
                this.$store.dispatch( 'central/setLangItem', '' );
                this.$store.dispatch( 'central/setLabelItem', '' );
                this.$store.dispatch( 'central/setContentItem', '' );
                this.$router.push( { name: 'content' } );
            },
        },
        created() {
            this.mcLabel = this.$label;
        },
        updated() {
            // if update-item, set new tab label to Update
            this.isItem = !!this.$store.getters[ 'central/getLangItem' ];
        }
    }
</script>
