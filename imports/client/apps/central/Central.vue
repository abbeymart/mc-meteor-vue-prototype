<!--Central solution (shared services) main page-->
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
        name      : 'central',
        data(){
            return {
                itemPath: 'central',
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
