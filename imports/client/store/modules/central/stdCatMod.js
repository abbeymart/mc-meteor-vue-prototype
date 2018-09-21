/**
 * Created by abbeymart on 2017-09-04.
 * Location state
 */
export default {
    state() {
        return {
            stdCatItem : {},
            stdCodeItem: {},
        }
    },
    getters  : {
        getStdCatItem( state ) {
            return state.stdCatItem;
        },
        getStdCodeItem( state ) {
            return state.stdCodeItem;
        },
    },
    mutations: {
        changeStdCatItem( state, payload ) {
            state.stdCatItem = payload;
        },
        changeStdCodeItem( state, payload ) {
            state.stdCodeItem = payload;
        },
    },
    actions  : {
        setStdCatItem( { commit }, payload ) {
            commit( 'changeStdCatItem', payload );
        },
        setStdCodeItem( { commit }, payload ) {
            commit( 'changeStdCodeItem', payload );
        },
    },
};
