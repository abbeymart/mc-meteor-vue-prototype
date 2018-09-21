<template>
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.orders}} &raquo;&raquo;</h4>
            </li>
            <li class="mcBoldLink"><a href="#" @click.prevent="orderCat">{{mcLabel.cats}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listOrder">{{mcLabel.orders}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="orderProduct">{{mcLabel.products}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="orderWish">{{mcLabel.wishes}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="orderCart">{{mcLabel.carts}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="orderPay">{{mcLabel.payments}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="orderShip">{{mcLabel.ships}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="orderInvoice">{{mcLabel.invoices}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="orderReceipt">{{mcLabel.receipts}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="orderCancel">{{mcLabel.orderCancel}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="orderReturn">{{mcLabel.orderReturns}}</a></li>
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
        name      : 'order',
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
            listOrder() {
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentOrderCatItem', '' );
                Session.set( 'currentOrderCancelItem', '' );
                Session.set( 'currentOrderReturnItem', '' );
                Session.set( 'currentOrderProductItem', '' );
                Session.set( 'currentOrderPriceItem', '' );
                Session.set( 'currentOrderInventoryItem', '' );
                Session.set( 'currentOrderWishItem', '' );
                Session.set( 'currentOrderCartItem', '' );
                Session.set( 'currentOrderCheckoutItem', '' );
                Session.set( 'currentOrderInvoiceItem', '' );
                Session.set( 'currentOrderReceiptItem', '' );
                Session.set( 'currentOrderItem', '' );
                this.$router.push( { name: 'orderList' } );
            },
            orderCat() {
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentOrderCatItem', '' );
                Session.set( 'currentOrderCancelItem', '' );
                Session.set( 'currentOrderReturnItem', '' );
                Session.set( 'currentOrderProductItem', '' );
                Session.set( 'currentOrderPriceItem', '' );
                Session.set( 'currentOrderInventoryItem', '' );
                Session.set( 'currentOrderWishItem', '' );
                Session.set( 'currentOrderCartItem', '' );
                Session.set( 'currentOrderCheckoutItem', '' );
                Session.set( 'currentOrderInvoiceItem', '' );
                Session.set( 'currentOrderReceiptItem', '' );
                Session.set( 'currentOrderItem', '' );
                this.$router.push( { name: 'orderCat' } );
            },
            orderCancel() {
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentOrderCatItem', '' );
                Session.set( 'currentOrderCancelItem', '' );
                Session.set( 'currentOrderReturnItem', '' );
                Session.set( 'currentOrderProductItem', '' );
                Session.set( 'currentOrderPriceItem', '' );
                Session.set( 'currentOrderInventoryItem', '' );
                Session.set( 'currentOrderWishItem', '' );
                Session.set( 'currentOrderCartItem', '' );
                Session.set( 'currentOrderCheckoutItem', '' );
                Session.set( 'currentOrderInvoiceItem', '' );
                Session.set( 'currentOrderReceiptItem', '' );
                Session.set( 'currentOrderItem', '' );
                this.$router.push( { name: 'orderCancel' } );
            },
            orderReturn() {
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentOrderCatItem', '' );
                Session.set( 'currentOrderCancelItem', '' );
                Session.set( 'currentOrderReturnItem', '' );
                Session.set( 'currentOrderProductItem', '' );
                Session.set( 'currentOrderPriceItem', '' );
                Session.set( 'currentOrderInventoryItem', '' );
                Session.set( 'currentOrderWishItem', '' );
                Session.set( 'currentOrderCartItem', '' );
                Session.set( 'currentOrderCheckoutItem', '' );
                Session.set( 'currentOrderInvoiceItem', '' );
                Session.set( 'currentOrderReceiptItem', '' );
                Session.set( 'currentOrderItem', '' );
                this.$router.push( { name: 'orderReturn' } );
            },
            orderProduct() {
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentOrderCatItem', '' );
                Session.set( 'currentOrderCancelItem', '' );
                Session.set( 'currentOrderReturnItem', '' );
                Session.set( 'currentOrderProductItem', '' );
                Session.set( 'currentOrderPriceItem', '' );
                Session.set( 'currentOrderInventoryItem', '' );
                Session.set( 'currentOrderWishItem', '' );
                Session.set( 'currentOrderCartItem', '' );
                Session.set( 'currentOrderCheckoutItem', '' );
                Session.set( 'currentOrderInvoiceItem', '' );
                Session.set( 'currentOrderReceiptItem', '' );
                Session.set( 'currentOrderItem', '' );
                this.$router.push( { name: 'orderProduct' } );
            },
            orderPrice() {
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentOrderCatItem', '' );
                Session.set( 'currentOrderCancelItem', '' );
                Session.set( 'currentOrderReturnItem', '' );
                Session.set( 'currentOrderProductItem', '' );
                Session.set( 'currentOrderPriceItem', '' );
                Session.set( 'currentOrderInventoryItem', '' );
                Session.set( 'currentOrderWishItem', '' );
                Session.set( 'currentOrderCartItem', '' );
                Session.set( 'currentOrderCheckoutItem', '' );
                Session.set( 'currentOrderInvoiceItem', '' );
                Session.set( 'currentOrderReceiptItem', '' );
                Session.set( 'currentOrderItem', '' );
                this.$router.push( { name: 'orderPrice' } );
            },
            orderInventory() {
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentOrderCatItem', '' );
                Session.set( 'currentOrderCancelItem', '' );
                Session.set( 'currentOrderReturnItem', '' );
                Session.set( 'currentOrderProductItem', '' );
                Session.set( 'currentOrderPriceItem', '' );
                Session.set( 'currentOrderInventoryItem', '' );
                Session.set( 'currentOrderWishItem', '' );
                Session.set( 'currentOrderCartItem', '' );
                Session.set( 'currentOrderCheckoutItem', '' );
                Session.set( 'currentOrderInvoiceItem', '' );
                Session.set( 'currentOrderReceiptItem', '' );
                Session.set( 'currentOrderItem', '' );
                this.$router.push( { name: 'orderInventory' } );
            },
            orderWish() {
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentOrderCatItem', '' );
                Session.set( 'currentOrderCancelItem', '' );
                Session.set( 'currentOrderReturnItem', '' );
                Session.set( 'currentOrderProductItem', '' );
                Session.set( 'currentOrderPriceItem', '' );
                Session.set( 'currentOrderInventoryItem', '' );
                Session.set( 'currentOrderWishItem', '' );
                Session.set( 'currentOrderCartItem', '' );
                Session.set( 'currentOrderCheckoutItem', '' );
                Session.set( 'currentOrderInvoiceItem', '' );
                Session.set( 'currentOrderReceiptItem', '' );
                Session.set( 'currentOrderItem', '' );
                this.$router.push( { name: 'orderWish' } );
            },
            orderCart() {
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentOrderCatItem', '' );
                Session.set( 'currentOrderCancelItem', '' );
                Session.set( 'currentOrderReturnItem', '' );
                Session.set( 'currentOrderProductItem', '' );
                Session.set( 'currentOrderPriceItem', '' );
                Session.set( 'currentOrderInventoryItem', '' );
                Session.set( 'currentOrderWishItem', '' );
                Session.set( 'currentOrderCartItem', '' );
                Session.set( 'currentOrderCheckoutItem', '' );
                Session.set( 'currentOrderInvoiceItem', '' );
                Session.set( 'currentOrderReceiptItem', '' );
                Session.set( 'currentOrderItem', '' );
                this.$router.push( { name: 'orderCart' } );
            },
            orderInvoice() {
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentOrderCatItem', '' );
                Session.set( 'currentOrderCancelItem', '' );
                Session.set( 'currentOrderReturnItem', '' );
                Session.set( 'currentOrderProductItem', '' );
                Session.set( 'currentOrderPriceItem', '' );
                Session.set( 'currentOrderInventoryItem', '' );
                Session.set( 'currentOrderWishItem', '' );
                Session.set( 'currentOrderCartItem', '' );
                Session.set( 'currentOrderCheckoutItem', '' );
                Session.set( 'currentOrderInvoiceItem', '' );
                Session.set( 'currentOrderReceiptItem', '' );
                Session.set( 'currentOrderItem', '' );
                this.$router.push( { name: 'orderInvoice' } );
            },
            orderPay() {
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentOrderProductItem', '' );
                Session.set( 'currentOrderCancelItem', '' );
                Session.set( 'currentOrderReturnItem', '' );
                Session.set( 'currentOrderPriceItem', '' );
                Session.set( 'currentOrderPriceItem', '' );
                Session.set( 'currentOrderInventoryItem', '' );
                Session.set( 'currentOrderWishItem', '' );
                Session.set( 'currentOrderCartItem', '' );
                Session.set( 'currentOrderCheckoutItem', '' );
                Session.set( 'currentOrderInvoiceItem', '' );
                Session.set( 'currentOrderReceiptItem', '' );
                Session.set( 'currentOrderItem', '' );
                this.$router.push( { name: 'pay' } );
            },
            orderShip() {
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentOrderProductItem', '' );
                Session.set( 'currentOrderCancelItem', '' );
                Session.set( 'currentOrderReturnItem', '' );
                Session.set( 'currentOrderPriceItem', '' );
                Session.set( 'currentOrderPriceItem', '' );
                Session.set( 'currentOrderInventoryItem', '' );
                Session.set( 'currentOrderWishItem', '' );
                Session.set( 'currentOrderCartItem', '' );
                Session.set( 'currentOrderCheckoutItem', '' );
                Session.set( 'currentOrderInvoiceItem', '' );
                Session.set( 'currentOrderReceiptItem', '' );
                Session.set( 'currentOrderItem', '' );
                this.$router.push( { name: 'ship' } );
            },
            orderReceipt() {
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentOrderProductItem', '' );
                Session.set( 'currentOrderCancelItem', '' );
                Session.set( 'currentOrderReturnItem', '' );
                Session.set( 'currentOrderPriceItem', '' );
                Session.set( 'currentOrderPriceItem', '' );
                Session.set( 'currentOrderInventoryItem', '' );
                Session.set( 'currentOrderWishItem', '' );
                Session.set( 'currentOrderCartItem', '' );
                Session.set( 'currentOrderCheckoutItem', '' );
                Session.set( 'currentOrderInvoiceItem', '' );
                Session.set( 'currentOrderReceiptItem', '' );
                Session.set( 'currentOrderItem', '' );
                this.$router.push( { name: 'orderReceipt' } );
            },
        },
        created() {
            this.mcLabel = this.$label;
        },
        updated() {
            // if update-item, set new tab label to Update
            this.isItem = !!this.$store.getters['central/getOrderViewItem'];
             // this.isItem = !!Session.get( 'currentOrderItem' );
        },
    }
</script>
