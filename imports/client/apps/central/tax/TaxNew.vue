<template>
    <div>
        <tax-detail></tax-detail>
    </div>
</template>
<style>

</style>
<script>
    import TaxDetail from './TaxDetail.vue';
    import Tax from "./Tax";

    export default{
        name      : 'taxNew',
        data(){
            return{
            }
        },
        components:{
            Tax, taxDetail: TaxDetail
        },
    }
</script>
