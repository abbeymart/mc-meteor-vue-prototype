<template>
    <!--Display menu items for package-groups and packages, by servicePath/Id-->
    <div class="w3-container">
        <div class="w3-bar">
            <div v-for="group in packageGroups" :key="group.servicePath"
                 class="w3-bar-item w3-mobile w3-dropdown-hover">
                <a href="#">
                    <!--<i class="glyphicon glyphicon-briefcase" style="color: tomato"></i>-->
                    <span class="mcBoldLink">{{group.serviceName}}</span>
                    <span class="caret"/>
                </a>
                <div class="w3-dropdown-content w3-blue w3-bar-block w3-round-medium">
                    <!--Packages-->
                    <a class="w3-bar-item w3-button" v-for="item in packages(group)" :key="item.servicePath" href="#"
                       @click.prevent="packageRoute(item)">
                        {{item.serviceName}}
                    </a>
                </div>
            </div>
            <span v-if="isMessage">{{pageMessage}}</span>
        </div>
    </div>
</template>
<style>

</style>
<script>
    export default {
        name    : 'mcTopMenu',
        data() {
            return {
                prodPath       : this.$store.getters[ 'central/getProdPath' ],
                serviceItems   : this.$store.getters[ 'central/getServiceItems' ],
                mcSolution     : {},
                isMessage      : false,
                pageMessage    : '',
                itemParams     : {},
                itemId         : '',
            }
        },
        methods : {
            packages( group ) {
                // Retrieve active packages for for the current package-group, order by priority
                const pItems = this.$lo.filter( this.serviceItems,
                    {
                        parentId   : group._id,
                        serviceType: 'Package',
                        isActive   : true,
                    } );

                if( pItems.length > 0 ) {
                    return pItems.sort( ( a, b ) => {
                        return (parseInt( a.servicePriority ) - parseInt( b.servicePriority ));
                    } );
                }
                return [];
            },
            packageRoute( item ) {
                this.$router.push( { name: item.servicePath } );
            },
        },
        computed: {
            packageGroups() {
                // get the current solution packageGroups
                let itemPath = this.$store.getters[ 'central/getProdPath' ] || 'home';

                // set home side-bar menu to 'central', as default
                // TODO: remove as default when home page menu-items are setup
                if( itemPath === 'home' ) {
                    itemPath = 'central';
                }

                // re-check the serviceItems in the store
                this.serviceItems = this.$store.getters[ 'central/getServiceItems' ];

                // Get the solution item/record for the current solution tag / path
                this.mcSolution = this.serviceItems.find( item => {
                    return item.servicePath === itemPath && item.isActive === true;
                } );

                // Get active package group items, for the current solution (already sorted),
                let pGroups = [];
                if( this.mcSolution ) {
                    pGroups = this.serviceItems.filter( ( item ) => {
                        return (item.parentId === this.mcSolution._id && item.serviceType === 'Package Group' && item.isActive);
                    } );
                }

                // Return groupItems sorted by servicePriority
                return pGroups;
            },
        },
    }
</script>
