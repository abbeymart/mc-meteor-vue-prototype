<template>
    <div>
        <mc-home :pageTag="itemPath"></mc-home>
    </div>
</template>
<style>

</style>
<script>
    import Home from '../Home.vue';

    export default{
        name      : 'hcm',
        data(){
            return {
                itemPath: 'hcm'
            }
        },
        components: {
            mcHome: Home
        },
        created(){
            // get currentPath information
            this.itemPath = this.$store.getters['central/getProdPath'] || this.itemPath;
        },
    }
</script>
