<template>
    <div>
        <lang-detail></lang-detail>
    </div>
</template>
<style>

</style>
<script>
    import LanguageDetail from './LanguageDetail.vue';

    export default{
        name      : 'languageNew',
        data(){
            return{
            }
        },
        components:{
            langDetail: LanguageDetail
        },
    }
</script>
