<template>
    <div>
        <wish-detail></wish-detail>
    </div>
</template>
<style>

</style>
<script>
    import WishDetail from './WishDetail.vue';

    export default{
        name      : 'wishNew',
        data(){
            return{
            }
        },
        components:{
            wishDetail: WishDetail
        },
    }
</script>
