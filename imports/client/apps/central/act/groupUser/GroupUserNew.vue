<template>
    <div>
        <group-user-detail></group-user-detail>
    </div>
</template>
<style>

</style>
<script>
    import GroupUserDetail from './GroupUserDetail.vue';

    export default{
        name      : 'groupUserNew',
        data(){
            return{
            }
        },
        components:{
            groupUserDetail: GroupUserDetail
        },
    }
</script>
