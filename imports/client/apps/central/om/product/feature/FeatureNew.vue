<template>
    <div>
        <feature-detail></feature-detail>
    </div>
</template>
<style>

</style>
<script>
    import FeatureDetail from './FeatureDetail.vue';

    export default{
        name      : 'orderProductFeatureNew',
        data(){
            return{
            }
        },
        components:{
            featureDetail: FeatureDetail
        },
    }
</script>
