<template>
    <div>
        <content-detail></content-detail>
    </div>
</template>
<style>

</style>
<script>
    import ContentDetail from './ContentDetail.vue';

    export default{
        name      : 'contentNew',
        data(){
            return{
            }
        },
        components:{
            contentDetail: ContentDetail
        },
    }
</script>
