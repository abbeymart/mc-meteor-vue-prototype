/**
 * Created by abbeymart on 2017-07-16.
 * Contact management states
 */
export default {
    state() {
        return {
            contactItem: {},
            addressItem: {},
            phoneItem  : {},
            orgItem    : {},
            locItem   : {},
        }
    },
    getters  : {
        getContactItem( state ) {
            return state.contactItem;
        },
        getAddressItem( state ) {
            return state.addressItem;
        },
        getPhoneItem( state ) {
            return state.phoneItem;
        },
        getOrgItem( state ) {
            return state.orgItem;
        },
        getLocItem( state ) {
            return state.locItem;
        },
    },
    mutations: {
        changeContactItem( state, payload ) {
            state.contactItem = payload;
        },
        changeAddressItem( state, payload ) {
            state.addressItem = payload;
        },
        changePhoneItem( state, payload ) {
            state.phoneItem = payload;
        },
        changeOrgItem( state, payload ) {
            state.orgItem = payload;
        },
        changeLocItem( state, payload ) {
            state.locItem = payload;
        },
    },
    actions  : {
        setContactItem( { commit }, payload ) {
            commit( 'changeContactItem', payload );
        },
        setAddressItem( { commit }, payload ) {
            commit( 'changeAddressItem', payload );
        },
        setPhoneItem( { commit }, payload ) {
            commit( 'changePhoneItem', payload );
        },
        setOrgItem( { commit }, payload ) {
            commit( 'changeOrgItem', payload );
        },
        setLocItem( { commit }, payload ) {
            commit( 'changeLocItem', payload );
        },
    },
};
