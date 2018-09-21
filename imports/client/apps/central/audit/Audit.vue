<template>
    <!--Rebuild / simplify the message package-->
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.audit}} &raquo;&raquo;</h4>
            </li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listAccess">{{mcLabel.auditListAccess}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listCreate">{{mcLabel.auditListCreate}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listUpdate">{{mcLabel.auditListUpdate}}</a></li>
            <!--<li v-if="isItem" class="mcBoldLink"><a href="#">{{mcLabel.update}}</a></li>-->
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
        name      : 'audit',
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
                // reset currentTaxItem
                this.isItem = false;
                Session.set( 'currentAuditItem', '' );
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                // go to the new/detail page
                if( parts[ lastIndex ] === 'new' ) {
                    this.$router.push( { name: 'auditDetail' } );
                } else {
                    this.$router.push( { name: 'auditNew' } );
                }
            },
            listAccess(){
                this.isItem = false;
                Session.set( 'currentAuditItem', '' );
                this.$router.push( { name: 'auditListAccess' } );
            },
            listCreate(){
                this.isItem = false;
                Session.set( 'currentAuditItem', '' );
                this.$router.push( { name: 'auditListCreate' } );
            },
            listUpdate(){
                this.isItem = false;
                Session.set( 'currentAuditItem', '' );
                this.$router.push( { name: 'auditListUpdate' } );
            },
        },
        created(){
            this.mcLabel = this.$label;
        },
        updated(){
            // if update-item, set new tab label to Update
            this.isItem = !!Session.get( 'currentAuditItem' );
        },
    }
</script>
