<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-th-list"/> {{mcLabel.serviceList}}</h4>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <table class="w3-table w3-striped w3-border w3-hoverable" id="mcServiceList">
                <thead>
                <tr class="w3-red">
                    <th scope="col">{{mcLabel.name}}</th>
                    <th scope="col">{{mcLabel.desc}}</th>
                    <th scope="col">{{mcLabel.cost}}</th>
                    <th scope="col">{{mcLabel.type}}</th>
                    <th scope="col">{{mcLabel.parent}}</th>
                    <th scope="col">{{mcLabel.lang}}</th>
                    <th scope="col">{{mcLabel.isActive}}</th>
                    <th scope="col">{{mcLabel.update}}</th>
                    <th scope="col">{{mcLabel.delete}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in serviceItems" :key="item._id">
                    <td>{{item.serviceName}}</td>
                    <td>{{shortDesc( item.serviceDesc )}}</td>
                    <td>{{item.serviceCost}}</td>
                    <td>{{item.serviceType}}</td>
                    <td>{{parentName( item.parentId )}}</td>
                    <td>{{langName( item.serviceLang )}}</td>
                    <td>
                        <!--show/hide depending on active-state (Yes/No)-->
                        <span v-if="item.isActive">{{mcLabel.yes}}<i class="glyphicon glyphicon-check"/></span>
                        <span v-else>{{mcLabel.no}}<i class="glyphicon glyphicon-off"/></span>
                    </td>
                    <td>
                        <a id="editServiceItem" href="#" @click.prevent="updateItem(item)">
                            {{mcLabel.update}}<i class="glyphicon glyphicon-edit"/>
                        </a>
                    </td>
                    <td>
                        <a id="removeServiceItem" href="#" @click.prevent="deleteItem(item)">
                            {{mcLabel.delete}}<i class="glyphicon glyphicon-remove-circle"/>
                        </a>
                    </td>
                </tr>
                </tbody>
            </table>
            <table class="w3-table w3-striped w3-border w3-hoverable" id="serviceList"></table>
        </div>
    </div>
</template>
<style>

</style>
<script>
    import { Meteor } from 'meteor/meteor';
    import { Tracker } from 'meteor/tracker';
    import { Services } from '/imports/collections/Central';
    import _ from 'lodash';

    export default {
        name      : 'serviceSearch',
        components: {},
        data() {
            return {
                mcLabel     : '',
                isMessage   : false,
                pageMessage : '',
                serviceItems: [],
                searchItems : [],
                langItems   : [],
                itemParams  : {},
                itemId      : '',
                currentItem : '',
                skip        : 0,
                limit       : 5,
                serviceSub  : '',
                itemsCount  : 0,
                testItems   : [],
                sKey        : '',
                sCat        : '',
            }
        },
        computed  : {
            itemsList() {
                if( this.serviceSub ) {
                    this.searchItems = Services.find( {}, { sort: { serviceName: 1 } } ).fetch();
                    return Services.find( {}, { sort: { serviceName: 1 } } ).fetch();
                }
            },
            textItems() {
                if( this.serviceSub ) {
                    return Services.find( { $text: { $search: Session.get( 'mcSearchKey' ) } } ).fetch();
                }
            },
        },
        methods   : {
            fetchData() {
                // Fetch items from the server, based on role assignment / authorization
                // Get current logged-in user's token, for resource access
                const userToken     = this.$auth.getToken(),
                      currentItemId = '';

                let queryParams  = {},
                    searchText   = '',
                    searchParams = {};

                // extend queryParams for search action
                if( Session.get( 'mcSearchCat' ) === 'Services' && Session.get( 'mcSearchKey' ) ) {
                    searchText = Session.get( 'mcSearchKey' );
                }
                // DDP || Meteor.method >> Initial data query/load
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
                    if( searchText ) {
                        // services-text-search
                        Meteor.call( 'getServiceText', searchText, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = 'ServiceError: Retry.';
                            } else if( result.code === 'success' ) {
                                this.isMessage    = false;
                                this.pageMessage  = 'Items available';
                                this.serviceItems = _.sortBy( result.value, 'serviceName' );
                            } else {
                                this.isMessage   = true;
                                this.pageMessage = `${result.code}: ${result.value}`;
                            }
                        } );
                    } else {
                        // services
                        Meteor.call( 'getService', searchParams, currentItemId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = 'ServiceError: Retry.';
                            } else if( result.code === 'success' ) {
                                this.isMessage    = false;
                                this.pageMessage  = 'Items available';
                                this.serviceItems = _.sortBy( result.value, 'serviceName' );
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
                Meteor.call( 'collCount', 'Services', ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'CountError: Retry.';
                    } else {
                        this.itemsCount = result;
                    }
                } );
            },
            parentName( parentId ) {
                // TODO: compute from the server-side (e.g graphQL)??
                const parentName = _.find( this.serviceItems, { _id: parentId } );
                return parentName ? parentName.serviceName : 'n/a';
            },
            shortDesc ( item ) {
                // set the short description for item.desc
                return this.$utils.shortString( item, this.$constant.getShortDesc() );
            },
            langName( code ) {
                const langName = _.find( this.langItems, { langCode: code } );
                return langName ? langName.langName : 'n/a';
            },
            newItem() {
                Session.set( 'currentServiceItem', '' );
                // Route to detail page
                this.$router.push( { name: 'serviceDetail' } );
            },
            updateItem( item ) {
                // Set current item
                Session.set( 'currentServiceItem', item );
                // Route to detail page
                this.$router.push( { name: 'serviceDetail' } );
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
                        Meteor.call( 'removeService', item._id, userToken, ( error, result ) => {
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

            // Subscriptions
            const userToken     = this.$auth.getToken(),
                  currentItemId = '';

            let searchParams = {};

            // extend queryParams for search action
            if( Session.get( 'mcSearchCat' ) === 'Services' && Session.get( 'mcSearchKey' ) ) {
                searchParams = _.extend( searchParams, {
                    serviceName: Session.get( 'mcSearchKey' ),
                } );
            }

            // subscriptions (initial records query)
            // params: queryParams, currentItemId, userToken, skip & limit (change / set from datatable)
            this.skip  = 0;               // initial records fetch-starting-point
            this.limit = this.$constant.getQueryLimit();      // initial records limit
            // Subscribe to the published collection
            if( this.serviceSub ) {
                this.serviceSub.stop();
                this.serviceSub = Meteor.subscribe( 'serviceAll', searchParams, currentItemId, userToken, this.skip, this.limit );
            } else {
                this.serviceSub = Meteor.subscribe( 'serviceAll', searchParams, currentItemId, userToken, this.skip, this.limit );
            }
        },
        updated() {
            $( '#mcServiceList' ).DataTable( {
                destroy     : true,
                "pagingType": "full_numbers"
            } );

//            if (this.searchItems) {
//                console.log(this.searchItems);
//                $( '#mcServiceList' ).DataTable( {
//                    destroy     : true,
//                    "pagingType": "full_numbers"
//                } );
//            }

//            $( '#mcServiceList' ).on( 'page.dt', () => {
//                const info = table.page.info();
//                if( info ) {
//                    // get by a method call from created() lifecycle
//                    const queryTotal = this.itemsCount,
//                          queryLimit = this.$constant.getQueryLimit(),
//                          tableTotal = info.recordsTotal,
//                          pageNum    = info.page + 1,
//                          pageLength = info.length;
//
//                    // next batch / incremental query
//                    if( ((pageNum * pageLength) >= queryLimit) && (tableTotal < queryTotal) ) {
//                        this.skip  = tableTotal;
//                        this.limit = queryLimit;
//                        console.log( this.skip, this.limit );
//                        // Subscribe to the published collection
//                        if( this.serviceSubReady ) {
//                            this.serviceSubReady.stop();
//                            this.serviceSubReady = Meteor.subscribe( 'serviceAll', queryParams, currentItemId, userToken, this.skip, this.limit );
//                            console.log( 'update section sub-next1' );
//                        } else {
//                            this.serviceSubReady = Meteor.subscribe( 'serviceAll', queryParams, currentItemId, userToken, this.skip, this.limit );
//                            console.log( 'update section sub-next2' );
//                        }
//                        // re-draw table
//                        if( this.serviceSubReady ) {
//                            $( '#mcServiceList' ).hide().show( 0 );
//                        }
//                    } else {
//                        this.skip  = 0;
//                        this.limit = queryLimit;
//                        console.log( this.skip, this.limit );
//                        if( this.serviceSubReady ) {
//                            this.serviceSubReady.stop();
//                            this.serviceSubReady = Meteor.subscribe( 'serviceAll', queryParams, currentItemId, userToken, this.skip, this.limit );
//                            console.log( 'update section sub-initial1' );
//                        } else {
//                            this.serviceSubReady = Meteor.subscribe( 'serviceAll', queryParams, currentItemId, userToken, this.skip, this.limit );
//                            console.log( 'update section sub-initial2' );
//                        }
//                    }
//                }
//            } );

        },
    }
</script>
