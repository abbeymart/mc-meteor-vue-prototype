<template>
    <div>
        <return-detail></return-detail>
    </div>
</template>
<style>

</style>
<script>
    import ReturnDetail from './ReturnDetail.vue';

    export default{
        name      : 'returnNew',
        data(){
            return{
            }
        },
        components:{
            returnDetail: ReturnDetail
        },
    }
</script>