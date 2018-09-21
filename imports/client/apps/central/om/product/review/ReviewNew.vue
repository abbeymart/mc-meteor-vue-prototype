<template>
    <div>
        <review-detail></review-detail>
    </div>
</template>
<style>

</style>
<script>
    import ReviewDetail from './ReviewDetail.vue';

    export default{
        name      : 'reviewNew',
        data(){
            return{
            }
        },
        components:{
            reviewDetail: ReviewDetail
        },
    }
</script>
