/**
 * Created by abbeymart on 2017-09-02
 * Central (shared) mixin: message, itemInfo, locales, user(s)-info etc.
 */
// import required modules / libraries:
import { Meteor } from 'meteor/meteor';

export const headerMixin = {
    data() {
        return {
            currentUser     : '',
            serviceItems    : [],
            serviceMenuItems: [],
            docMenuItems    : [],
            fastMenuItems   : [],
        };
    },
    methods: {
        async getCurrentUser() {
            // Get current logged-in user's token, for resource access
            const userToken = this.$auth.getToken();
            if( userToken ) {
                // check and set info from the store
                const currentUser = this.$store.getters[ 'central/getCurrentUser' ];
                if( currentUser && !this.$lo.isEmpty( currentUser ) ) {
                    this.currentUser = `${currentUser.profile.firstName} ${currentUser.profile.lastName}`;
                } else {
                    // if store info is empty, get info from the server and update the store
                    return await Meteor.call( 'currentUserInfo', userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = `${error}: UserInfoError: Retry.`;
                        }
                        if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Item(s) available';
                            const userInfo   = result.value;
                            // capture current user information for other component usage
                            this.$store.dispatch( 'central/setUserItem', userInfo );
                            this.$store.dispatch( 'central/setCurrentUser', userInfo );
                            // Session.set( 'currentUser', userInfo );
                            this.currentUser = `${userInfo.profile.firstName} ${userInfo.profile.lastName}`;
                            //user-language: already part of currentUser information (i.e. profile.userLang)
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
        async getServices() {
            // Get current logged-in user's token, for resource access
            const userToken     = this.$auth.getToken(),
                  queryParams   = {},
                  currentItemId = '';
            if( userToken ) {
                // services: check local store before query the server
                this.serviceItems     = this.$store.getters[ 'central/getServiceItems' ];
                this.serviceMenuItems = this.$store.getters[ 'central/getServiceMenuItems' ];
                this.docMenuItems     = this.$store.getters[ 'central/getDocMenuItems' ];
                this.fastMenuItems    = this.$store.getters[ 'central/getFastMenuItems' ];

                if( (this.serviceMenuItems.length === 0 || this.docMenuItems.length === 0 || this.fastMenuItems.length === 0) || this.serviceItems.length === 0 ) {
                    // fetch info from the server
                    return await Meteor.call( 'getService', queryParams, currentItemId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = 'ServiceError: Retry.';
                            } else if( result.code === 'success' ) {
                                this.isMessage        = false;
                                this.pageMessage      = 'Items available';
                                this.serviceItems     = this.$lo.sortBy( result.value, 'servicePriority' ).filter( ( item ) => {
                                    return item.isActive === true && item.serviceLang === this.userLang;
                                } );
                                this.serviceMenuItems = this.serviceItems.filter( ( item ) => {
                                    return item.serviceType === 'Solution';
                                } );
                                // store info in the store
                                this.$store.dispatch( 'central/setServiceItems', this.serviceItems );
                                this.$store.dispatch( 'central/setServiceMenuItems', this.serviceMenuItems );

                                this.docMenuItems = this.serviceItems.filter( ( item ) => {
                                    return item.serviceType === 'Documentation';
                                } );
                                // store info in the store
                                this.$store.dispatch( 'central/setDocMenuItems', this.docMenuItems );

                                this.fastMenuItems = this.serviceItems.filter( ( item ) => {
                                    return item.serviceType === 'Fast Links';
                                } );
                                // store info in the store
                                this.$store.dispatch( 'central/setFastMenuItems', this.fastMenuItems );
                            }
                            else {
                                this.isMessage   = true;
                                this.pageMessage = `${result.code}: ${result.value}`;
                            }
                        }
                    );
                }
            } else {
                this.isMessage   = true;
                this.pageMessage = 'Access-key missing or expired. Please login again.';
            }
        },
    },
    created() {
        // get / fetchData
        this.getCurrentUser();
        this.getServices();
    }
};
