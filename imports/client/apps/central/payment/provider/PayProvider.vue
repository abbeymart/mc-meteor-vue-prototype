<template>
    <!--Rebuild / simplify the message package-->
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.payProvider}} &raquo;&raquo;</h4>
            </li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listProvider">{{mcLabel.list}}</a></li>
            <!--<li v-if="isItem" class="mcBoldLink"><a href="#">{{mcLabel.update}}</a></li>-->
            <li class="mcBoldLink"><a href="#" @click.prevent="newProvider">{{mcLabel.providerNew}}</a></li>
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
        name      : 'payProvider',
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
            newProvider(){
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentPayProviderItem', '' );
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                // go to the new/detail page
                if( parts[ lastIndex ] === 'new' ) {
                    this.$router.push( { name: 'payProviderDetail' } );
                } else {
                    this.$router.push( { name: 'payProviderNew' } );
                }
            },
            listProvider(){
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentPayProviderItem', '' );
                this.$router.push( { name: 'payProviderList' } );
            },
        },
        created(){
            this.mcLabel = this.$label;
        },
        updated(){
            // if update-item, set new tab label to Update
            this.isItem = !!Session.get( 'currentPayProviderItem' );
        },
    }
</script>
