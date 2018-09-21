<template>
    <div>
        <user-detail></user-detail>
    </div>
</template>
<style>

</style>
<script>
    import UserDetail from './UserDetail.vue';

    export default{
        name      : 'userNew',
        data(){
            return{
            }
        },
        components:{
            userDetail: UserDetail
        },
    }
</script>
