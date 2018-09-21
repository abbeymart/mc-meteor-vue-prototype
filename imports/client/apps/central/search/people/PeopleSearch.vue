<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-th-list"/> {{mcLabel.userList}}</h4>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <table class="w3-table w3-striped w3-border w3-hoverable" id="mcUserList">
                <thead>
                <tr class="w3-red">
                    <th scope="col">{{mcLabel.loginName}}</th>
                    <th scope="col">{{mcLabel.email}}</th>
                    <th scope="col">{{mcLabel.fullName}}</th>
                    <th scope="col">{{mcLabel.lang}}</th>
                    <th scope="col">{{mcLabel.isActive}}</th>
                    <th scope="col">{{mcLabel.detail}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in userItems">
                    <td>{{item.username}}</td>
                    <td>{{userEmail( item )}}</td>
                    <td>{{fullName( item )}}</td>
                    <td>{{langName( item.profile.userLang )}}</td>
                    <td>
                        <!--show/hide depending on active-state (Yes/No)-->
                        <span v-if="item.isActive">{{mcLabel.yes}}<i class="glyphicon glyphicon-check"/></span>
                        <span v-else>{{mcLabel.no}}<i class="glyphicon glyphicon-off"/></span>
                    </td>
                    <td>
                        <a id="updateItem" href="#" @click.prevent="updateItem(item)">
                            {{mcLabel.detail}}<i class="glyphicon glyphicon-edit"/>
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
    import { saveState, getState } from '/imports/lib/utils/stateManagement';
    import { Users } from '/imports/collections/Central';
    import _ from 'lodash';

    export default {
        name      : 'peopleSearch',
        components: {},
        data() {
            return {
                mcLabel    : '',
                isMessage  : false,
                pageMessage: '',
                userItems  : [],
                langItems  : [],
                itemParams : {},
                itemId     : '',
                itemsCount : 0,
            }
        },
        methods   : {
            fetchData(){
                // Get current logged-in user's token, for resource access
                const userToken     = this.$auth.getToken(),
                      currentItemId = '';

                let queryParams  = {},
                    searchText   = '',
                    searchParams = {};

                // extend queryParams for search action
                searchText = this.$store.getters[ 'central/getSearchCat' ];

                // Get users information (all for adminUser, ownRecord for others, or role-based)
                if( userToken ) {
                    // user(s)
                    Meteor.call( 'getUser', userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'UserError, Retry: ' + error;
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.userItems   = result.value;
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                    // languages
                    Meteor.call( 'getLang', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'LanguageError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.langItems   = result.value.filter( ( item ) => {
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
            },
            recordCount() {
                Meteor.call( 'collCount', 'Users', ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'CountError: Retry.';
                    } else {
                        this.itemsCount = result;
                    }
                } );
            },
            shortDesc ( item ) {
                // set the short description for item.desc
                return this.$utils.shortString( item, this.$constant.getShortDesc() );
            },
            updateItem( item ) {
                userBus.currentUserItem( item );
                // Set current item and ownerType for address, phone and contact information
                Session.set( {
                    currentUserItem : item,
                    currentOwnerId  : item._id,
                    currentOwnerType: 'User',
                } );
                // route to the user detail/profile page for update
                this.$router.push( { name: 'searchPeopleDetail' } );
            },
            updateItems( items ) {
                // update multiple selected items

            },
            deleteItem( item ) {
                // send current item Id to the local delete/remove method
                userBus.currentUserId( item._id );

            },
            deleteItems( items ) {
                // delete multiple selected items

            },
            userEmail( item ) {
                if( item.emails ) {
                    return item.emails[ '0' ].address || 'n/a';
                }
            },
            fullName( item ) {
                return `${item.profile.firstName} ${item.profile.lastName}`;
            },
            langName( code ) {
                const langName = _.find( this.langItems, { langCode: code } );
                return langName ? langName.langName : 'n/a';
            }
        },

        created() {
            this.mcLabel        = this.$label;
            // get records count
            this.recordCount();
            // Fetch items from the server, based on role assignment / authorization
            this.fetchData();
        },
        updated() {
            $( '#mcUserList' ).DataTable( {
                destroy     : true,
                "pagingType": "full_numbers"
            } );
        }
    }
</script>
