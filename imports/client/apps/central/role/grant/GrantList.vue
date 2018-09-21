<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-th-list"/> {{mcLabel.grantList}}</h4>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <table class="w3-table w3-striped w3-border w3-hoverable" id="mcGrantList">
                <thead>
                <tr class="w3-red">
                    <th scope="col">{{mcLabel.role}}</th>
                    <th scope="col">{{mcLabel.user}}</th>
                    <th scope="col">{{mcLabel.desc}}</th>
                    <th scope="col">{{mcLabel.isActive}}</th>
                    <th scope="col">{{mcLabel.update}}</th>
                    <th scope="col">{{mcLabel.delete}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in grantItems" :key="item._id" @click.prevent="updateItem(item)">
                    <td>{{roleName(item.grantRole)}}</td>
                    <td>{{userName(item.grantUser)}}</td>
                    <td>{{shortDesc(item.grantDesc)}}</td>
                    <td>
                        <!--show/hide depending on active-state (Yes/No)-->
                        <span v-if="item.isActive">{{mcLabel.yes}}<i class="glyphicon glyphicon-check"/></span>
                        <span v-else>{{mcLabel.no}}<i class="glyphicon glyphicon-off"/></span>
                    </td>
                    <td>
                        <a id="editGrantItem" href="#" @click.prevent="updateItem(item)">
                            {{mcLabel.update}}<i class="glyphicon glyphicon-edit"/>
                        </a>
                    </td>
                    <td>
                        <a id="removeGrantItem" href="#" @click.prevent="deleteItem(item)">
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
    import _ from 'lodash';

    export default {
        name      : 'grantList',
        components: {},
        data() {
            return {
                mcLabel    : '',
                isMessage  : false,
                pageMessage: '',
                grantItems : [],
                roleItems  : [],
                userItems  : [],
                itemParams : {},
                itemId     : '',
            }
        },
        methods   : {
            shortDesc ( item ) {
                // set the short description for item.desc
                return this.$utils.shortString( item, this.$constant.getShortDesc() );
            },
            roleName(roleId) {
                const roleItem = _.find( this.roleItems, { _id: roleId } );
                return roleItem ? roleItem.codeName : 'n/a';
            },
            userName(userId) {
                const userItem = _.find(this.userItems, {_id: userId});
                return userItem ? `${userItem.username} | ${userItem.profile.firstName} ${userItem.profile.lastName}` : 'n/a';
            },
            newItem() {
                Session.set( 'currentGrantItem', '' );
                // Route to detail page
                this.$router.push( { name: 'grantDetail' } );
            },
            updateItem( item ) {
                // Set current item
                Session.set( 'currentGrantItem', item );
                // Route to detail page
                this.$router.push( { name: 'grantDetail' } );
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
                        Meteor.call( 'removeGrant', item._id, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error deleting item. Please retry`;
                            } else {
                                this.isMessage   = true;
                                this.pageMessage = `${result.code}: ${result.value}`;
                            }
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
                // grants
                Meteor.call( 'getGrant', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'LabelError: Retry.';
                    } else if( result.code === 'success') {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.grantItems  = result.value;
                    }
                    else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
                // roles
                Meteor.call( 'getCode', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'RoleError: Retry.';
                    } else if( result.code === 'success'
                    ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.roleItems   = _.sortBy( result.value, 'codeName' );
                    }
                    else {
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
            } else {
                this.isMessage   = true;
                this.pageMessage = 'Access-key missing or expired. Please login again.';
            }
        },
        updated() {
            $( '#mcGrantList' ).DataTable({
                destroy     : true,
                "pagingType": "full_numbers",
            });
        }
    }
</script>