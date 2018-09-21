<template>
    <div>
        <message-detail></message-detail>
    </div>
</template>
<style>

</style>
<script>
    import MessageDetail from './MessageDetail.vue';

    export default{
        name      : 'messageNew',
        data(){
            return{
            }
        },
        components:{
            messageDetail: MessageDetail
        },
    }
</script>
