<template>
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.phone}} &raquo;&raquo;</h4>
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
        name      : 'phone',
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
                // reset current record information
                this.$store.dispatch('central/setPhoneItem', item);
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                const ownerType = this.$store.getters['central/getOwnerType'];

                // go to the new/detail page | route to page based on the currentOwnerType
                if( parts[ lastIndex ] === 'new' ) {
                    if( ownerType === 'User' ) {
                        this.$router.push( { name: 'userPhoneDetail' } );
                    } else if( ownerType === 'Organization' ) {
                        this.$router.push( { name: 'orgPhoneDetail' } );
                    } else {
                        this.$router.push( { name: 'phoneDetail' } );
                    }
                } else {
                    if( ownerType === 'User' ) {
                        this.$router.push( { name: 'userPhoneNew' } );
                    } else if( ownerType === 'Organization' ) {
                        this.$router.push( { name: 'orgPhoneNew' } );
                    } else {
                        this.$router.push( { name: 'phoneNew' } );
                    }
                }
            },
            listItems(){
                // reset current record information
                this.$store.dispatch('central/setPhoneItem', item);
                // route to page based on the currentOwnerType
                const ownerType = this.$store.getters['central/getOwnerType'];
                if( ownerType === 'User' ) {
                    this.$router.push( { name: 'userPhoneList' } );
                } else if( ownerType === 'Organization' ) {
                    this.$router.push( { name: 'orgPhoneList' } );
                } else {
                    this.$router.push( { name: 'phoneList' } );
                }
            }
        },
        created(){
            this.mcLabel = this.$label;
        },
        updated(){
            // if update-item, set new tab label to Update
            this.isItem = !!this.$store.getters['central/getPhoneItem']
        },
    }
</script>
