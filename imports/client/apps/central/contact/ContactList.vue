<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-th-list"/> {{mcLabel.contactList}}</h4>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <table class="w3-table w3-striped w3-border w3-hoverable" id="mcContactList">
                <thead>
                <tr class="w3-red">
                    <th scope="col">{{mcLabel.cat}}</th>
                    <th scope="col">{{mcLabel.name}}</th>
                    <th scope="col">{{mcLabel.address}}</th>
                    <th scope="col">{{mcLabel.phoneNumber}}</th>
                    <th scope="col">{{mcLabel.owner}}</th>
                    <th scope="col">{{mcLabel.lang}}</th>
                    <th scope="col">{{mcLabel.isActive}}</th>
                    <th scope="col">{{mcLabel.update}}</th>
                    <th scope="col">{{mcLabel.delete}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in contactItems" :key="item._id" @click.prevent="updateItem(item)">
                    <td>{{item.contactCat}}</td>
                    <td>{{item.contactFirstName}} {{item.contactLastName}}</td>
                    <td>{{item.contactAddress}}</td>
                    <td>{{item.contactPhone}}</td>
                    <td>{{ownerName( item.ownerId )}}</td>
                    <td>{{langName( item.contactLang )}}</td>
                    <td>
                        <!--show/hide depending on active-state (Yes/No)-->
                        <span v-if="item.isActive">{{mcLabel.yes}}<i class="glyphicon glyphicon-check"/></span>
                        <span v-else>{{mcLabel.no}}<i class="glyphicon glyphicon-off"/></span>
                    </td>
                    <td>
                        <a id="editContactItem" href="#" @click.prevent="updateItem(item)">
                            {{mcLabel.update}}<i class="glyphicon glyphicon-edit"/>
                        </a>
                    </td>
                    <td>
                        <a id="removeContactItem" href="#" @click.prevent="deleteItem(item)">
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
        name      : 'contactList',
        components: {},
        data() {
            return {
                mcLabel     : '',
                isMessage   : false,
                pageMessage : '',
                contactItems: [],
                langItems   : [],
                codeItems   : [],
                userItems   : [],
                orgItems    : [],
                itemParams  : {},
                itemId      : '',
                currentItem : ''
            }
        },
        methods   : {
            ownerName( itemId ) {
                if( Session.get( 'currentOwnerType' ) === 'User' ) {
                    const userItem = this.userItems.find((item) => {
                        return item._id === itemId;
                    });
                    return userItem? `${userItem.username} | ${userItem.profile.firstName} ${userItem.profile.lastName}` : 'n/a';
                }
                if( Session.get( 'currentOwnerType' ) === 'Organization' ) {
                    const orgItem = this.orgItems.find((item) => {
                        return item._id === itemId;
                    });
                    return orgItem? `${orgItem.orgName}` : 'n/a';
                }
            },
            langName( code ) {
                const langName = this.$lo.find( this.langItems, { langCode: code } );
                return langName ? langName.langName : 'n/a';
            },
            updateItem( item ) {
                // Set current item
                Session.set( 'currentContactItem', item );
                // route to currentOwnerType page
                if( Session.get( 'currentOwnerType' ) === 'User' ) {
                    this.$router.push( { name: 'userContactDetail' } );
                }
                if( Session.get( 'currentOwnerType' ) === 'Organization' ) {
                    this.$router.push( { name: 'orgContactDetail' } );
                }
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
                        Meteor.call( 'removeContact', item._id, userToken, ( error, result ) => {
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
                // contact items
                Meteor.call( 'getContact', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'ContactError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage    = false;
                        this.pageMessage  = 'Items available';
                        const ownerType   = Session.get( 'currentOwnerType' ) || '';
                        this.contactItems = this.$lo.sortBy( result.value, 'contactCat' ).filter( ( item ) => {
                            return item.ownerType === ownerType;
                        } );
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
                        this.langItems   = this.$lo.sortBy( result.value, 'langName' ).filter( ( item ) => {
                            return item.isActive === true;
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
                // get standard code items
                Meteor.call( 'getCode', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'CodeError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.codeItems   = this.$lo.sortBy( result.value, 'codeName' ).filter( ( item ) => {
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
                        this.userItems   = result.value;
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
                // organizations
                Meteor.call( 'getOrg', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'OrganizationError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.orgItems    = this.$lo.sortBy( result.value, 'orgName' );
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
            document.getElementById( 'mcContactList' ).DataTable( {
                destroy     : true,
                "pagingType": "full_numbers",
            } );
        }
    }
</script>
