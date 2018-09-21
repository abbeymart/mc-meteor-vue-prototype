<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-th-list"/> {{mcLabel.langList}}</h4>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <table class="w3-table w3-striped w3-border w3-hoverable" id="mcLangList">
                <thead>
                <tr class="w3-red">
                    <th scope="col">{{mcLabel.code}}</th>
                    <th scope="col">{{mcLabel.name}}</th>
                    <th scope="col">{{mcLabel.desc}}</th>
                    <th scope="col">{{mcLabel.isActive}}</th>
                    <th scope="col">{{mcLabel.update}}</th>
                    <th scope="col">{{mcLabel.delete}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in langItems" :key="item._id">
                    <td>{{item.langCode}}</td>
                    <td>{{item.langName}}</td>
                    <td>{{item.langDesc}}</td>
                    <td>
                        <!--show/hide depending on active-state (Yes/No)-->
                        <span v-if="item.isActive">{{mcLabel.yes}}<i class="glyphicon glyphicon-check"/></span>
                        <span v-else>{{mcLabel.no}}<i class="glyphicon glyphicon-off"/></span>
                    </td>
                    <td>
                        <a id="editLangItem" href="#" @click.prevent="updateItem(item)">
                            {{mcLabel.update}}<i class="glyphicon glyphicon-edit"/>
                        </a>
                    </td>
                    <td>
                        <a id="removeLangItem" href="#" @click.prevent="deleteItem(item)">
                            {{mcLabel.delete}}<i class="glyphicon glyphicon-remove-circle"/>
                        </a>
                    </td>
                </tr>
                </tbody>
            </table>
            <table class="w3-table w3-striped w3-border w3-hoverable" id="langList"></table>
        </div>
    </div>
</template>
<style>

</style>
<script>
    import { Meteor } from 'meteor/meteor';

    export default {
        name      : 'languageList',
        components: {},
        data() {
            return {
                mcLabel     : '',
                isMessage   : false,
                pageMessage : '',
                langItems   : [],
                currentItems: [],
                itemParams  : {},
                itemId      : ''
            }
        },
        methods   : {
            fetchData(){
                // Get current logged-in user's token, for resource access
                const userToken     = this.$auth.getToken(),
                      queryParams   = {},
                      currentItemId = '';
                // Query-limit
                let recPerPage  = this.$store.getters[ 'central/getQueryLimit' ] || this.$constant.getQueryLimit(),   // change from datatable
                      currentPage = 1;    // set from datatable

                // subscriptions
                // params: queryParams, currentItemId, userToken, limit-query (skip & limit)
                // skip = (currentPage# - 1) * recPerPage
                // limit = currentPage# * recPerPage

                // DDP || Meteor.method
                if( userToken ) {
                    // languages
                    Meteor.call( 'getLang', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'LanguageError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.langItems   = result.value;
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Access-key missing or expired. Please login again.';
                }
            },
            shortDesc ( item ) {
                // set the short description for item.desc
                return this.$utils.shortString( item, this.$constant.getShortDesc() );
            },
            updateItem( item ) {
                // set currentItem value
                this.$store.dispatch('central/setLangItem', item);
                // Route to langDetail page
                this.$router.push( { name: 'languageDetail' } );
            },
            updateItems( items ) {
                // update multiple selected items
            },
            deleteItem( item ) {
                // send current item Id to the local delete/remove method
                const userToken = this.$auth.getToken();
                // Meteor method
                if( confirm( this.$message.confirmDelete ) ) {
                    if( userToken ) {
                        Meteor.call( 'removeLang', item._id, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error deleting item. Please retry`;
                            }
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = 'Please login';
                    }
                }
            },
            deleteItems( items ) {
                // delete multiple selected items
            }
        },
        created() {
            this.mcLabel = this.$label;
            // Fetch items from the server, based on role assignment / authorization
            // Get current logged-in user's token, for resource access
            this.fetchData();
        },
        updated() {
            $( '#mcLangList' ).DataTable( {
                destroy     : true,
                "pagingType": "full_numbers"
            } );
        },
    }

</script>
