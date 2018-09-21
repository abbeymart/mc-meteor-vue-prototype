<template>
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.carts}} &raquo;&raquo;</h4>
            </li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listItem">{{mcLabel.listCart}}</a></li>
            <!--<li v-if="isItem" class="mcBoldLink"><a href="#">{{mcLabel.update}}</a></li>-->
            <li class="mcBoldLink"><a href="#" @click.prevent="newItem">{{mcLabel.addCart}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="shopCart">{{mcLabel.carts}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="cartCheckout">{{mcLabel.checkoutDetail}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="tradeInvoice">{{mcLabel.invoiceDetail}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="tradeReceipt">{{mcLabel.receiptDetail}}</a></li>

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
        name      : 'cart',
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
            listItem(){
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentTradeCartItem', '' );
                this.$router.push( { name: 'orderCartList' } );
            },
            newItem(){
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentTradeCartItem', '' );
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                // go to the new/detail page
                if( parts[ lastIndex ] === 'new' ) {
                    this.$router.push( { name: 'orderCartDetail' } );
                } else {
                    this.$router.push( { name: 'orderCartNew' } );
                }
            },
            shopCart(){
                // reset currentItem
                this.isItem = false;
                this.$router.push( { name: 'orderCartView' } );
            },
            cartCheckout(){
                // reset currentItem (optional default checkout...)
                this.isItem = false;
                this.$router.push( { name: 'orderCartCheckoutCash' } );
            },
            tradeInvoice(){
                // reset currentItem
                this.isItem = false;
                this.$router.push( { name: 'orderTradeInvoiceDetail' } );
            },
            tradeReceipt(){
                // reset currentItem
                this.isItem = false;
                this.$router.push( { name: 'orderTradeReceiptDetail' } );
            },
        },
        created(){
            this.mcLabel = this.$label;
        },
        updated(){
            // if update-item, set new tab label to Update
            this.isItem = !!Session.get( 'currentOrderItem' );
        },
    }
</script>