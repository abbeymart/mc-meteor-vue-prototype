/**
 * Created by abbeymart on 2017-09-02
 * Languages info mixin >> global?
 */
// import required modules / libraries:
import { Meteor } from 'meteor/meteor';

export const languageMixin = {
    data() {
        return {
            langItems     : [],
        }
    },
    methods : {
        async getLang() {
            this.langItems = this.$store.getters[ 'central/getLanguages' ];
            if( !this.langItems || this.langItems.length === 0 ) {
                // fetch from the server
                return await Meteor.call( 'getAllLang', ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'LanguageError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage   = false;
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
    },
    created() {
        this.getLang();
    }
};
