<template>
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.service}} &raquo;&raquo;</h4>
            </li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listItems">{{mcLabel.list}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="newItem">New Service-Item</a></li>
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

    import { Session } from 'meteor/session';

    export default {
        name      : 'service',
        components: {},
        data() {
            return {
                mcLabel     : this.$label,
                currentItems: '',
                isMessage   : false,
                pageMessage : '',
                isItem      : false,
            }
        },
        methods   : {
            newItem() {
                this.isItem = false;
                this.$store.dispatch('central/setServiceItem', '');
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                // go to the new/detail page
                if( parts[ lastIndex ] === 'new' ) {
                    this.$router.push( { name: 'serviceDetail' } );
                } else {
                    this.$router.push( { name: 'serviceNew' } );
                }
            },
            listItems() {
                this.isItem = false;
                this.$store.dispatch('central/setServiceItem', '');
                this.$router.push( { name: 'serviceList' } );
            },
        },
        updated() {
            // if update-item, set new tab label to Update
            this.isItem = !!this.$store.getters['central/getServiceItem'];
        },
    }

</script>