<template>
    <div>
        <inventory-detail></inventory-detail>
    </div>
</template>
<style>

</style>
<script>
    import InventoryDetail from './InventoryDetail.vue';

    export default{
        name      : 'orderInventoryNew',
        data(){
            return{
            }
        },
        components:{
            inventoryDetail: InventoryDetail
        },
    }
</script>
