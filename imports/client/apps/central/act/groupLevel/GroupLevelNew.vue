<template>
    <div>
        <group-level-detail></group-level-detail>
    </div>
</template>
<style>

</style>
<script>
    import GroupLevelDetail from './GroupLevelDetail.vue';

    export default{
        name      : 'groupLevelNew',
        data(){
            return{
            }
        },
        components:{
            groupLevelDetail: GroupLevelDetail
        },
    }
</script>
