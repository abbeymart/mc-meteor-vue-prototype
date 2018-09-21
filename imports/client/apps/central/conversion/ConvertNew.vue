<template>
    <div>
        <convert-detail></convert-detail>
    </div>
</template>
<style>

</style>
<script>
    import ConvertDetail from './ConvertDetail.vue';

    export default{
        name      : 'convertNew',
        data(){
            return{
            }
        },
        components:{
            convertDetail: ConvertDetail
        },
    }
</script>
