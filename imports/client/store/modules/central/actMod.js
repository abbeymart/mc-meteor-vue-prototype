/**
 * Created by abbeymart on 2017-09-14
 */

export default {
    state() {
        return {
            actItem          : {},
            actLevelItem     : {},
            actTaskItem      : {},
            actGroupItem     : {},
            actGroupLevelItem: {},
            actGroupUserItem : {},
        }
    },
    getters  : {
        getActItem( state ) {
            return state.actItem;
        },
        getLevelItem( state ) {
            return state.actLevelItem;
        },
        getTaskItem( state ) {
            return state.actTaskItem;
        },
        getGroupItem( state ) {
            return state.actGroupItem;
        },
        getGroupLevelItem( state ) {
            return state.actGroupLevelItem;
        },
        getGroupUserItem( state ) {
            return state.actGroupUserItem;
        },
    },
    mutations: {
        changeActItem( state, payload ) {
            state.actItem = payload;
        },
        changeLevelItem( state, payload ) {
            state.actLevelItem = payload;
        },
        changeTaskItem( state, payload ) {
            state.actTaskItem = payload;
        },
        changeGroupItem( state, payload ) {
            state.actGroupItem = payload;
        },
        changeGroupLevelItem( state, payload ) {
            state.actGroupLevelItem = payload;
        },
        changeGroupUserItem( state, payload ) {
            state.actGroupUserItem = payload;
        },
    },
    actions  : {
        setActItem( { commit }, payload ) {
            commit( 'changeActItem', payload );
        },
        setLevelItem( { commit }, payload ) {
            commit( 'changeLevelItem', payload );
        },
        setTaskItem( { commit }, payload ) {
            commit( 'changeTaskItem', payload );
        },
        setGroupItem( { commit }, payload ) {
            commit( 'changeGroupItem', payload );
        },
        setGroupLevelItem( { commit }, payload ) {
            commit( 'changeGroupLevelItem', payload );
        },
        setGroupUserItem( { commit }, payload ) {
            commit( 'changeGroupUserItem', payload );
        },
    },
};
