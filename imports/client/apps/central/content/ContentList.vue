<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-th-list"/> {{mcLabel.contentList}}</h4>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <table class="w3-table w3-striped w3-border w3-hoverable" id="mcContentList">
                <thead>
                <tr class="w3-red">
                    <th scope="col">{{mcLabel.cat}}</th>
                    <th scope="col">{{mcLabel.title}}</th>
                    <th scope="col">{{mcLabel.type}}</th>
                    <th scope="col">{{mcLabel.parent}}</th>
                    <th scope="col">{{mcLabel.lang}}</th>
                    <th scope="col">{{mcLabel.isActive}}</th>
                    <th scope="col">{{mcLabel.update}}</th>
                    <th scope="col">{{mcLabel.delete}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in contentItems" :key="item._id">
                    <td>{{item.contentCat}}</td>
                    <td>{{item.contentTitle}}</td>
                    <td>{{item.contentType}}</td>
                    <td>{{parentName(item.parentId)}}</td>
                    <td>{{langName(item.contentLang)}}</td>
                    <td>
                        <!--show/hide depending on active-state (Yes/No)-->
                        <span v-if="item.isActive">{{mcLabel.yes}}<i class="glyphicon glyphicon-check"/></span>
                        <span v-else>{{mcLabel.no}}<i class="glyphicon glyphicon-off"/></span>
                    </td>
                    <td>
                        <a id="editContentItem" href="#" @click.prevent="updateItem(item)">
                            {{mcLabel.update}}<i class="glyphicon glyphicon-edit"/>
                        </a>
                    </td>
                    <td>
                        <a id="removeContentItem" href="#" @click.prevent="deleteItem(item)">
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
    import {centralMixin} from "../../../include/mixins/centralMixin";

    export default {
        name      : 'contentList',
        components: {},
        mixins: [
          centralMixin
        ],
        data() {
            return {
                isMessage   : false,
                pageMessage : '',
                contentItems: [],
                itemParams  : {},
                itemId      : '',
                currentItem : '',
            }
        },
        methods   : {
            catName( itemId ){
                const catName = this.$lo.find( this.codeItems, { _id: itemId } );
                return catName ? catName.codeName : 'n/a';
            },
            typeName( itemId ){
                const typeName = this.$lo.find( this.codeItems, { _id: itemId } );
                return typeName ? typeName.codeName : 'n/a';
            },
            parentName( parentId ) {
                const parentName = this.$lo.find( this.contentItems, { _id: parentId } );
                return parentName ? parentName.contentTitle : 'n/a';
            },
            shortDesc ( item ) {
                // set the short description for item.desc
                return this.$utils.shortString( item, this.$constant.getShortDesc() );
            },
            langName( code ) {
                const langName = this.$lo.find( this.langItems, { langCode: code } );
                return langName ? langName.langName : 'n/a';

            },
            updateItem( item ) {
                // Set current item
                this.$store.dispatch('central/setContentItem', item);
                // Session.set( 'currentContentItem', item );
                // Route to detail page
                this.$router.push( { name: 'contentDetail' } );
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
                        Meteor.call( 'removeContent', item._id, userToken, ( error, result ) => {
                                if( error ) {
                                    this.isMessage   = true;
                                    this.pageMessage = `${error}: Error deleting item. Please retry`;
                                }
                                this.isMessage   = true;
                                this.pageMessage = `${result.code}: ${result.value}`;
                            }
                        )
                        ;
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
                // services
                Meteor.call( 'getContent', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'ContentError: Retry.';
                    } else if( result.code === 'success'
                    ) {
                        this.isMessage    = false;
                        this.pageMessage  = 'Items available';
                        this.contentItems = this.$lo.sortBy( result.value, 'contentTitle' );
                    }
                    else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
            } else {
                this.isMessage   = true;
                this.pageMessage = 'Access-key missing or expired. Please login again.';
            }
        },
        updated() {
            $( '#mcContentList' ).DataTable({
                destroy     : true,
                "pagingType": "full_numbers",
            });
        }
    }
</script>
