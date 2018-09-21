<template>
    <div>
        <order-detail></order-detail>
    </div>
</template>
<style>

</style>
<script>
    import OrderDetail from './OrderDetail.vue';

    export default{
        name      : 'orderNew',
        data(){
            return{
            }
        },
        components:{
            orderDetail: OrderDetail
        },
    }
</script>
