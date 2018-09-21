<template>
    <div>
        <std-code-detail></std-code-detail>
    </div>
</template>
<style>

</style>
<script>
    import StdCodeDetail from './StandardCodeDetail.vue';

    export default{
        name      : 'stdCodeNew',
        data(){
            return{
            }
        },
        components:{
            stdCodeDetail: StdCodeDetail
        },
    }
</script>
