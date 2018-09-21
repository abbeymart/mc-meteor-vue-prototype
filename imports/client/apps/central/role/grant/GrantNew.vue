<template>
    <div>
        <grant-detail></grant-detail>
    </div>
</template>
<style>

</style>
<script>
    import GrantDetail from './GrantDetail.vue';

    export default{
        name      : 'grantNew',
        data(){
            return{
            }
        },
        components:{
            grantDetail: GrantDetail
        },
    }
</script>
