<template>
    <div>
        <order-payment-detail></order-payment-detail>
    </div>
</template>
<style>

</style>
<script>
    import OrderPaymentDetail from './PaymentDetail.vue';

    export default{
        name      : 'orderPaymentNew',
        data(){
            return{
            }
        },
        components:{
            orderPaymentDetail: OrderPaymentDetail
        },
    }
</script>