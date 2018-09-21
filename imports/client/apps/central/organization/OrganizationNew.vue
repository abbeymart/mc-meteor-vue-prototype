<template>
    <div>
        <org-detail></org-detail>
    </div>
</template>
<style>

</style>
<script>
    import OrgDetail from './OrganizationDetail.vue';

    export default{
        name      : 'orgNew',
        data(){
            return{
            }
        },
        components:{
            orgDetail: OrgDetail
        },
    }
</script>
