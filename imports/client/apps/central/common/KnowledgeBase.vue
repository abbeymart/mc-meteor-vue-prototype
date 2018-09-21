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
                itemPath: 'kBase',
            }
        },
        components:{
            mcHome: Home
        }
    }
</script>