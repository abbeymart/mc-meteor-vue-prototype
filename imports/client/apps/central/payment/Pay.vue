<template>
    <!--Rebuild / simplify the message package-->
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.payments}} &raquo;&raquo;</h4>
            </li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listPay">{{mcLabel.list}}</a></li>
            <!--<li v-if="isItem" class="mcBoldLink"><a href="#">{{mcLabel.update}}</a></li>-->
            <!--<li class="mcBoldLink"><a href="#" @click.prevent="newPay">{{mcLabel.payNew}}</a></li>-->
            <li class="mcBoldLink"><a href="#" @click.prevent="payProvider">{{mcLabel.payProvider}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="orderPay">{{mcLabel.orderPays}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="refundPay">{{mcLabel.refunds}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="testPay">{{mcLabel.payTest}}</a></li>
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
        name      : 'pay',
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
            listPay(){
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentPayProviderItem', '' );
                Session.set( 'currentPayItem', '' );
                Session.set( 'currentOrderPayItem', '' );
                Session.set( 'currentRefundItem', '' );
                this.$router.push( { name: 'payList' } );
            },
            newPay(){
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentPayProviderItem', '' );
                Session.set( 'currentPayItem', '' );
                Session.set( 'currentOrderPayItem', '' );
                Session.set( 'currentRefundItem', '' );
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                // go to the new/detail page
                if( parts[ lastIndex ] === 'new' ) {
                    this.$router.push( { name: 'payDetail' } );
                } else {
                    this.$router.push( { name: 'payNew' } );
                }
            },
            payProvider(){
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentPayProviderItem', '' );
                Session.set( 'currentPayItem', '' );
                Session.set( 'currentOrderPayItem', '' );
                Session.set( 'currentRefundItem', '' );
                this.$router.push( { name: 'payProvider' } );
            },
            orderPay(){
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentPayProviderItem', '' );
                Session.set( 'currentPayItem', '' );
                Session.set( 'currentOrderPayItem', '' );
                Session.set( 'currentRefundItem', '' );
                this.$router.push( { name: 'orderPayment' } );
            },
            refundPay(){
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentPayProviderItem', '' );
                Session.set( 'currentPayItem', '' );
                Session.set( 'currentOrderPayItem', '' );
                Session.set( 'currentRefundItem', '' );
                this.$router.push( { name: 'refund' } );
            },
            testPay(){
                // reset currentItem
                this.isItem = false;
                Session.set( 'currentPayProviderItem', '' );
                Session.set( 'currentPayItem', '' );
                Session.set( 'currentOrderPayItem', '' );
                Session.set( 'currentRefundItem', '' );
                this.$router.push( { name: 'testPay' } );
            },
        },
        created(){
            this.mcLabel = this.$label;
        },
        updated(){
            // if update-item, set new tab label to Update
            this.isItem = !!Session.get( 'currentPayItem' );
        },
    }
</script>
