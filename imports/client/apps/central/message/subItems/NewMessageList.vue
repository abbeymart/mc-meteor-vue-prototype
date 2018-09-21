<template>
    <div>
        <msg-List :msgStatus="itemPath"></msg-List>
    </div>
</template>
<style>

</style>
<script>
    import MessageList from '../MessageList.vue';

    export default{
        name      : 'newMsgList',
        data(){
            return{
                itemPath: '',
            }
        },
        components:{
            msgList: MessageList
        },
        created(){
            // get currentPath information
            this.itemPath = this.$store.getters['central/getMsgListAction'];
        },
    }
</script>
