/**
 * Created by abbeymart on 2017-07-10.
 * mc-mpe store modules: states, mutations and actions
 * import states, mutations and actions => extend/combine using lodash
 * mpe_products, mpe_services, mpe_markets, mpe_traders, mpe_geos, mpe_demos, mpe_jobs
 */

export default {
    namespaced: true,
    state() {
        return{
            code      : 'mpe',
            name      : 'Marketplace Explorer',
        }
    },
    getters   : {
        getCode( state ) {
            return state.code;
        },
        getName( state ) {
            return state.name;
        },
    },
    mutations : {
        changeCode( state, value ) {
            state.code = value;
        },
        changeName( state, value ) {
            state.name = value;
        },
    },
    actions   : {
        setCode( { commit }, payload ) {
            commit( {
                type : 'changeCode',
                value: payload.code,
            } );
        },
        setName( { commit }, payload ) {
            commit( {
                type : 'changeName',
                value: payload.name,
            } );
        },
    },
    modules  : {}
};
