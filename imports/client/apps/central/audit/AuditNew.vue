<template>
    <div>
        <audit-detail></audit-detail>
    </div>
</template>
<style>

</style>
<script>
    import AuditDetail from './AuditDetail.vue';

    export default{
        name      : 'auditNew',
        data(){
            return{
            }
        },
        components:{
            auditDetail: AuditDetail
        },
    }
</script>
