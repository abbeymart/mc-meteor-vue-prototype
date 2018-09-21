<template>
    <div>
        <footer class="w3-center">
            <span>
                &copy;{{currentYear}} | {{orgName}} | {{rightRes}}
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
    export default {
        name: 'mcFooter',
        data() {
            return {
                currentYear: (new Date()).getFullYear(),
                orgName    : this.$info.getCompanyName(),
                clientName : this.$info.getClientName(),
                rightRes   : this.$label.rightRes,
                licTo      : this.$label.licTo,
            }
        },
    }

</script>
