<template>
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.raaci}} &raquo;&raquo;</h4>
            </li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listItems">{{mcLabel.list}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="newItem">New Role</a></li>
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
        name      : 'raaci',
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
                Session.set( 'currentRoleItem', '' );
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                // go to the new/detail page
                if( parts[ lastIndex ] === 'new' ) {
                    this.$router.push( { name: 'roleDetail' } );
                } else {
                    this.$router.push( { name: 'roleNew' } );
                }
            },
            listItems() {
                this.isItem = false;
                Session.set( 'currentRoleItem', '' );
                this.$router.push( { name: 'roleList' } );
            },
        },
        created(){
            this.mcLabel = this.$label;
        },
        updated(){
            // if update-item, set new tab label to Update
            if( Session.get( 'currentRoleItem' ) ) {
                this.isItem = true;
            }
        },
    }

</script>