<template>
    <div>
        <ship-order-detail></ship-order-detail>
    </div>
</template>
<style>

</style>
<script>
    import ShipOrderDetail from './ShipOrderDetail.vue';

    export default {
        name      : 'shipOrderNew',
        data() {
            return {}
        },
        components: {
            shipOrderDetail: ShipOrderDetail
        },
    }
</script>
