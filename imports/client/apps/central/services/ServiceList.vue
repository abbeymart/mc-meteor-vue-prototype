<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-th-list"/> {{mcLabel.serviceList}}</h4>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <table v-if="serviceSub.ready" class="w3-table w3-striped w3-border w3-hoverable" id="mcServiceList">
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
                <!--TODO: Resolve the computed subscription-items not displaying until clicked-->
                <tr v-for="item in serviceItems" :key="item._id" @click.prevent="updateItem(item)">
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
    import {centralMixin} from "../../../include/mixins/centralMixin";

    export default {
        name      : 'serviceList',
        components: {},
        mixins: [
          centralMixin,
        ],
        data() {
            return {
                isMessage   : false,
                pageMessage : '',
                serviceItems: [],
                serveItems  : [],
                itemParams  : {},
                itemId      : '',
                currentItem : '',
                skip        : 0,
                limit       : 1000,
                serviceSub  : '',
                itemsCount  : '',
                testItems   : [],
            }
        },
        computed  : {
            itemsList() {
                // get items via subscription-point
                this.serveItems = Services.find( {}, { sort: { serviceName: 1 } } ).fetch();
                this.testItems  = this.$store.getters[ 'central/getServiceItems' ];
                return this.serveItems;

            },
        },
        methods   : {
            fetchData() {
                // get records count
                Meteor.call( 'collCount', 'Services', ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'CountError: Retry.';
                    } else {
                        this.itemsCount = result;
                    }
                } );
                // Fetch items from the server, based on role assignment / authorization
                // Get current logged-in user's token, for resource access
                const userToken     = this.$auth.getToken(),
                      queryParams   = {},
                      currentItemId = '';

                // subscriptions (initial records query)
                // params: queryParams, currentItemId, userToken, skip & limit (change / set from datatable)
                this.skip  = 0;               // initial records fetch-starting-point
                this.limit = this.$constant.getQueryLimit();      // initial records limit
                // Subscribe to the published collection
                Tracker.autorun( () => {
                    this.serviceSub = Meteor.subscribe( 'serviceAll', queryParams, currentItemId, userToken, this.skip, this.limit );
                } );

                // DDP || Meteor.method >> Initial data query/load
                if( userToken ) {
                    // services
                    Meteor.call( 'getService', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'ServiceError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage    = false;
                            this.pageMessage  = 'Items available';
                            this.serviceItems = this.$lo.sortBy( result.value, 'serviceName' );
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
            setItems() {
                const services = Services.find( {}, { sort: { serviceName: 1 } } ).fetch();
                this.$store.dispatch( 'central/setServiceItems', services );
            },
            parentName( parentId ) {
                // TODO: compute from the server-side (e.g graphQL)??
                const parentName = this.$lo.find( this.serviceItems, { _id: parentId } );
                return parentName ? parentName.serviceName : 'n/a';
            },
            shortDesc( item ) {
                // set the short description for item.desc
                return this.$utils.shortString( item, this.$constant.getShortDesc() );
            },
            langName( code ) {
                const langName = this.$lo.find( this.langItems, { langCode: code } );
                return langName ? langName.langName : 'n/a';

            },
            newItem() {
                this.$store.dispatch( 'central/setServiceItem', '' );
                // Route to detail page
                this.$router.push( { name: 'serviceDetail' } );
            },
            updateItem( item ) {
                // Set current item
                this.$store.dispatch( 'central/setServiceItem', item );
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
            // get data / information (& get records count)
            this.fetchData();
        },
        beforeMount() {
            this.setItems();
        },
        updated() {
            $( '#mcServiceList' ).DataTable( {
                destroy     : true,
                "pagingType": "full_numbers",
            } );

            // $( '#mcServiceList' ).on( 'page.dt', () => {
            //     const info = table.page.info();
            //     if( info ) {
            //         // get by a method call from created() lifecycle
            //         const queryTotal = this.itemsCount,
            //               queryLimit = this.$constant.getQueryLimit(),
            //               tableTotal = info.recordsTotal,
            //               pageNum    = info.page + 1,
            //               pageLength = info.length;
            //
            //         // next batch / incremental query
            //         if( ((pageNum * pageLength) >= queryLimit) && (tableTotal < queryTotal) ) {
            //             this.skip  = tableTotal;
            //             this.limit = queryLimit;
            //             console.log( this.skip, this.limit );
            //             // Subscribe to the published collection
            //             if( this.serviceSub ) {
            //                 this.serviceSub.stop();
            //                 this.serviceSub = Meteor.subscribe( 'serviceAll', queryParams, currentItemId, userToken, this.skip, this.limit );
            //                 console.log( 'update section sub-next1' );
            //             } else {
            //                 this.serviceSub = Meteor.subscribe( 'serviceAll', queryParams, currentItemId, userToken, this.skip, this.limit );
            //                 console.log( 'update section sub-next2' );
            //             }
            //             // re-draw table
            //             if( this.serviceSub ) {
            //                 document.getElementById( 'mcServiceList' ).hide().show( 0 );
            //             }
            //         } else {
            //             this.skip  = 0;
            //             this.limit = queryLimit;
            //             console.log( this.skip, this.limit );
            //             if( this.serviceSub ) {
            //                 this.serviceSub.stop();
            //                 this.serviceSub = Meteor.subscribe( 'serviceAll', queryParams, currentItemId, userToken, this.skip, this.limit );
            //                 console.log( 'update section sub-initial1' );
            //             } else {
            //                 this.serviceSub = Meteor.subscribe( 'serviceAll', queryParams, currentItemId, userToken, this.skip, this.limit );
            //                 console.log( 'update section sub-initial2' );
            //             }
            //         }
            //     }
            // } );

            // TODO: re-draw table on limit change

//            $( '#serviceList' ).DataTable( {
//                destroy     : true,
//                "pagingType": "full_numbers",
//                data        : this.servItems,
//                columns     : [
//                    { data: 'serviceName', title: 'Name' },
//                    { data: 'serviceDesc', title: 'Description' },
//                    { data: 'serviceCost', title: 'Cost' },
//                    { data: 'serviceType', title: 'Type' },
//                    { data: 'isActive', title: 'isActive' },
//                    { title: "Update" },
//                    { title: "Delete" },
//                ]
//            } );
        },
    }
</script>
