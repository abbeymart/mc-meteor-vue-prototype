<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-th-list"/> {{mcLabel.stdCodeListTitle}}</h4>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <table class="w3-table w3-striped w3-border w3-hoverable" id="mcCodeList">
                <thead>
                <tr class="w3-red">
                    <th scope="col">{{mcLabel.name}}</th>
                    <th scope="col">{{mcLabel.desc}}</th>
                    <th scope="col">{{mcLabel.cat}}</th>
                    <th scope="col">{{mcLabel.parent}}</th>
                    <th scope="col">{{mcLabel.lang}}</th>
                    <th scope="col">{{mcLabel.isActive}}</th>
                    <th scope="col">{{mcLabel.update}}</th>
                    <th scope="col">{{mcLabel.delete}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in codeItems" @click.prevent="updateItem(item)">
                    <td>{{item.codeName}}</td>
                    <td>{{shortDesc(item.codeDesc)}}</td>
                    <td>{{item.codeCat}}</td>
                    <td>{{parentName(item.parentId)}}</td>
                    <td>{{langName(item.codeLang)}}</td>
                    <td>
                        <!--show/hide depending on active-state (Yes/No)-->
                        <span v-if="item.isActive">{{mcLabel.yes}}<i class="glyphicon glyphicon-check"/></span>
                        <span v-else>{{mcLabel.no}}<i class="glyphicon glyphicon-off"/></span>
                    </td>
                    <td>
                        <a id="editCodeItem" href="#" @click.prevent="updateItem(item)">
                            {{mcLabel.update}}<i class="glyphicon glyphicon-edit"/>
                        </a>
                    </td>
                    <td>
                        <a id="removeCodeItem" href="#" @click.prevent="deleteItem(item)">
                            {{mcLabel.delete}}<i class="glyphicon glyphicon-remove-circle"/>
                        </a>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<style>

</style>
<script>
    import { Meteor } from 'meteor/meteor';
    import { Session } from 'meteor/session';

    export default {
        name      : 'defineList',
        components: {},
        data() {
            return {
                mcLabel    : '',
                isMessage  : false,
                pageMessage: '',
                langItems  : [],
                codeItems  : [],
                itemParams : {},
                itemId     : '',
                catItems   : [],
            }
        },
        methods   : {
            parentName( parentId ) {
                // TODO: compute from the server-side (e.g graphQL)??
                const parent = this.$lo.find( this.codeItems, { _id: parentId } );
                return parent ? parent.codeName : 'n/a';
            },
            shortDesc ( item ) {
                // set the short description for item.desc
                return this.$utils.shortString( item, this.$constant.getShortDesc() );
            },
            langName( code ) {
                const lang = this.$lo.find( this.langItems, { langCode: code } );
                return lang ? lang.langName : 'n/a';
            },
            catName( itemId ) {
                const cat = this.$lo.find( this.catItems, { _id: itemId } );
                return cat ? cat.catName : 'n/a';
            },
            newItem() {
                Session.set( 'currentCodeItem', '' );
                // Route to detail page
                this.$router.push( { name: 'standardCodeDetail' } );
            },
            updateItem( item ) {
                // Set current item
                Session.set( 'currentCodeItem', item );
                // Route to detail page
                this.$router.push( { name: 'standardCodeDetail' } );
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
                        Meteor.call( 'removeCode', item._id, userToken, ( error, result ) => {
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
            const userToken     = this.$auth.getToken(),
                  queryParams   = {},
                  currentItemId = '';
            // DDP || Meteor.method
            if( userToken ) {
                // standard codes
                Meteor.call( 'getCode', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'CategoryError, Retry: ' + error;
                    } else if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.codeItems   = this.$lo.sortBy(result.value, 'codeName');
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
                // get standard code items
                Meteor.call( 'getCat', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'CategoryError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.catItems    = this.$lo.sortBy(result.value, 'catName').filter( ( item ) => {
                            return item.isActive === true;
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
            } else {
                this.isMessage   = true;
                this.pageMessage = 'Access-key missing or expired. Please login again.';
            }
            // Languages, for lookup:
            Meteor.call( 'getAllLang', ( error, result ) => {
                if( error ) {
                    this.isMessage   = true;
                    this.pageMessage = 'LanguageError: Retry.';
                } else if( result.code === 'success' ) {
                    this.isMessage   = false;
                    this.pageMessage = 'Items available';
                    this.langItems   = this.$lo.sortBy(result.value, 'langName').filter( ( item ) => {
                        return item.isActive === true;
                    } );
                } else {
                    this.isMessage   = true;
                    this.pageMessage = `${result.code}: ${result.value}`;
                }
            } );
        },
        updated() {
            document.getElementById( 'mcCodeList' ).DataTable();
        },
    }

</script>