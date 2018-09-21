<template>
    <div>
        <location-detail></location-detail>
    </div>
</template>
<style>

</style>
<script>
    import LocationDetail from './LocationDetail.vue';

    export default{
        name      : 'locationNew',
        data(){
            return{
            }
        },
        components:{
            locationDetail: LocationDetail
        },
    }
</script>
