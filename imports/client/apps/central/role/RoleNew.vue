<template>
    <div>
        <role-detail></role-detail>
    </div>
</template>
<style>

</style>
<script>
    import RoleDetail from './RoleDetail.vue';

    export default{
        name      : 'roleNew',
        data(){
            return{
            }
        },
        components:{
            roleDetail: RoleDetail
        },
    }
</script>
