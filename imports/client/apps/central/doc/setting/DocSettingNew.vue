<template>
    <div>
        <doc-setting-detail></doc-setting-detail>
    </div>
</template>
<style>

</style>
<script>
    import DocSettingDetail from './DocSettingDetail.vue';

    export default{
        name      : 'docSettingNew',
        data(){
            return{
            }
        },
        components:{
            docSettingDetail: DocSettingDetail
        },
    }
</script>
