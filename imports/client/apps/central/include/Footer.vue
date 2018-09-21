<template>
    <div>
        <footer class="w3-center">
            <span>
                &copy;{{currentYear}} | {{orgName}} | {{mcLabel.rightRes}}
            </span>
            <!--<span>-->
            <!--&copy;{{currentYear}} {{orgName}} | {{mcLabel.rightRes}} | {{mcLabel.licTo}} {{clientName}}-->
            <!--</span>-->
        </footer>
    </div>
</template>
<style>

</style>
<script>
    const getYear  = new Date();
    // const fullYear = getYear.getFullYear();

    export default {
        name      : 'centralFooter',
        data() {
            return {
                currentYear: getYear.getFullYear(),
                orgName    : this.$info.getCompanyName(),
                clientName : this.$info.getClientName(),
                mcLabel    : this.$label,
            }
        },
        components: {},
        methods   : {},
        created() {
            // this.mcLabel = this.$label;
        },
    }

</script>
