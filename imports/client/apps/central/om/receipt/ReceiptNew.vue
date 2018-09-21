<template>
    <div>
        <address-detail></address-detail>
    </div>
</template>
<style>

</style>
<script>
    import ReceiptDetail from './ReceiptDetail.vue';

    export default{
        name      : 'receiptNew',
        data(){
            return{
            }
        },
        components:{
            receiptDetail: ReceiptDetail
        },
    }
</script>
