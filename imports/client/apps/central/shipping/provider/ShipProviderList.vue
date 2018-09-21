<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-th-list"/> {{mcLabel.shipProviderList}}</h4>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <table class="w3-table w3-striped w3-border w3-hoverable" id="mcShipProviderList">
                <thead>
                <tr class="w3-red">
                    <th scope="col">{{mcLabel.provider}}</th>
                    <th scope="col">{{mcLabel.type}}</th>
                    <th scope="col">{{mcLabel.env}}</th>
                    <th scope="col">{{mcLabel.location}}</th>
                    <th scope="col">{{mcLabel.lang}}</th>
                    <th scope="col">{{mcLabel.update}}</th>
                    <th scope="col">{{mcLabel.delete}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in shipProviderItems" :key="item._id" @click.prevent="updateItem(item)">
                    <td>{{item.shipProvider}}</td>
                    <td>{{item.shipType}}</td>
                    <td>{{item.shipEnv}}</td>
                    <td>{{item.shipLocation}}</td>
                    <td>{{item.shipLocale}}</td>
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
    import { mcMessage } from '/imports/lib/locales/getMessage';

    export default {
        name      : 'shipProviderList',
        components: {},
        data() {
            return {
                mcLabel          : '',
                isMessage        : false,
                pageMessage      : '',
                shipProviderItems: [],
                itemParams       : {},
                itemId           : '',
                currentItem      : '',
                isAdmin          : false,
                isSave           : false,
            }
        },
        computed  : {},
        methods   : {
            shortDesc ( item ) {
                // set the short description for item.desc
                return this.$utils.shortString( item, this.$constant.getShortDesc() );
            },
            updateItem( item ) {
                // Set current item
                this.$store.dispatch('central/setShipProviderItem', item);
                // Route to detail page
                this.$router.push( { name: 'shipProviderDetail' } );
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
                        Meteor.call( 'removeShipProvider', itemId, userToken, ( error, result ) => {
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
            // Fetch items from the server, based on role assignment / authorization
            // Get current logged-in user's token, for resource access
            const userToken     = this.$auth.getToken(),
                  queryParams   = {},
                  currentItemId = '';
            // DDP || Meteor.method
            if( userToken ) {
                // providers
                Meteor.call( 'getShipProvider', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'ShipProviderError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage         = false;
                        this.pageMessage       = 'Items available';
                        this.shipProviderItems = this.$lo.sortBy( result.value, 'shipProvider' );
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
                // locations
                Meteor.call( 'getLocation', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'LocationError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage     = false;
                        this.pageMessage   = 'Items available';
                        this.locationItems = this.$lo.sortBy( result.value, 'locationName' ).filter( ( item ) => {
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
        updated() {
            $( '#mcShipProviderList' ).DataTable({
                destroy     : true,
                "pagingType": "full_numbers",
            });
        }
    }
</script>
