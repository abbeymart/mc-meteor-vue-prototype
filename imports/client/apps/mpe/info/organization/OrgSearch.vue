<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-th-list"/> {{mcLabel.orgList}}</h4>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <table class="w3-table w3-striped w3-border w3-hoverable" id="mcOrgList">
                <thead>
                <tr class="w3-red">
                    <th scope="col">{{mcLabel.orgNumber}}</th>
                    <th scope="col">{{mcLabel.orgName}}</th>
                    <th scope="col">{{mcLabel.type}}</th>
                    <th scope="col">{{mcLabel.orgIndustry}}</th>
                    <th scope="col">{{mcLabel.location}}</th>
                    <th scope="col">{{mcLabel.lang}}</th>
                    <th scope="col">{{mcLabel.isActive}}</th>
                    <th scope="col">{{mcLabel.update}}</th>
                    <th scope="col">{{mcLabel.delete}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in orgItems" :key="item._id">
                    <td>{{item.orgNumber}}</td>
                    <td>{{item.orgName}}</td>
                    <td>{{itemName( item.orgType )}}</td>
                    <td>{{itemName( item.orgIndustry )}}</td>
                    <td>{{item.orgLocation}}</td>
                    <td>{{langName( item.orgLang )}}</td>
                    <td>
                        <!--show/hide depending on active-state (Yes/No)-->
                        <span v-if="item.isActive">{{mcLabel.yes}}<i class="glyphicon glyphicon-check"/></span>
                        <span v-else>{{mcLabel.no}}<i class="glyphicon glyphicon-off"/></span>
                    </td>
                    <td>
                        <a id="editOrgItem" href="#" @click.prevent="updateItem(item)">
                            {{mcLabel.update}}<i class="glyphicon glyphicon-edit"/>
                        </a>
                    </td>
                    <td>
                        <a id="removeOrgItem" href="#" @click.prevent="deleteItem(item)">
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
    import _ from 'lodash';

    export default {
        name      : 'orgSearch',
        components: {},
        data() {
            return {
                mcLabel    : '',
                isMessage  : false,
                pageMessage: '',
                orgItems   : [],
                langItems  : [],
                codeItems  : [],
                itemParams : {},
                itemId     : '',
                currentItem: '',
                itemsCount : 0,
            }
        },
        methods   : {
            fetchData(){
                // Fetch items from the server, based on role assignment / authorization
                // Get current logged-in user's token, for resource access
                const userToken     = this.$auth.getToken(),
                      currentItemId = '';

                let queryParams  = {},
                    searchText   = '',
                    searchParams = {};

                // extend queryParams for search action
                if( Session.get( 'mcSearchCat' ) === 'Services' && Session.get( 'mcSearchKey' ) ) {
                    searchText   = Session.get( 'mcSearchKey' );
                }
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
                    // get standard code items
                    Meteor.call( 'getCode', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'CodeError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.codeItems   = _.sortBy( result.value, 'codeName' ).filter( ( item ) => {
                                return item.isActive === true;
                            } );
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                    if( searchText ) {
                        // products-text-search
                        Meteor.call( 'getOrgText', searchText, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = 'OrgError: Retry.';
                            } else if( result.code === 'success' ) {
                                this.isMessage   = false;
                                this.pageMessage = 'Items available';
                                this.orgItems    = _.sortBy( result.value, 'orgName' );
                            } else {
                                this.isMessage   = true;
                                this.pageMessage = `${result.code}: ${result.value}`;
                            }
                        } );
                    } else {
                        // organizations
                        Meteor.call( 'getOrg', searchParams, currentItemId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = 'OrgError: Retry.';
                            } else if( result.code === 'success' ) {
                                this.isMessage   = false;
                                this.pageMessage = 'Items available';
                                this.orgItems    = _.sortBy( result.value, 'orgName' );
                            } else {
                                this.isMessage   = true;
                                this.pageMessage = `${result.code}: ${result.value}`;
                            }
                        } );
                    }
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Access-key missing or expired. Please login again.';
                }

            },
            recordCount() {
                Meteor.call( 'collCount', 'Organizations', ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'CountError: Retry.';
                    } else {
                        this.itemsCount = result;
                    }
                } );
            },
            parentName( parentId ) {
                const parentName = _.find( this.locationItems, { _id: parentId } );
                return parentName ? parentName.locationName : 'n/a';
            },
            shortDesc ( item ) {
                // set the short description for item.desc
                return this.$utils.shortString( item, this.$constant.getShortDesc() );
            },
            langName( code ) {
                const langName = _.find( this.langItems, { langCode: code } );
                return langName ? langName.langName : 'n/a';
            },
            itemName( itemId ){
                const item = _.find( this.codeItems, { _id: itemId } );
                return item ? item.codeName : 'n/a';
            },
            industryName( itemId ){
                const itemName = _.find( this.codeItems, { _id: itemId } );
                return itemName ? itemName.codeName : 'n/a';
            },
            newItem() {
                Session.set( 'currentOrgItem', '' );
                // Route to detail page
                this.$router.push( { name: 'organizationDetail' } );
            },
            updateItem( item ) {
                // Set current item and ownerType for address, phone and contact information
                Session.set( {
                    currentOrgItem  : item,
                    currentOwnerId  : item._id,
                    currentOwnerType: 'Organization',
                } );

                // Route to detail page
                this.$router.push( { name: 'organizationDetail' } );
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
                        Meteor.call( 'removeOrg', item._id, userToken, ( error, result ) => {
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
            // get records count
            this.recordCount();
            // Fetch items from the server, based on role assignment / authorization
            this.fetchData();
        },
        updated() {
            $( '#mcOrgList' ).DataTable( {
                destroy     : true,
                "pagingType": "full_numbers",
            } );
        }
    }
</script>