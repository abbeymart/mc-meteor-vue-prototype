<template>
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.products}} &raquo;&raquo;</h4>
            </li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listItems">{{mcLabel.list}}</a></li>
            <!--<li v-if="isItem" class="mcBoldLink"><a href="#">{{mcLabel.update}}</a></li>-->
            <li class="mcBoldLink"><a href="#" @click.prevent="newItem">{{mcLabel.new}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="productFeature">{{mcLabel.features}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="productDoc">{{mcLabel.documents}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="productPrice">{{mcLabel.prices}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="productDiscount">{{mcLabel.discounts}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="productReview">{{mcLabel.reviews}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="productInventory">{{mcLabel.inventory}}</a></li>
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
        name      : 'orderProduct',
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
            listItems(){
                // reset currentItem
                this.isItem = false;
                this.$store.dispatch('central/setProductItem', '');
                // Session.set( 'currentProductItem', '' );
                this.$router.push( { name: 'orderProductList' } );
            },
            newItem(){
                // reset currentItem
                this.isItem = false;
                this.$store.dispatch('central/setProductItem', '');
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                // go to the new/detail page
                if( parts[ lastIndex ] === 'new' ) {
                    this.$router.push( { name: 'orderProductDetail' } );
                } else {
                    this.$router.push( { name: 'orderProductNew' } );
                }
            },
            productFeature(){
                // reset currentItem
                // this.isItem = false;
                // this.$store.dispatch('central/setProductItem', '');
                this.$router.push( { name: 'orderProductFeature' } );
            },
            productPrice(){
                // reset currentItem
                // this.isItem = false;
                // this.$store.dispatch('central/setProductPriceItem', '');
                this.$router.push( { name: 'orderProductPrice' } );
            },
            productDiscount(){
                // reset currentItem
                // this.isItem = false;
                // this.$store.dispatch('central/setProductDiscountItem', '');
                this.$router.push( { name: 'orderProductDiscount' } );
            },
            productDoc(){
                // reset currentItem
                // this.isItem = false;
                // this.$store.dispatch('central/setProductItem', '');
                this.$router.push( { name: 'orderProductDoc' } );
            },
            productReview(){
                // reset currentItem
                // this.isItem = false;
                // this.$store.dispatch('central/setProductItem', '');
                this.$router.push( { name: 'orderProductReview' } );
            },
            productInventory(){
                // reset currentItem
                // this.isItem = false;
                // this.$store.dispatch('central/setProductInventoryItem', '');
                this.$router.push( { name: 'orderProductInventory' } );
            },
        },
        created(){
            // locales
            this.mcLabel = this.$label;
            // admin-user status (true or false)
            if( this.$store.getters[ 'central/getCurrentUser' ] ) {
                this.isAdmin = this.$store.getters[ 'central/getCurrentUser' ].isAdmin;
            }
            // if update-item, set new tab label to Update
            this.isItem = !!Session.get( 'currentProductItem' );
        },
        updated(){
            // if update-item, set new tab label to Update
            this.isItem = !!Session.get( 'currentProductItem' );
        },
    }
</script>
