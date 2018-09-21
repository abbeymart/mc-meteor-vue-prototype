<template>
    <div>
        <cart-detail></cart-detail>
    </div>
</template>
<style>

</style>
<script>
    import CartDetail from './CartDetail.vue';

    export default{
        name      : 'cartNew',
        data(){
            return{
            }
        },
        components:{
            cartDetail: CartDetail
        },
    }
</script>
