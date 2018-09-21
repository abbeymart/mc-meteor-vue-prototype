<template>
    <div>
        <eman-detail></eman-detail>
    </div>
</template>
<style>

</style>
<script>
    import EmanDetail from './EmanDetail.vue';

    export default{
        name      : 'emanNew',
        data(){
            return{
            }
        },
        components:{
            emanDetail: EmanDetail
        },
    }
</script>
