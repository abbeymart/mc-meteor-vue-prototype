<template>
    <div>
        <setting-detail></setting-detail>
    </div>
</template>
<style>

</style>
<script>
    import SettingDetail from './SettingDetail.vue';

    export default{
        name      : 'settingNew',
        data(){
            return{
            }
        },
        components:{
            settingDetail: SettingDetail
        },
    }
</script>
