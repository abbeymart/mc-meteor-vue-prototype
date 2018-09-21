<template>
    <div>
        <act-level-detail></act-level-detail>
    </div>
</template>
<style>

</style>
<script>
    import ActLevelDetail from './ActLevelDetail.vue';

    export default{
        name      : 'actLevelNew',
        data(){
            return{
            }
        },
        components:{
            actLevelDetail: ActLevelDetail
        },
    }
</script>
