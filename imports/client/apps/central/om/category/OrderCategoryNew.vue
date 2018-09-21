<template>
    <div>
        <order-category-detail></order-category-detail>
    </div>
</template>
<style>

</style>
<script>
    import OrderCategoryDetail from './OrderCategoryDetail.vue';

    export default{
        name      : 'orderCategoryNew',
        data(){
            return{
            }
        },
        components:{
            orderCategoryDetail: OrderCategoryDetail
        },
    }
</script>
