<template>
    <div>
        <phone-detail></phone-detail>
    </div>
</template>
<style>

</style>
<script>
    import PhoneDetail from './PhoneDetail.vue';

    export default{
        name      : 'phoneNew',
        data(){
            return{
            }
        },
        components:{
            phoneDetail: PhoneDetail
        },
    }
</script>
