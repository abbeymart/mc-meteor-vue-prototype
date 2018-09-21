<template>
    <div>
        <todo-detail></todo-detail>
    </div>
</template>
<style>

</style>
<script>
    import TodoDetail from './TodoDetail.vue';

    export default{
        name      : 'todoNew',
        data(){
            return{
            }
        },
        components:{
            todoDetail: TodoDetail
        },
    }
</script>
