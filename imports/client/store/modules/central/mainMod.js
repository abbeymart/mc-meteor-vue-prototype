/**
 * Created by abbeymart on 2017-09-04.
 * mcMain: layout, header, footer and common states
 */
export default {
    state() {
        return {
            prodPath   : '',
            prodName   : '',
            userName   : '',
            userItem   : {},
            currentUser: {},
            ownerId    : '',
            ownerType  : '',
            searchCat  : '',
            searchKey  : '',
            emanItem   : {},
            settingItem: {},
            auditItem  : {},
        }
    },
    getters  : {
        getProdPath( state ) {
            return state.prodPath;
        },
        getProdName( state ) {
            return state.prodName;
        },
        getUserName( state ) {
            return state.userName;
        },
        getUserItem( state ) {
            return state.userItem;
        },
        getCurrentUser( state ) {
            return state.currentUser;
        },
        getOwnerId( state ) {
            return state.ownerId;
        },
        getOwnerType( state ) {
            return state.ownerType;
        },
        getSearchCat( state ) {
            return state.searchCat;
        },
        getSearchKey( state ) {
            return state.searchKey;
        },
        getEmanItem( state ) {
            return state.emanItem;
        },
        getSettingItem( state ) {
            return state.settingItem;
        },
        getAuditItem( state ) {
            return state.auditItem;
        },
    },
    mutations: {
        changeProdPath( state, payload ) {
            state.prodPath = payload.path;
        },
        changeProdName( state, payload ) {
            state.prodName = payload.name;
        },
        changeUserName( state, payload ) {
            state.userName = payload.name;
        },
        changeUserItem( state, payload ) {
            state.userItem = payload;
        },
        changeCurrentUser( state, payload ) {
            state.currentUser = payload;
        },
        changeOwnerId( state, payload ) {
            state.ownerId = payload.id;
        },
        changeOwnerType( state, payload ) {
            state.ownerType = payload.type;
        },
        changeSearchCat( state, payload ) {
            state.searchCat = payload.cat;
        },
        changeSearchKey( state, payload ) {
            state.searchKey = payload.key;
        },
        changeEmanItem( state, payload ) {
            state.emanItem = payload;
        },
        changeSettingItem( state, payload ) {
            state.settingItem = payload;
        },
        changeAuditItem( state, payload ) {
            state.auditItem = payload;
        },
    },
    actions  : {
        setProdPath( { commit }, payload ) {
            commit( 'changeProdPath', payload );
        },
        setProdName( { commit }, payload ) {
            commit( 'changeProdName', payload );
        },
        setUserName( { commit }, payload ) {
            commit( 'changeUserName', payload );
        },
        setUserItem( { commit }, payload ) {
            commit( 'changeUserItem', payload );
        },
        setCurrentUser( { commit }, payload ) {
            commit( 'changeCurrentUser', payload );
        },
        setOwnerId( { commit }, payload ) {
            commit( 'changeOwnerId', payload );
        },
        setOwnerType( { commit }, payload ) {
            commit( 'changeOwnerType', payload );
        },
        setSearchCat( { commit }, payload ) {
            commit( 'changeSearchCat', payload );
        },
        setSearchKey( { commit }, payload ) {
            commit( 'changeSearchKey', payload );
        },
        setEmanItem( { commit }, payload ) {
            commit( 'changeEmanItem', payload );
        },
        setSettingItem( { commit }, payload ) {
            commit( 'changeSettingItem', payload );
        },
        setAuditItem( { commit }, payload ) {
            commit( 'changeAuditItem', payload );
        },
    },
};
