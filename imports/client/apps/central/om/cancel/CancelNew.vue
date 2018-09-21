<template>
    <div>
        <cancel-detail></cancel-detail>
    </div>
</template>
<style>

</style>
<script>
    import CancelDetail from './CancelDetail.vue';

    export default{
        name      : 'orderCancelNew',
        data(){
            return{
            }
        },
        components:{
            cancelDetail: CancelDetail
        },
    }
</script>