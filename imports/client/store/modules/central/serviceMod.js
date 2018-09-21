/**
 * Created by abbeymart on 2017-09-04.
 * Location state
 */
export default {
    state() {
        return {
            serviceItems    : [],
            serviceMenuItems: [],
            docMenuItems    : [],
            fastMenuItems   : [],
            serviceItem     : {},
            payItem         : {},
            payProviderItem : {},
            shipItem        : {},
            shipProviderItem: {},
            shipCostItem    : {},
            shipOrderItem   : {},
            refundItem      : {},
            todoItem        : {},
            assignItem      : {},
            roleItem        : {},
            grantItem       : {},
            convertItem     : {},
            policyItem      : {},
            raaciItem       : {},
            taxItem         : {},
        }
    },
    getters  : {
        getServiceItems( state ) {
            return state.serviceItems;
        },
        getServiceMenuItems( state ) {
            return state.serviceMenuItems;
        },
        getDocMenuItems( state ) {
            return state.docMenuItems;
        },
        getFastMenuItems( state ) {
            return state.fastMenuItems;
        },
        getServiceItem( state ) {
            return state.serviceItem;
        },
        getPayItem( state ) {
            return state.payItem;
        },
        getPayProviderItem( state ) {
            return state.payProviderItem;
        },
        getShipItem( state ) {
            return state.shipItem;
        },
        getShipProviderItem( state ) {
            return state.shipProviderItem;
        },
        getShipCostItem( state ) {
            return state.shipCostItem;
        },
        getShipOrderItem( state ) {
            return state.shipOrderItem;
        },
        getRefundItem( state ) {
            return state.refundItem;
        },
        getTodoItem( state ) {
            return state.todoItem;
        },
        getAssignItem( state ) {
            return state.assignItem;
        },
        getRoleItem( state ) {
            return state.roleItem;
        },
        getGrantItem( state ) {
            return state.grantItem;
        },
        getConvertItem( state ) {
            return state.convertItem;
        },
        getPolicyItem( state ) {
            return state.policyItem;
        },
        getRaaciItem( state ) {
            return state.raaciItem;
        },
        getTaxItem( state ) {
            return state.taxItem;
        },
    },
    mutations: {
        changeServiceItems( state, payload ) {
            state.serviceItems = payload;
        },
        changeServiceMenuItems( state, payload ) {
            state.serviceMenuItems = payload;
        },
        changeDocMenuItems( state, payload ) {
            state.docMenuItems = payload;
        },
        changeFastMenuItems( state, payload ) {
            state.fastMenuItems = payload;
        },
        changeServiceItem( state, payload ) {
            state.serviceItem = payload;
        },
        changePayItem( state, payload ) {
            state.payItem = payload;
        },
        changePayProviderItem( state, payload ) {
            state.payProviderItem = payload;
        },
        changeShipItem( state, payload ) {
            state.shipItem = payload;
        },
        changeShipProviderItem( state, payload ) {
            state.shipProviderItem = payload;
        },
        changeShipCostItem( state, payload ) {
            state.shipCostItem = payload;
        },
        changeShipOrderItem( state, payload ) {
            state.shipOrderItem = payload;
        },
        changeRefundItem( state, payload ) {
            state.refundItem = payload;
        },
        changeTodoItem( state, payload ) {
            state.todoItem = payload;
        },
        changeAssignItem( state, payload ) {
            state.assignItem = payload;
        },
        changeRoleItem( state, payload ) {
            state.roleItem = payload;
        },
        changeGrantItem( state, payload ) {
            state.grantItem = payload;
        },
        changeConvertItem( state, payload ) {
            state.convertItem = payload;
        },
        changePolicyItem( state, payload ) {
            state.policyItem = payload;
        },
        changeRaaciItem( state, payload ) {
            state.raaciItem = payload;
        },
        changeTaxItem( state, payload ) {
            state.taxItem = payload;
        },
    },
    actions  : {
        setServiceItems( { commit }, payload ) {
            commit( 'changeServiceItems', payload );
        },
        setServiceMenuItems( { commit }, payload ) {
            commit( 'changeServiceMenuItems', payload );
        },
        setDocMenuItems( { commit }, payload ) {
            commit( 'changeDocMenuItems', payload );
        },
        setFastMenuItems( { commit }, payload ) {
            commit( 'changeFastMenuItems', payload );
        },
        setServiceItem( { commit }, payload ) {
            commit( 'changeServiceItem', payload );
        },
        setPayItem( { commit }, payload ) {
            commit( 'changePayItem', payload );
        },
        setPayProviderItem( { commit }, payload ) {
            commit( 'changePayProviderItem', payload );
        },
        setShipItem( { commit }, payload ) {
            commit( 'changeShipItem', payload );
        },
        setShipProviderItem( { commit }, payload ) {
            commit( 'changeShipProviderItem', payload );
        },
        setShipCostItem( { commit }, payload ) {
            commit( 'changeShipCostItem', payload );
        },
        setShipOrderItem( { commit }, payload ) {
            commit( 'changeShipOrderItem', payload );
        },
        setRefundItem( { commit }, payload ) {
            commit( 'changeRefundItem', payload );
        },
        setTodoItem( { commit }, payload ) {
            commit( 'changeTodoItem', payload );
        },
        setAssignItem( { commit }, payload ) {
            commit( 'changeAssignItem', payload );
        },
        setRoleItem( { commit }, payload ) {
            commit( 'changeRoleItem', payload );
        },
        setGrantItem( { commit }, payload ) {
            commit( 'changeGrantItem', payload );
        },
        setConvertItem( { commit }, payload ) {
            commit( 'changeConvertItem', payload );
        },
        setPolicyItem( { commit }, payload ) {
            commit( 'changePolicyItem', payload );
        },
        setRaaciItem( { commit }, payload ) {
            commit( 'changeRaaciItem', payload );
        },
        setTaxItem( { commit }, payload ) {
            commit( 'changeTaxItem', payload );
        },
    },
};
