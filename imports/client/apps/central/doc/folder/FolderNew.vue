<template>
    <div>
        <folder-detail></folder-detail>
    </div>
</template>
<style>

</style>
<script>
    import FolderDetail from './FolderDetail.vue';

    export default{
        name      : 'folderNew',
        data(){
            return{
            }
        },
        components:{
            folderDetail: FolderDetail
        },
    }
</script>
