<template>
    <div>
        <invoice-detail></invoice-detail>
    </div>
</template>
<style>

</style>
<script>
    import InvoiceDetail from './InvoiceDetail.vue';

    export default{
        name      : 'invoiceNew',
        data(){
            return{
            }
        },
        components:{
            invoiceDetail: InvoiceDetail
        },
    }
</script>
