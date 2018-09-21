/**
 * Created by abbeymart on 2017-07-16.
 * Language-related packages' states
 */
export default {
    state() {
        return {
            msgItem      : {},
            msgAction    : '',
            msgListAction: '',
            msgParentId  : '',
            replyMsgItem : {},
            readMsgItem  : {},
            msgStatus    : '',
            msgReceiver  : '',
        }
    },
    getters  : {
        getMsgItem( state ) {
            return state.msgItem;
        },
        getMsgAction( state ) {
            return state.msgAction;
        },
        getMsgListAction( state ) {
            return state.msgListAction;
        },
        getMsgParentId( state ) {
            return state.msgParentId;
        },
        getReplyMsgItem( state ) {
            return state.replyMsgItem;
        },
        getReadMsgItem( state ) {
            return state.readMsgItem;
        },
        getMsgStatus( state ) {
            return state.msgStatus;
        },
        getMsgReceiver( state ) {
            return state.msgReceiver;
        },
    },
    mutations: {
        changeMsgItem( state, payload ) {
            state.msgItem = payload;
        },
        changeMsgAction( state, payload ) {
            state.msgAction = payload.msgAction;
        },
        changeMsgListAction( state, payload ) {
            state.msgListAction = payload.msgListAction;
        },
        changeMsgParentId( state, payload ) {
            state.msgParentId = payload.msgParentId;
        },
        changeReplyMsgItem( state, payload ) {
            state.replyMsgItem = payload;
        },
        changeReadMsgItem( state, payload ) {
            state.readMsgItem = payload;
        },
        changeMsgStatus( state, payload ) {
            state.msgStatus = payload.msgStatus;
        },
        changeMsgReceiver( state, payload ) {
            state.msgReceiver = payload.msgReceiver;
        },
    },
    actions  : {
        setMsgItem( { commit }, payload ) {
            commit( 'changeMsgItem', payload );
        },
        setMsgAction( { commit }, payload ) {
            commit( 'changeMsgAction', payload );
        },
        setMsgListAction( { commit }, payload ) {
            commit( 'changeMsgListAction', payload );
        },
        setMsgParentId( { commit }, payload ) {
            commit( 'changeMsgParentId', payload );
        },
        setReplyMsgItem( { commit }, payload ) {
            commit( 'changeReplyMsgItem', payload );
        },
        setReadMsgItem( { commit }, payload ) {
            commit( 'changeReadMsgItem', payload );
        },
        setMsgStatus( { commit }, payload ) {
            commit( 'changeMsgStatus', payload );
        },
        setMsgReceiver( { commit }, payload ) {
            commit( 'changeMsgReceiver', payload );
        },
    },
};