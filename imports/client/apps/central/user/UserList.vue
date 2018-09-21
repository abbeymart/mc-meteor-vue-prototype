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
                    <th scope="col">{{mcLabel.update}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in userItems" :key="item._id" @click.prevent="updateItem(item)">
                    <td>{{item.username}}</td>
                    <td>{{userEmail(item)}}</td>
                    <td>{{fullName(item)}}</td>
                    <td>{{langName(item.profile.userLang)}}</td>
                    <td>
                        <!--show/hide depending on active-state (Yes/No)-->
                        <span v-if="item.isActive">{{mcLabel.yes}}<i class="glyphicon glyphicon-check"/></span>
                        <span v-else>{{mcLabel.no}}<i class="glyphicon glyphicon-off"/></span>
                    </td>
                    <td>
                        <a id="updateItem" href="#" @click.prevent="updateItem(item)">
                            {{mcLabel.update}}<i class="glyphicon glyphicon-edit"/>
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

    export default {
        name      : 'userList',
        components: {},
        data() {
            return {
                mcLabel    : '',
                isMessage  : false,
                pageMessage: '',
                userItems  : [],
                langItems  : [],
                itemParams : {},
                itemId     : ''
            }
        },
        methods   : {
            fetchData(){
                // Get current logged-in user's token, for resource access
                const userToken     = this.$auth.getToken(),
                      queryParams   = {},
                      currentItemId = '';
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
                    this.pageMessage = this.$message.accessKeyMissing;
                }
            },
            shortDesc ( item ) {
                // set the short description for item.desc
                return this.$utils.shortString( item, this.$constant.getShortDesc() );
            },
            updateItem( item ) {
                // Set current item and ownerType for address, phone and contact information
                this.$store.dispatch( 'central/setUserItem', item );
                this.$store.dispatch( 'central/setOwnerId', {id: item._id} );
                this.$store.dispatch( 'central/setOwnerType', {type: 'User'} );
                // route to the user detail/profile page for update
                this.$router.push( { name: 'userDetail' } );
            },
            updateItems( items ) {
                // update multiple selected items
            },
            deleteItem( item ) {
                // send current item Id to the local delete/remove method
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
                const langName = this.$lo.find( this.langItems, { langCode: code } );
                return langName ? langName.langName : 'n/a';
            }
        },

        created() {
            this.mcLabel        = this.$label;
            // fetch/get data
            this.fetchData();
        },
        updated() {
            $( '#mcUserList' ).DataTable({
                destroy     : true,
                "pagingType": "full_numbers"
            });
        }
    }
</script>
