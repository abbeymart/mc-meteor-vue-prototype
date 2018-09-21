<template>
    <!--Display menu items for package-groups and packages, by servicePath/Id-->
    <div>
        <div class="w3-bar-block w3-white">
            <div v-for="group in packageGroups" :key="group.servicePath"
                 class="w3-bar-item w3-light-grey w3-dropdown-hover">
                <a href="#">{{group.serviceName}} <span class="caret w3-right"/></a>
                <div class="w3-dropdown-content w3-bar-block w3-light-grey w3-margin-8 w3-round-medium">
                    <!--Packages-->
                    <a class="w3-bar-item w3-button w3-hover-green w3-margin-8" v-for="item in packages(group)"
                       :key="item.servicePath" href="#" @click.prevent="packageRoute(item)">
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
        name    : 'mcSideMenu',
        data() {
            return {
                serviceItems   : this.$store.getters[ 'central/getServiceItems' ],
                prodPath       : this.$store.getters[ 'central/getProdPath' ] || 'home',
                mcSolution     : {},
                mcPackageGroups: [],
                mcPackages     : [],
                isMessage      : false,
                pageMessage    : '',
                itemParams     : {},
                itemId         : '',
            }
        },
        computed: {
            packageGroups() {
                // Retrieve active package-groups for the current servicePath, order by priority
                let itemPath = this.$store.getters[ 'central/getProdPath' ] || 'home';

                // set home side-bar menu to 'central', as default
                // TODO: remove as default when home page menu-items are setup
                if( itemPath === 'home' ) {
                    itemPath = 'central';
                }

                // re-check the serviceItems in the store
                this.serviceItems = this.$store.getters['central/getServiceItems'];

                // Get the solution item/record for the current solution tag / path
                this.mcSolution = this.$lo.find( this.serviceItems, { servicePath: itemPath, isActive: true } );

                // Get active package group items, for the current solution (already sorted),
                if( this.mcSolution ) {
                    this.mcPackageGroups = this.serviceItems.filter( ( item ) => {
                        return ((item.parentId === this.mcSolution._id) && (item.serviceType === 'Package Group') && item.isActive);
                    } );

                } else {
                    this.mcPackageGroups = [];
                }

                // Return groupItems sorted by servicePriority
                return this.mcPackageGroups;
            },
        },
        methods : {
            packages( group ) {
                // Retrieve active packages for for the current package-group, order by priority
                const packageItems = this.$lo.filter( this.serviceItems,
                    {
                        parentId   : group._id,
                        serviceType: 'Package',
                        isActive   : true,
                    } );

                if( packageItems ) {
                    return packageItems.sort( ( a, b ) => {
                        return (parseInt( a.servicePriority ) - parseInt( b.servicePriority ));
                    } );
                }

                return [];
            },
            packageRoute( item ) {
                this.$router.push( { name: item.servicePath } );
            },
        },
    }
</script>
