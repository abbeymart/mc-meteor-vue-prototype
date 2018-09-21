<template>
    <div class="w3-container">
        <span v-if="isMessage" class="alert-info">{{mcLabel.pageMessage}}</span>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.setting}} &raquo;&raquo;</h4>
            </li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listItems">{{mcLabel.list}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="newItem" class="mcBoldLink">New Setting</a></li>
        </ul>
        <div>
            <router-view class="w3-animate-left"></router-view>
        </div>
        <hr>
        <span v-if="isMessage">{{pageMessage}}</span>
    </div>
</template>
<style>

</style>
<script>
    import { Meteor } from 'meteor/meteor';
    import { Session } from 'meteor/session';

    export default {
        name      : 'setting',
        components: {},
        data() {
            return {
                mcLabel     : '',
                currentItems: '',
                isMessage   : false,
                pageMessage : '',
                isItem      : false,
                settingLabel: '',
            }
        },
        methods   : {
            newItem() {
                this.isItem = false;
                Session.set( 'currentSettingItem', '' );
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                // go to the new/detail page
                if( parts[ lastIndex ] === 'new' ) {
                    this.$router.push( { name: 'settingDetail' } );
                } else {
                    this.$router.push( { name: 'settingNew' } );
                }
            },
            listItems() {
                this.isItem = false;
                Session.set( 'currentSettingItem', '' );
                this.$router.push( { name: 'settingList' } );
            },
        },
        created() {
            this.mcLabel = this.$label;
            // retrieve setting locales from Labels
            Meteor.call( 'getAllLabel', ( error, result ) => {
                if( error ) {
                    this.isMessage   = true;
                    this.pageMessage = 'LabelError: Retry.';
                } else if( result.code === 'success' ) {
                    this.isMessage    = false;
                    this.pageMessage  = 'Items available';
                    this.settingLabel = _.sortBy( result.value, 'labelName' ).filter( ( item ) => {
                        return item.labelCat === 'MessageLabel';
                    } );
                } else {
                    this.isMessage   = true;
                    this.pageMessage = `${result.code}: ${result.value}`;
                }
            } );
        },
        updated() {
            // if update-item, set new tab label to Update
            this.isItem = !!Session.get( 'currentSettingItem' );
        },
    }

</script>
