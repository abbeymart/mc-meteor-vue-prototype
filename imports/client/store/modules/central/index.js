/**
 * Created by abbeymart on 2017-07-10.
 * mc-central store modules: states, mutations and actions
 * import states, mutations and actions => extend/combine using lodash
 */
// import central modules (language, contact, standardCodes, setting etc.)
import langMod from './langMod';
import mainMod from './mainMod';
import contactMod from './contactMod';
import stdCatMod from './stdCatMod';
import serviceMod from './serviceMod';
import orderMod from './orderMod';
import msgMod from './msgMod';

export default {
    namespaced: true,
    state() {
        return {
            code      : 'central',
            name      : 'Shared Services',
            queryLimit: 100000,
        }
    },
    getters   : {
        getCode( state ) {
            return state.code;
        },
        getName( state ) {
            return state.name;
        },
        getQueryLimit( state ) {
            return state.queryLimit;
        }
    },
    mutations : {
        changeCode( state, value ) {
            state.code = value;
        },
        changeName( state, value ) {
            state.name = value;
        },
        changeQueryLimit( state, value ) {
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
        setQueryLimit( { commit }, payload ) {
            commit( {
                type : 'changeQueryLimit',
                value: payload.limit,
            } );
        },
    },
    modules   : {
        lang   : langMod,
        main   : mainMod,
        contact: contactMod,
        stdCat : stdCatMod,
        service: serviceMod,
        order  : orderMod,
        msg    : msgMod,
    },
};
