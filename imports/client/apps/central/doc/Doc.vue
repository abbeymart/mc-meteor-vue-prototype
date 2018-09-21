<template>
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.doc}} &raquo;&raquo;</h4>
            </li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listItems">{{mcLabel.list}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="newItem">{{mcLabel.new}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="goFolder">{{mcLabel.folder}}</a></li>
        </ul>
        <div>
            <router-view class="w3-animate-left"></router-view>
        </div>
    </div>
</template>
<style>

</style>
<script>
    export default {
        name      : 'document',
        components: {},
        data() {
            return {
                mcLabel    : '',
                isMessage  : false,
                pageMessage: '',
                isItem     : false,
            }
        },
        methods   : {
            newItem() {
                this.isItem = false;
                this.$store.dispatch( 'central/setDocItem', '' );
                // Session.set( 'currentDocItem', '' );
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                // go to the new/detail page
                if( parts[ lastIndex ] === 'new' ) {
                    this.$router.push( { name: 'docDetail' } );
                } else {
                    this.$router.push( { name: 'docNew' } );
                }
            },
            listItems() {
                this.isItem = false;
                this.$store.dispatch( 'central/setDocItem', '' );
                // Session.set( 'currentDocItem', '' );
                this.$router.push( { name: 'docList' } );
            },
            goFolder() {
                this.isItem = false;
                this.$store.dispatch( 'central/setDocItem', '' );
                // Session.set( 'currentDocItem', '' );
                this.$router.push( { name: 'folder' } );
            }
        },
        created() {
            this.mcLabel = this.$label;
        },
        updated() {
            // if update-item, set new tab label to Update
            this.isItem = !!this.$store.getters[ 'central/getDocItem' ];
        },
    }

</script>
