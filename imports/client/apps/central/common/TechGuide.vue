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
                itemPath: 'techGuide',
            }
        },
        components:{
            mcHome: Home
        }
    }
</script>