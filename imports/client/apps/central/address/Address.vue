<template>
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.address}} &raquo;&raquo;</h4>
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
    export default {
        name      : 'mc-address',
        components: {},

        data() {
            return {
                mcLabel    : this.$label,
                isMessage  : false,
                pageMessage: '',
                isItem     : false,
            }
        },
        methods   : {
            newItem() {
                this.isItem = false;
                // reset current record information
                this.$store.dispatch( 'central/setAddressItem', '' );
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                const ownerType = this.$store.getters[ 'central/getOwnerType' ];
                // go to the new/detail page
                if( parts[ lastIndex ] === 'new' ) {
                    if( ownerType === 'User' ) {
                        this.$router.push( { name: 'userAddressDetail' } );
                    } else if( ownerType === 'Organization' ) {
                        this.$router.push( { name: 'orgAddressDetail' } );
                    } else {
                        this.$router.push( { name: 'addressDetail' } );
                    }
                } else {
                    if( ownerType === 'User' ) {
                        this.$router.push( { name: 'userAddressNew' } );
                    } else if( ownerType === 'Organization' ) {
                        this.$router.push( { name: 'orgAddressNew' } );
                    } else {
                        this.$router.push( { name: 'addressNew' } );
                    }
                }
            },
            listItems() {
                // reset current record information
                this.$store.dispatch( 'central/setAddressItem', '' );
                // route to page based on the currentOwnerType
                const ownerType = this.$store.getters[ 'central/getOwnerType' ];
                if( ownerType === 'User' ) {
                    this.$router.push( { name: 'userAddressList' } );
                } else if( ownerType === 'Organization' ) {
                    this.$router.push( { name: 'orgAddressList' } );
                } else {
                    this.$router.push( { name: 'addressList' } );
                }
            }
        },
        updated() {
            // if update-item, set new tab label to Update
            this.isItem = !!this.$store.getters[ 'central/getAddressItem' ];
        },
    }

</script>