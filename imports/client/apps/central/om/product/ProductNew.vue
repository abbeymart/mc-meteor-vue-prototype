<template>
    <div>
        <product-detail></product-detail>
    </div>
</template>
<style>

</style>
<script>
    import ProductDetail from './ProductDetail.vue';

    export default{
        name      : 'orderProductNew',
        data(){
            return{
            }
        },
        components:{
            productDetail: ProductDetail
        },
    }
</script>
