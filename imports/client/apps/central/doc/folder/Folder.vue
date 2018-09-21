<template>
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.folders}} &raquo;&raquo;</h4>
            </li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listItems">{{mcLabel.list}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="newItem">New Folder</a></li>
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
        name      : 'folder',
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
                this.$store.dispatch('central/setFolderItem', '');
                // Session.set( 'currentFolderItem', '' );
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                // go to the new/detail page
                if( parts[ lastIndex ] === 'new' ) {
                    this.$router.push( { name: 'folderDetail' } );
                } else {
                    this.$router.push( { name: 'folderNew' } );
                }
            },
            listItems() {
                this.isItem = false;
                this.$store.dispatch('central/setFolderItem', '');
                // Session.set( 'currentFolderItem', '' );
                this.$router.push( { name: 'folderList' } );
            },
        },
        created(){
            this.mcLabel = this.$label;
        },
        updated(){
            // if update-item, set new tab label to Update
            this.isItem = !!this.$store.getters['central/getFolderItem'];
        },
    }

</script>
