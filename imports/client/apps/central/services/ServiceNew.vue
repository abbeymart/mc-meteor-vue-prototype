<template>
    <div>
        <service-detail></service-detail>
    </div>
</template>
<style>

</style>
<script>
    import ServiceDetail from './ServiceDetail.vue';

    export default{
        name      : 'serviceNew',
        data(){
            return{
            }
        },
        components:{
            serviceDetail: ServiceDetail
        },
    }
</script>
