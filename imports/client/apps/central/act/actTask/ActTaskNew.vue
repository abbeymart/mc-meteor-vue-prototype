<template>
    <div>
        <act-task-detail></act-task-detail>
    </div>
</template>
<style>

</style>
<script>
    import ActTaskDetail from './ActTaskDetail.vue';

    export default{
        name      : 'actTaskNew',
        data(){
            return{
            }
        },
        components:{
            actTaskDetail: ActTaskDetail
        },
    }
</script>
