<template>
    <div>
        <ship-cost-detail></ship-cost-detail>
    </div>
</template>
<style>

</style>
<script>
    import ShipCostDetail from './ShipCostDetail.vue';

    export default{
        name      : 'shipCostNew',
        data(){
            return{
            }
        },
        components:{
            shipCostDetail: ShipCostDetail
        },
    }
</script>
