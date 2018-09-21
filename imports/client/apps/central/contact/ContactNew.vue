<template>
    <div>
        <contact-detail></contact-detail>
    </div>
</template>
<style>

</style>
<script>
    import ContactDetail from './ContactDetail.vue';

    export default{
        name      : 'contactNew',
        data(){
            return{
            }
        },
        components:{
            contactDetail: ContactDetail
        },
    }
</script>
