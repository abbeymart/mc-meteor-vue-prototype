<template>
    <div class="w3-container">
        <!--set default tab/item-display, done via redirect property in router-->
        <span v-if="isMessage" class="alert-info">{{pageMessage}}</span>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.changeEmail}} &raquo;&raquo;</h4>
            </li>
            <router-link :to="{name: 'languageList'}" tag="li" class="mcBoldLink" active-class="active" exact>
                <a>{{mcLabel.list}}</a>
            </router-link>
            <router-link :to="{name: 'languageDetail'}" tag="li" class="mcBoldLink" active-class="active">
                <a>{{mcLabel.new}}</a>
            </router-link>
            <router-link :to="{name: 'languageLabel'}" tag="li" class="mcBoldLink" active-class="active">
                <a>{{mcLabel.label}}</a>
            </router-link>
            <router-link :to="{name: 'languageContent'}" tag="li" class="mcBoldLink" active-class="active">
                <a>{{mcLabel.content}}</a>
            </router-link>
        </ul>
        <div>
            <router-view class="w3-animate-left"></router-view>
        </div>
        <span v-if="isMessage">{{pageMessage}}</span>
    </div>
</template>

<style>
</style>

<script>
    export default {
        name      : 'changeEmail',
        components: {},
        data() {
            return {
                pageTitle      : '',
                mcLabel        : '',
                isTabActive    : true,
                isContentActive: true,
                currentItems   : '',
                isMessage      : false,
                pageMessage    : '',
            }
        },
        methods   : {},
        created() {
            // Locales activation
            this.mcLabel = this.$label;
        },
    }

</script>