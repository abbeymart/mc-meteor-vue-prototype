<template>
    <div>
        <ship-provider-detail></ship-provider-detail>
    </div>
</template>
<style>

</style>
<script>
    import ShipProviderDetail from './ShipProviderDetail.vue';

    export default{
        name      : 'shipProviderNew',
        data(){
            return{
            }
        },
        components:{
            shipProviderDetail: ShipProviderDetail
        },
    }
</script>
