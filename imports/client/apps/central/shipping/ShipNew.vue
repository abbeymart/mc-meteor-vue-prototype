<template>
    <div>
        <ship-detail></ship-detail>
    </div>
</template>
<style>

</style>
<script>
    import ShippingDetail from './ShipDetail.vue';

    export default{
        name      : 'shipNew',
        data(){
            return{
            }
        },
        components:{
            shipDetail: ShippingDetail
        },
    }
</script>
