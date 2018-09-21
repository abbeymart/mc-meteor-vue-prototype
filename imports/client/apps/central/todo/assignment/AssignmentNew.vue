<template>
    <div>
        <assignment-detail></assignment-detail>
    </div>
</template>
<style>

</style>
<script>
    import AssignmentDetail from './AssignmentDetail.vue';

    export default{
        name      : 'assignmentNew',
        data(){
            return{
            }
        },
        components:{
            assignmentDetail: AssignmentDetail
        },
    }
</script>
