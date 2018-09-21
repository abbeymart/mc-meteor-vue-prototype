<template>
    <div>
        <pay-provider-detail></pay-provider-detail>
    </div>
</template>
<style>

</style>
<script>
    import PayProviderDetail from './PayProviderDetail.vue';

    export default{
        name      : 'payProviderNew',
        data(){
            return{
            }
        },
        components:{
            payProviderDetail: PayProviderDetail
        },
    }
</script>
