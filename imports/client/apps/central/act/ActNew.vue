<template>
    <div>
        <act-detail></act-detail>
    </div>
</template>
<style>

</style>
<script>
    import ActDetail from './ActDetail.vue';

    export default{
        name      : 'actNew',
        data(){
            return{
            }
        },
        components:{
            actDetail: ActDetail
        },
    }
</script>
