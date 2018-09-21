<template>
    <div>
        <policy-detail></policy-detail>
    </div>
</template>
<style>

</style>
<script>
    import PolicyDetail from './PolicyDetail.vue';

    export default{
        name      : 'policyNew',
        data(){
            return{
            }
        },
        components:{
            policyDetail: PolicyDetail
        },
    }
</script>
