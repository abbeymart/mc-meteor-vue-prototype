<template>
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.contact}} &raquo;&raquo;</h4>
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

    export default {
        name      : 'contact',
        components: {},
        data() {
            return {
                mcLabel     : '',
                currentItems: '',
                isMessage   : false,
                pageMessage : '',
                isItem      : false,
            }
        },
        methods   : {
            newItem() {
                this.isItem = false;
                // reset current record information
                this.$store.dispatch('central/setContactItem', '');
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                const ownerType = this.$store.getters['central/getOwnerType'];

                // go to the new/detail page || route to page based on the currentOwnerType
                if( parts[ lastIndex ] === 'new' ) {
                    if( ownerType === 'User' ) {
                        this.$router.push( { name: 'userContactDetail' } );
                    } else if( ownerType === 'Organization' ) {
                        this.$router.push( { name: 'orgContactDetail' } );
                    } else {
                        this.$router.push( { name: 'contactDetail' } );
                    }
                } else {
                    if( ownerType === 'User' ) {
                        this.$router.push( { name: 'userContactNew' } );
                    } else if( ownerType === 'Organization' ) {
                        this.$router.push( { name: 'orgContactNew' } );
                    } else {
                        this.$router.push( { name: 'contactNew' } );
                    }
                }
            },
            listItems() {
                // reset current record information
                this.$store.dispatch('central/setContactItem', '');
                // route to page based on the currentOwnerType
                if( this.$store.getters['central/getOwnerType'] === 'User' ) {
                    this.$router.push( { name: 'userContactList' } );
                } else if( this.$store.getters['central/getOwnerType'] === 'Organization' ) {
                    this.$router.push( { name: 'orgContactList' } );
                } else {
                    this.$router.push( { name: 'contactList' } );
                }
            }
        },
        created() {
            this.mcLabel = this.$label;
        },
        updated() {
            // if update-item, set new tab label to Update
            this.isItem = !!this.$store.getters['central/getContactItem'];
        },
    }
</script>
