<template>
    <div class="w3-container">
        <!--set default tab/item-display, done via redirect property in router-->
        <span v-if="isMessage" class="alert-warning">{{mcLabel.pageMessage}}</span>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.labelTitle}} &raquo;&raquo;</h4>
            </li>
            <router-link :to="{name: 'errorList'}" tag="li" class="mcBoldLink" active-class="active" exact>
                <a>{{mcLabel.list}}</a>
            </router-link>
            <!--<router-link :to="{name: 'errorDetail'}" tag="li" class="mcBoldLink" active-class="active">-->
                <!--<a v-if="isItem">{{mcLabel.update}}</a>-->
            <!--</router-link>-->
            <li><a href="#" @click.prevent="newItem">New Label</a></li>
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
        name      : 'eman',
        components: {},
        data(){
            return {
                mcLabel     : '',
                currentItems: '',
                isMessage   : false,
                pageMessage : '',
                isItem      : false,
            }
        },
        methods   : {
            newItem(){
                this.isItem = false;
                Session.set( 'currentLabelItem', '' );
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                // go to the new/detail page
                if( parts[ lastIndex ] === 'new' ) {
                    this.$router.push( { name: 'labelDetail' } );
                } else {
                    this.$router.push( { name: 'labelNew' } );
                }
            },
        },
        created(){
            this.mcLabel = this.$label;
        },
        updated(){
            // if update-item, set new tab label to Update
            this.isItem = !!Session.get( 'currentLabelItem' );
        },
    }

</script>