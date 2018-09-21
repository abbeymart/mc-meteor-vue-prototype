/**
 * Created by abbeymart on 2017-07-16.
 * Language-related packages' states
 */

import { Meteor } from 'meteor/meteor';
import { mcConstant } from "../../../../lib/locales/getConstant";

export default {
    state() {
        return {
            langItem      : {},
            labelItem     : {},
            contentItem   : {},
            folderItem    : {},
            docItem       : {},
            docSettingItem: {},
            language      : '',
            languages     : [],
        }
    },
    getters  : {
        getLangItem( state ) {
            return state.langItem;
        },
        getLabelItem( state ) {
            return state.labelItem;
        },
        getContentItem( state ) {
            return state.contentItem;
        },
        getFolderItem( state ) {
            return state.folderItem;
        },
        getDocItem( state ) {
            return state.docItem;
        },
        getDocSettingItem( state ) {
            return state.docSettingItem;
        },
        getLanguage( state ) {
            return state.language;
        },
        getLanguages( state ) {
            return state.languages;
        },
    },
    mutations: {
        changeLangItem( state, payload ) {
            state.langItem = payload;
        },
        changeLabelItem( state, payload ) {
            state.langItem = payload;
        },
        changeContentItem( state, payload ) {
            state.contentItem = payload;
        },
        changeFolderItem( state, payload ) {
            state.folderItem = payload;
        },
        changeDocItem( state, payload ) {
            state.docItem = payload;
        },
        changeDocSettingItem( state, payload ) {
            state.docSettingItem = payload;
        },
        changeLanguage( state, payload ) {
            state.language = payload.language;
        },
        changeLanguages( state, payload ) {
            state.languages = payload;
        },
    },
    actions  : {
        setLangItem( { commit }, payload ) {
            commit( 'changeLangItem', payload );
        },
        setLabelItem( { commit }, payload ) {
            commit( 'changeLabelItem', payload );
        },
        setContentItem( { commit }, payload ) {
            commit( 'changeContentItem', payload );
        },
        setFolderItem( { commit }, payload ) {
            commit( 'changeFolderItem', payload );
        },
        setDocItem( { commit }, payload ) {
            commit( 'changeDocItem', payload );
        },
        setDocSettingItem( { commit }, payload ) {
            commit( 'changeDocSettingItem', payload );
        },
        setLanguage( { commit }, payload ) {
            // get default user language, if not provided via the payload.language
            if( !payload.language ) {
                commit( 'changeLanguage', { language: mcConstant.getDefaultLanguage() } );
            } else {
                commit( 'changeLanguage', payload );
            }
        },
        async setLanguages( { commit }, payload ) {
            // get languages from the DB or as fetch/set via payload
            if( !payload || payload.length === 0 ) {
                return await Meteor.call( 'getAllLang', ( error, result ) => {
                    if( result.code === 'success' ) {
                        payload = result.value.filter( ( item ) => {
                            return item.isActive === true;
                        } );
                        commit( 'changeLanguages', payload );
                    }
                } );
            } else {
                commit( 'changeLanguages', payload );
            }
        },
    },
};
