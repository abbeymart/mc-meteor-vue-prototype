<template>
    <div>
        <mc-home :pageTag="itemPath"></mc-home>
    </div>
</template>
<style>

</style>
<script>
    import Home from '../../Home.vue'

    export default{
        data(){
            return{
                itemPath: 'news',
            }
        },
        components:{
            mcHome: Home
        }
    }
</script>