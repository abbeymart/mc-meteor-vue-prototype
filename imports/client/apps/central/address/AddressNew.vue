<template>
    <div>
        <address-detail></address-detail>
    </div>
</template>
<style>

</style>
<script>
    import AddressDetail from './AddressDetail.vue';

    export default{
        name      : 'addressNew',
        data(){
            return{
            }
        },
        components:{
            addressDetail: AddressDetail
        },
    }
</script>
