<template>
    <div>
        <discount-detail></discount-detail>
    </div>
</template>
<style>

</style>
<script>
    import DiscountDetail from './DiscountDetail.vue';

    export default{
        name      : 'orderProductDiscountNew',
        data(){
            return{
            }
        },
        components:{
            discountDetail: DiscountDetail
        },
    }
</script>
