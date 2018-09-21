<template>
    <div>
        <std-cat-detail></std-cat-detail>
    </div>
</template>
<style>

</style>
<script>
    import StdCatDetail from './StandardCategoryDetail.vue';

    export default{
        name      : 'stdCatNew',
        data(){
            return{
            }
        },
        components:{
           stdCatDetail: StdCatDetail
        },
    }
</script>
