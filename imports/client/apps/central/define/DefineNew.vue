<template>
    <div>
        <define-detail></define-detail>
    </div>
</template>
<style>

</style>
<script>
    import DefineDetail from './Define.vue';

    export default{
        name      : 'defineNew',
        data(){
            return{
            }
        },
        components:{
            defineDetail: DefineDetail
        },
    }
</script>
