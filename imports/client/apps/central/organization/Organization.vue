<template>
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.org}} &raquo;&raquo;</h4>
            </li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listItems">{{mcLabel.list}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="newItem">{{mcLabel.new}}</a></li>
            <li v-if="isItem" class="mcBoldLink"><a href="#" @click.prevent="orgAddress">{{mcLabel.address}}</a>
            </li>
            <li v-if="isItem" class="mcBoldLink"><a href="#" @click.prevent="orgPhone">{{mcLabel.phone}}</a></li>
            <li v-if="isItem" class="mcBoldLink"><a href="#" @click.prevent="orgContact">{{mcLabel.contact}}</a></li>
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
        name      : 'organization',
        components: {},
        data(){
            return {
                mcLabel     : this.$label,
                currentItem : this.$store.getters['central/getOrgItem'],
                currentItems: '',
                isMessage   : false,
                pageMessage : '',
                isItem      : false,
                ownerType   : '',
            }
        },
        methods   : {
            newItem(){
                this.isItem = false;
                this.$store.dispatch('central/setOrgItem', '');
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                // go to the new/detail page
                if( parts[ lastIndex ] === 'new' ) {
                    this.$router.push( { name: 'organizationDetail' } );
                } else {
                    this.$router.push( { name: 'organizationNew' } );
                }
            },
            listItems() {
                this.isItem = false;
                this.$store.dispatch('central/setOrgItem', '');
                this.$router.push( { name: 'organizationList' } );
            },
            orgAddress(){
                // set currentOwnerType
                this.$store.dispatch('central/setOwnerType', 'Organization');
                // route to currentOwnerType page
                this.$router.push( { name: 'orgAddress' } );
            },
            orgPhone(){
                // set currentOwnerType
                this.$store.dispatch('central/setOwnerType', 'Organization');
                // route to currentOwnerType page
                this.$router.push( { name: 'orgPhone' } );
            },
            orgContact(){
                // set currentOwnerType
                this.$store.dispatch('central/setOwnerType', 'Organization');
                // route to currentOwnerType page
                this.$router.push( { name: 'orgContact' } );
            },
        },
        created(){
            // get the current ownerGroup
            this.ownerType = this.$store.getters['central/getOwnerType'];
        },
        updated(){
            // if update-item, set new tab label to Update
            this.isItem = !!this.$store.getters['central/getOrgItem'];
        },
    }
</script>
