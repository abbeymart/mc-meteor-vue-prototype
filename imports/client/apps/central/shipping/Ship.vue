<template>
    <!--Rebuild / simplify the message package-->
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.ships}} &raquo;&raquo;</h4>
            </li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listShip">{{mcLabel.list}}</a></li>
            <!--<li v-if="isItem" class="mcBoldLink"><a href="#">{{mcLabel.update}}</a></li>-->
            <li class="mcBoldLink"><a href="#" @click.prevent="newShip">{{mcLabel.shipNew}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="shipProvider">{{mcLabel.shipProvider}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="shipCost">{{mcLabel.shipCost}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="shipOrder">{{mcLabel.shipOrder}}</a></li>
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
        name      : 'ship',
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
            listShip() {
                // reset currentItem
                this.isItem = false;
                this.$store.dispatch('central/setShipProviderItem', '');
                this.$store.dispatch('central/setShipCostItem', '');
                this.$store.dispatch('central/setShipOrderItem', '');
                this.$store.dispatch('central/setShipItem', '');

                // Session.set( 'currentShipProviderItem', '' );
                // Session.set( 'currentShipCostItem', '' );
                // Session.set( 'currentShipOrderItem', '' );
                // Session.set( 'currentShipItem', '' );
                this.$router.push( { name: 'shipList' } );
            },
            newShip() {
                // reset currentItem
                this.isItem = false;
                this.$store.dispatch('central/setShipProviderItem', '');
                this.$store.dispatch('central/setShipCostItem', '');
                this.$store.dispatch('central/setShipOrderItem', '');
                this.$store.dispatch('central/setShipItem', '');
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                // go to the new/detail page
                if( parts[ lastIndex ] === 'new' ) {
                    this.$router.push( { name: 'shipDetail' } );
                } else {
                    this.$router.push( { name: 'shipNew' } );
                }
            },
            shipProvider() {
                // reset currentItem
                this.isItem = false;
                this.$store.dispatch('central/setShipProviderItem', '');
                this.$store.dispatch('central/setShipCostItem', '');
                this.$store.dispatch('central/setShipOrderItem', '');
                this.$store.dispatch('central/setShipItem', '');
                this.$router.push( { name: 'shipProvider' } );
            },
            shipCost() {
                // reset currentItem
                this.isItem = false;
                this.$store.dispatch('central/setShipProviderItem', '');
                this.$store.dispatch('central/setShipCostItem', '');
                this.$store.dispatch('central/setShipOrderItem', '');
                this.$store.dispatch('central/setShipItem', '');
                this.$router.push( { name: 'shipCost' } );
            },
            shipOrder() {
                // reset currentItem
                this.isItem = false;
                this.$store.dispatch('central/setShipProviderItem', '');
                this.$store.dispatch('central/setShipCostItem', '');
                this.$store.dispatch('central/setShipOrderItem', '');
                this.$store.dispatch('central/setShipItem', '');
                this.$router.push( { name: 'shipOrder' } );
            },
        },
        created() {
            this.mcLabel = this.$label;
        },
        updated() {
            // if update-item, set new tab label to Update
            this.isItem = !!this.$store.getters['central/getShipItem'];
            // this.isItem = !!Session.get( 'currentShipItem' );
        },
    }
</script>