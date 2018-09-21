<template>
    <div class="w3-container">
        <header>
            <slot name="header"></slot>
        </header>
        <main>
            <slot></slot>
        </main>
        <footer>
            <slot name="footer"></slot>
        </footer>
    </div>
</template>
<style>

</style>
<script>
    export default{
        name: 'appLayout',
        data(){
            return{

            }
        },
        components:{

        }
    }
</script>
