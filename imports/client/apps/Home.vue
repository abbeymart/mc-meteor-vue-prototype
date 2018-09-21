<!--Marketplace Connect Solutions home page-->
<template>
    <div>
        <!--Tailored to each solution home page-->
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <div v-if="loggedIn">
            <div class="w3-container w3-cyan w3-round-large">
                <h1>{{dynamicPageInfo.contentTitle}}</h1>
                <span>{{dynamicPageInfo.contentSubTitle}}&trade;</span>
            </div>
            <!--Refactored to loop through the page contents, by priority... cool!-->
            <ul class="w3-ul">
                <li v-for="item in dynamicPageContents" :key="item._id">
                    <h3>{{item.contentTitle}}</h3>
                    <p>{{item.contentDesc}}</p>
                </li>
            </ul>
        </div>
        <div v-if="!loggedIn">
            <div class="w3-container w3-cyan w3-round-large">
                <h1>{{staticPageInfo.title}}</h1>
                <span>{{staticPageInfo.message}}&trade;</span>
            </div>
            <!--Refactored to loop through the page contents, by priority... cool!-->
            <ul class="w3-ul">
                <li v-for="item in staticPageContents" :key="item._id">
                    <h3>{{item.subTitle}}</h3>
                    <p>{{item.subMessage}}</p>
                </li>
            </ul>
        </div>
        <div class="w3-container w3-cyan w3-round-large w3-xlarge">
            <h5>{{homeFooter}}</h5>
        </div>
    </div>
</template>
<style>

</style>
<script>
    import { mcPage } from '/imports/lib/locales/getPage';
    import getCurrentLanguage from '/imports/lib/utils/Language';

    export default {
        name      : 'home',
        data() {
            return {
                isMessage          : false,
                pageMessage        : '',
                staticPageContents : '',
                dynamicPageContents: [],
                homeFooter         : this.$info.getFooterMessage(),
                pageItems          : [],
                loggedIn           : false,
                userLang           : this.$constant.getDefaultLanguage(),
                itemPath           : this.pageTag || this.$store.getters[ 'central/getProdPath' ] || localStorage.getItem( 'currentProdPath' ),
            }
        },
        components: {},
        props     : {
            pageTag: {
                type   : String,
                default: 'home',
            },
        },
        computed  : {
            staticPageInfo() {
                // Get the current page-item information | for local pages (mcPage)
                const itemInfo = mcPage.find( item => {
                    return (item.pageTag === this.itemPath && item.isActive === true);
                } );
                // set / order page content by priority
                if( itemInfo ) {
                    this.staticPageContents = this.$lo.sortBy( itemInfo.content, 'priority' );
                    return itemInfo;
                }
                return {};
            },
            dynamicPageInfo() {
                // Get the current page-item information | for server pages (contents)
                // TODO: load page data/content, prior to mainPage activation/usage
                const pageInfo = this.pageItems.find( item => {
                    return (item.contentTag === this.itemPath && item.isActive === true);
                } );
                if( pageInfo ) {
                    // process page contents by priority & return mainPage information
                    const pageContent        = this.pageItems.filter( item => {
                        return (item.parentId === pageInfo._id && item.isActive === true);
                    } );
                    this.dynamicPageContents = this.$lo.sortBy( pageContent, 'contentPriority' );
                    return pageInfo;
                }
                return {};
            },
        },
        methods   : {
            fetchData() {
                // access and query information
                const userToken     = this.$auth.getToken();
                const queryParams   = {},
                      currentItemId = '';
                if( userToken ) {
                    // set loggedIn status
                    this.loggedIn  = true;
                    // determine the current-user language
                    const userItem = this.$store.getters[ 'central/getUserItem' ];
                    if( !this.$lo.isEmpty( userItem ) ) {
                        // set this.userLang to user-language-information
                        const userLang = userItem.profile.userLang;
                        this.userLang  = getCurrentLanguage( userLang );
                    }
                    // contents for mConnect pages
                    Meteor.call( 'getContent', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'ContentError: Retry.';
                            // reset loggedIn status
                            this.loggedIn    = false;
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.pageItems   = this.$lo.sortBy( result.value, 'contentPriority' ).filter( ( item ) => {
                                return item.contentCat === 'mConnect' && item.isActive === true && item.contentLang === this.userLang;
                            } );
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Please login';
                }
            },
        },
        created() {
            // current product-path (current-state or before-page-refresh)
            this.itemPath = this.pageTag || this.$store.getters[ 'central/getProdPath' ] || localStorage.getItem( 'currentProdPath' );

            this.fetchData();
        },
    }
</script>
