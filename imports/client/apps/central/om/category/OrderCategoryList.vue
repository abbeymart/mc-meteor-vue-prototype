<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-th-list"/> {{mcLabel.catList}}</h4>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <table class="w3-table w3-striped w3-border w3-hoverable" id="mcOrderCatList">
                <thead>
                <tr class="w3-red">
                    <th scope="col">{{mcLabel.name}}</th>
                    <th scope="col">{{mcLabel.group}}</th>
                    <th scope="col">{{mcLabel.owner}}</th>
                    <th scope="col">{{mcLabel.desc}}</th>
                    <th scope="col">{{mcLabel.lang}}</th>
                    <th scope="col">{{mcLabel.update}}</th>
                    <th scope="col">{{mcLabel.delete}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in orderCatItems" :key="item._id">
                    <td>{{item.catName}}</td>
                    <td>{{item.catGroup}}</td>
                    <td>{{userName(item.catOwner)}}</td>
                    <td>{{shortDesc(item.catDesc)}}</td>
                    <td>{{langName(item.catLang)}}</td>
                    <td>
                        <a id="editItem" href="#" @click.prevent="updateItem(item)">{{mcLabel.detail}}
                            <i class="glyphicon glyphicon-edit"/>
                        </a>
                    </td>
                    <td>
                        <a id="deleteItem" href="#" @click.prevent="deleteItem(item)">
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
    import { mcMessage } from '/imports/lib/locales/getMessage';
    import _ from 'lodash';

    export default {
        name      : 'orderCatList',
        components: {},
        data() {
            return {
                mcLabel      : '',
                isMessage    : false,
                pageMessage  : '',
                orderCatItems: [],
                langItems    : [],
                userItems    : [],
                itemParams   : {},
                itemId       : '',
                currentItem  : '',
                isAdmin      : false,
                isSave       : false,
            }
        },
        computed  : {},
        methods   : {
            shortDesc ( item ) {
                // set the short description for item.desc
                return this.$utils.shortString( item, this.$constant.getShortDesc() );
            },
            langName( code ) {
                const langItem = _.find( this.langItems, { langCode: code } );
                return langItem ? langItem.langName : 'n/a';

            },
            userName( userId ) {
                const currentUser = this.userItems.find( ( item ) => {
                    return item._id === userId;
                } );
                return `${currentUser.username} | ${currentUser.profile.firstName} ${currentUser.profile.lastName}` || 'n/a';
            },
            updateItem( item ) {
                // Set current item
                Session.set( 'currentOrderCatItem', item );
                // Route to detail page
                this.$router.push( { name: 'orderCatDetail' } );
            },
            deleteItem( item ) {
                const userToken = this.$auth.getToken();
                if( confirm( this.$message.confirmDelete ) ) {
                    const itemId = item._id;
                    if( !itemId ) {
                        this.isMessage   = false;
                        this.pageMessage = mcMessage.itemMissing;
                    }
                    // Meteor method
                    if( userToken ) {
                        Meteor.call( 'removeOrderCat', itemId, userToken, ( error, result ) => {
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
            updateItems( items ) {
                // update multiple selected items

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
                // languages
                Meteor.call( 'getLang', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'LanguageError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.langItems   = _.sortBy( result.value, 'langName' ).filter( ( item ) => {
                            return item.isActive === true;
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
                // user(s)
                Meteor.call( 'getUser', userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'UserError, Retry: ' + error;
                    } else if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.userItems   = _.sortBy( result.value, 'username' );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
                // order categories
                Meteor.call( 'getOrderCat', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'OrderCategoryError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage     = false;
                        this.pageMessage   = 'Items available';
                        this.orderCatItems = _.sortBy( result.value, 'catName' );
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
        updated() {
            $( '#mcOrderCatList' ).DataTable({
                destroy     : true,
                "pagingType": "full_numbers",
            });
        }
    }
</script>
