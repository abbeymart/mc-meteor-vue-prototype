<template>
    <div id="app">
        <!--automate header and footer by solution or root path, && user-access (admin / user)-->
        <div id="mcMainHeader" class="w3-container w3-light-grey w3-margin-bottom">
            <!--header for admin users-->
            <span v-if="isAdmin">
                <main-header/>
            </span>
            <!--headers for non-admin users by solution-->
            <span v-else-if="currentSolution === 'central'">
                <central-header/>
            </span>
            <span v-else-if="currentSolution === 'mpe'">
                <mpe-header/>
            </span>
            <span v-else-if="currentSolution === 'pam'">
                <pam-header/>
            </span>
            <span v-else-if="currentSolution === 'asset'">
                <asset-header/>
            </span>
            <span v-else-if="currentSolution === 'sdm'">
                <sdm-header/>
            </span>
            <span v-else-if="currentSolution === 'hcm'">
                <hcm-header/>
            </span>
            <span v-else-if="currentSolution === 'fin'">
                <fin-header/>
            </span>
            <span v-else-if="currentSolution === 'hms'">
                <hms-header/>
            </span>
            <span v-else-if="currentSolution === 'ems'">
                <ems-header/>
            </span>
            <span v-else-if="currentSolution === 'dm'">
                <dm-header/>
            </span>
            <span v-else-if="currentSolution === 'bi'">
                <bi-header/>
            </span>
            <span v-else-if="currentSolution === 'mc'">
                <mc-header/>
            </span>
            <span v-else>
                <!--header for all / guest user-->
                <home-header/>
            </span>
        </div>
        <div>
            <nav class="w3-sidebar w3-round-medium" style="display:none" id="mcSidenav">
                <a href="#" @click.prevent="mcClose()" class="w3-closenav w3-large mcBoldLink">
                    Menu &times;
                </a>
                <!--Sidemenu display based on servicePath | solution-->
                <mcSideMenu/>
            </nav>
        </div>
        <!--TODO: Top menu, if solution is selected-->
        <div v-if="isSolution">
            <top-menu/>
        </div>
        <div id="mcMainBody" class="w3-container">
            <header class="w3-container w3-teal w3-round-medium">
                <span class="w3-opennav w3-xlarge" @click.prevent="mcOpen()" id="mcOpenNav">&#9776;</span>
            </header>
            <!--Main content area for all pages, switch based on the currentPath / servicePath-->
            <div id="mcContent">
                <span v-if="isMessage" class="alert-info">{{pageMessage}}</span>
                <!--Router views outlet (default section)-->
                <router-view/>
            </div>
        </div>
        <div id="mcMainFooter" class="w3-container w3-teal w3-margin-top">
            <mc-footer/>
        </div>
    </div>
</template>

<script>
    // main header / footer
    import Header from './include/Header.vue';
    import Footer from './include/Footer.vue';
    // solutions' headers
    import CentralHeader from './apps/central/include/Header';
    import MpeHeader from './apps/mpe/include/Header.vue';
    import PamHeader from './apps/pam/include/Header.vue';
    import SdmHeader from './apps/sdm/include/Header.vue';
    import AssetHeader from './apps/asset/include/Header.vue';
    import HcmHeader from './apps/hcm/include/Header.vue';
    import FinHeader from './apps/fin/include/Header.vue';
    import MCHeader from './apps/mc/include/Header.vue';

    import DmHeader from './apps/dm/include/Header.vue';
    import BiHeader from './apps/bi/include/Header.vue';
    import HmsHeader from './apps/hms/include/Header.vue';
    import EmsHeader from './apps/ems/include/Header.vue';
    // shared header and menus
    import HomeHeader from './include/header/HeaderHome.vue';
    import SideMenu from './include/menu/SideMenu.vue';
    import TopMenu from './include/menu/TopMenu.vue';

    // import { Services } from "../collections/Central";

    export default {
        name      : 'App',
        data() {
            return {
                isMessage      : false,
                pageMessage    : '',
                isAdmin        : false,
                isSolution     : false,
                currentSolution: 'central',
            }
        },
        components: {
            mainHeader   : Header,
            mcFooter     : Footer,
            mcSideMenu   : SideMenu,
            centralHeader: CentralHeader,
            mpeHeader    : MpeHeader,
            assetHeader  : AssetHeader,
            pamHeader    : PamHeader,
            sdmHeader    : SdmHeader,
            hcmHeader    : HcmHeader,
            finHeader    : FinHeader,
            hmsHeader    : HmsHeader,
            emsHeader    : EmsHeader,
            dmHeader     : DmHeader,
            biHeader     : BiHeader,
            mcHeader     : MCHeader,
            homeHeader   : HomeHeader,
            topMenu      : TopMenu,
        },
        methods   : {
            mcOpen() {
                document.getElementById( "mcMainBody" ).style.marginLeft = "20%";
                document.getElementById( "mcSidenav" ).style.width       = "20%";
                document.getElementById( "mcSidenav" ).style.display     = "block";
                document.getElementById( "mcOpenNav" ).style.display     = "none";
            },
            mcClose() {
                document.getElementById( "mcMainBody" ).style.marginLeft = "0%";
                document.getElementById( "mcSidenav" ).style.display     = "none";
                document.getElementById( "mcOpenNav" ).style.display     = "inline-block";
            },
        },
        computed  : {
            setAdmin() {
                this.isAdmin = this.$store.getters[ 'central/getCurrentUser' ] ? this.$store.getters[ 'central/getCurrentUser' ].isAdmin : false;
                return this.isAdmin;
            },
        },
        created() {
            // detect current user-access
            this.isAdmin = this.$store.getters[ 'central/getCurrentUser' ] ? this.$store.getters[ 'central/getCurrentUser' ].isAdmin : false;

            // detect root path from the URL
            // capture current route / url information
            const currentPage                   = document.URL || window.location.href;
            let parts, protocol, host, pathName = '';

            if( currentPage ) {
                parts                = currentPage.split( '://' )[ 1 ].split( '/' );
                protocol             = currentPage.split( '://' )[ 0 ];
                host                 = parts[ 0 ];
                this.currentSolution = parts[ 1 ];
                pathName             = parts.slice( 1 ).join( '/' );
            }

            // detect the current solution information for header / footer components
            const prodPath = this.$store.getters[ 'central/getProdPath' ];
            if( prodPath && prodPath !== 'home' ) {
                this.currentSolution = prodPath;
                // set isSolution state
                this.isSolution      = true;
            } else if( parts[ 1 ] ) {
                // test direct page access
                // console.log( parts[ 1 ], 'solution-path-created' );
                // store the solution-path in the store
                this.isSolution = true;
                this.$store.dispatch( 'central/setProdPath', { path: parts[ 1 ] } );
            } else {
                this.isSolution      = true;
                this.currentSolution = 'home';
                this.$store.dispatch( 'central/setProdPath', 'home' );
            }
        },
    };

</script>

<style>

</style>
