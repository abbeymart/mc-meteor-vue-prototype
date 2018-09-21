<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-th-list"/> {{mcLabel.auditList}}</h4>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <table class="w3-table w3-striped w3-border w3-hoverable" id="mcAuditListCreate">
                <thead>
                <tr class="w3-red">
                    <th scope="col">{{mcLabel.coll}}</th>
                    <th scope="col">{{mcLabel.collValue}}</th>
                    <th scope="col">{{mcLabel.actionBy}}</th>
                    <th scope="col">{{mcLabel.update}}</th>
                    <th scope="col">{{mcLabel.delete}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in auditItems" :key="item._id" @click.prevent="updateItem(item)">
                    <td>{{item.collName}}</td>
                    <td>{{valueDetail(item.collValues)}}</td>
                    <td>{{userName(item.actionBy)}}</td>
                    <td>
                        <a id="editItem" href="#" @click.prevent="updateItem(item)">{{mcLabel.update}}
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

    export default {
        name      : 'auditListCreate',
        components: {},
        data() {
            return {
                mcLabel    : '',
                isMessage  : false,
                pageMessage: '',
                auditItems : [],
                langItems  : [],
                codeItems  : [],
                userItems  : [],
                itemParams : {},
                itemId     : '',
                currentItem: '',
                isAdmin    : false,
                isSave     : false,
            }
        },
        computed  : {},
        methods   : {
            valueDetail( itemValue ) {
                // convert object to list of items (key:value)
                let obj = itemValue;
                let arr = [];
                for( let key in obj ) {
                    if( obj.hasOwnProperty( key ) && key !== '_id' ) {
                        arr.push( key + '=' + obj[ key ] );
                    }
                }
                return arr.join( '\n' );
            },
            userName( userId ) {
                const userItem = this.$lo.find( this.userItems, { _id: userId } );
                return userItem ? `${userItem.username} | ${userItem.profile.firstName} ${userItem.profile.lastName}` : 'n/a';
            },
            catName( itemId ){
                const catName = this.$lo.find( this.codeItems, { _id: itemId } );
                return catName ? catName.codeName : 'n/a';
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
                Session.set( 'currentAuditItem', item );
                // Route to detail page
                this.$router.push( { name: 'auditDetail' } );
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
                        Meteor.call( 'removeAudit', itemId, userToken, ( error, result ) => {
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
            updateItems( items ) {
                // update multiple selected items

            },
            deleteItems( items ) {
                // delete multiple selected items

            }
        },
        created() {
            this.mcLabel = this.$label;
            // get the isAdmin status for the current user (set from the main Header)
            if( Session.get( "currentUser" ) ) {
                this.isAdmin = Session.get( "currentUser" ).isAdmin;
            }
            // Fetch items from the server, based on role assignment / authorization
            // Get current logged-in user's token, for resource access
            const userToken     = this.$auth.getToken(),
                  queryParams   = {},
                  currentItemId = '';
            // DDP || Meteor.method
            if( userToken ) {
                // services
                Meteor.call( 'getAudit', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'AuditError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.auditItems  = this.$lo.sortBy( result.value, 'collName' ).filter( ( item ) => {
                            return (item.actionType === 'Create');
                        } );
                    }
                    else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
                // languages
                Meteor.call( 'getLang', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'LanguageError: Retry.';
                    } else if( result.code === 'success'
                    ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.langItems   = this.$lo.sortBy( result.value, 'langName' ).filter( ( item ) => {
                            return item.isActive === true;
                        } );
                    }
                    else {
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
                        this.userItems   = this.$lo.sortBy( result.value, 'username' );
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
            document.getElementById( 'mcAuditListCreate' ).DataTable({
                destroy     : true,
                "pagingType": "full_numbers",
            });
        }
    }
</script>