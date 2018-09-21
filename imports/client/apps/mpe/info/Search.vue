<template>
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.searches}} &raquo;&raquo;</h4>
            </li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listService">{{mcLabel.services}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listProduct">{{mcLabel.products}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listLocation">{{mcLabel.locations}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listPeople">{{mcLabel.people}}</a></li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listOrg">{{mcLabel.organizations}}</a></li>
        </ul>
        <div>
            <router-view class="w3-animate-left"></router-view>
        </div>
    </div>
</template>
<style>

</style>
<script>

    import { Session } from 'meteor/session';

    export default {
        name      : 'search',
        components: {},
        data(){
            return {
                mcLabel     : '',
                currentItems: '',
                isMessage   : false,
                pageMessage : '',
                isItem      : false,
            }
        },
        methods   : {
            listService(){
                // reset currentItem
                this.isItem = false;
                Session.set( 'mcSearchCat', 'Services' );
                this.$router.push( { name: 'serviceSearch' } );
            },
            listProduct(){
                // reset currentItem
                this.isItem = false;
                Session.set( 'mcSearchCat', 'Products' );
                this.$router.push( { name: 'productSearch' } );
            },
            listPeople(){
                // reset currentItem
                this.isItem = false;
                Session.set( 'mcSearchCat', 'People' );
                this.$router.push( { name: 'peopleSearch' } );
            },
            listOrg(){
                // reset currentItem
                this.isItem = false;
                Session.set( 'mcSearchCat', 'Organizations' );
                this.$router.push( { name: 'orgSearch' } );
            },
            listLocation(){
                // reset currentItem
                this.isItem = false;
                Session.set( 'mcSearchCat', 'Locations' );
                this.$router.push( { name: 'locationSearch' } );
            },
        },
        created(){
            this.mcLabel = this.$label;
        },
    }
</script>
