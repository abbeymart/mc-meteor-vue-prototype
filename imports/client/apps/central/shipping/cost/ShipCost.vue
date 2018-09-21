<template>
    <!--Rebuild / simplify the message package-->
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.shipCost}} &raquo;&raquo;</h4>
            </li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listCost">{{mcLabel.list}}</a></li>
            <!--<li v-if="isItem" class="mcBoldLink"><a href="#">{{mcLabel.update}}</a></li>-->
            <li class="mcBoldLink"><a href="#" @click.prevent="newCost">{{mcLabel.new}}</a></li>
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
        name      : 'shipCost',
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
            listCost(){
                // reset currentItem
                this.isItem = false;
                this.$store.dispatch( 'central/setShipCostItem', '' );
                this.$router.push( { name: 'shipCostList' } );
            },
            newCost(){
                // reset currentItem
                this.isItem = false;
                this.$store.dispatch( 'central/setShipCostItem', '' );
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                // go to the new/detail page
                if( parts[ lastIndex ] === 'new' ) {
                    this.$router.push( { name: 'shipCostDetail' } );
                } else {
                    this.$router.push( { name: 'shipCostNew' } );
                }
            },
        },
        created(){
            // locales
            this.mcLabel = this.$label;
        },
        updated(){
            // if update-item, set new tab label to Update
            this.isItem = !!this.$store.getters['central/getShipCostItem'];
        },
    }
</script>