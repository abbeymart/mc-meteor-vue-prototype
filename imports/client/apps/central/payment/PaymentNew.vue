<template>
    <div>
        <payment-detail></payment-detail>
    </div>
</template>
<style>

</style>
<script>
    import PaymentDetail from './PayDetail.vue';

    export default{
        name      : 'paymentNew',
        data(){
            return{
            }
        },
        components:{
            paymentDetail: PaymentDetail
        },
    }
</script>
