<template>
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.convert}} &raquo;&raquo;</h4>
            </li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listItems">{{mcLabel.list}}</a></li>
            <!--<li v-if="isItem"><a href="#" @click.prevent="updateItem">{{mcLabel.update}}</a></li>-->
            <li class="mcBoldLink"><a href="#" @click.prevent="newItem">{{mcLabel.new}}</a></li>
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
    import { Session } from 'meteor/session';

    export default {
        name      : 'convert',
        components: {},
        data(){
            return {
                mcLabel     : '',
                currentItems: '',
                isMessage   : false,
                pageMessage : '',
                isItem      : false,
                itemId      : '',
            }
        },
        methods   : {
            newItem(){
                this.isItem = false;
                // reset current record information
                Session.set( 'currentConvertItem', '' );
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                // go to the new/detail page
                if( parts[ lastIndex ] === 'new' ) {
                    this.$router.push( { name: 'convertDetail' } );
                } else {
                    this.$router.push( { name: 'convertNew' } );
                }
            },
            listItems(){
                // reset current record information
                Session.set( 'currentConvertItem', '' );
                // route to the list page
                this.$router.push( { name: 'convertList' } );
            }
        },
        created(){
            this.mcLabel = this.$label;
        },
        updated(){
            // if update-item, set new tab label to Update
            this.isItem = !!Session.get( 'currentConvertItem' );
        },
    }
</script>