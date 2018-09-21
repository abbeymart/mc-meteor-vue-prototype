/**
 * Created by abbeymart on 2017-09-02
 * Central (shared) mixin: message, itemInfo, locales, user(s)-info etc.
 */
// import required modules / libraries:
import { Meteor } from 'meteor/meteor';

export const centralMixin = {
    data() {
        return {
            mcLabel       : this.$label,
            isMessage     : false,
            pageMessage   : '',
            itemId        : '',
            itemParams    : '',
            itemParamId   : '',
            currentItem   : '',
            validateErrors: '',
            langItems     : [],
            codeItems     : [],
            userLang      : this.$constant.getDefaultLanguage(),
            loggedIn      : false,
        };
    },
    methods: {
        getCentral() {
            // Get current logged-in user's token, for resource access
            const userToken     = this.$auth.getToken(),
                  queryParams   = {},
                  currentItemId = '';
            if( userToken ) {
                this.loggedIn = true;
                // get standard code items
                Meteor.call( 'getCode', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'CodeError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage   = true;
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
                        this.isMessage   = true;
                        this.pageMessage = 'Items available';
                        this.userItems   = result.value;
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
        async getLang() {
            this.langItems = this.$store.getters[ 'central/getLanguages' ];
            if( !this.langItems || this.langItems.length === 0 ) {
                // fetch from the server
                return await Meteor.call( 'getAllLang', ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'LanguageError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage   = true;
                        this.pageMessage = 'Items available';
                        this.langItems   = this.$lo.sortBy( result.value, 'langName' ).filter( ( item ) => {
                            return item.isActive === true;
                        } );
                        // update the store
                        this.$store.dispatch( 'central/setLanguages', this.langItems );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
            }
        },
        langName( code ) {
            const langName = this.$lo.find( this.langItems, { langCode: code } );
            return langName ? langName.langName : 'n/a';
        },
        shortDesc( desc ) {
            // set the short description for item.desc
            return this.$utils.shortString( desc, this.$constant.getShortDesc() );
        },
    },
    created() {
        // label-locales
        this.mcLabel = this.$label;
        // get / fetchData
        this.getLang();
        this.getCentral();
    }
};