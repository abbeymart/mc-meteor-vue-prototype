<template>
    <div>
        <refund-detail></refund-detail>
    </div>
</template>
<style>

</style>
<script>
    import RefundDetail from './RefundDetail.vue';

    export default{
        name      : 'refundNew',
        data(){
            return{
            }
        },
        components:{
            refundDetail: RefundDetail
        },
    }
</script>
