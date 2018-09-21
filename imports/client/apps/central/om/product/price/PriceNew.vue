<template>
    <div>
        <price-detail></price-detail>
    </div>
</template>
<style>

</style>
<script>
    import PriceDetail from './PriceDetail.vue';

    export default{
        name      : 'orderProductPriceNew',
        data(){
            return{
            }
        },
        components:{
            priceDetail: PriceDetail
        },
    }
</script>
