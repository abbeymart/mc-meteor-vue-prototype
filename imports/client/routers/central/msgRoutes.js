/**
 * Created by abbeymart on 2017-02-18.
 */
import Message from '../../apps/central/message/Message.vue';
// import MessageList from '../../apps/central/message/MessageList.vue';
import MessageDetail from '../../apps/central/message/MessageDetail.vue';
import MessageNew from '../../apps/central/message/MessageNew.vue';
import NewMessageList from '../../apps/central/message/subItems/NewMessageList.vue';
import InboxMessageList from '../../apps/central/message/subItems/InboxMessageList.vue';
import DraftMessageList from '../../apps/central/message/subItems/DraftMessageList.vue';
import ReadMessageList from '../../apps/central/message/subItems/ReadMessageList.vue';
import SentMessageList from '../../apps/central/message/subItems/SentMessageList.vue';
import DeletedMessageList from '../../apps/central/message/subItems/DeletedMessageList.vue';
import MainMessageList from '../../apps/central/message/subItems/MainMessageList.vue';

export const msgRoutes = [
    {
        path      : '/msg',
        name      : 'msg',
        redirect  : '/msg/list',
        components: {
            default: Message,
        },
        children  : [
            {
                path      : 'list',
                name      : 'mainMsgList',
                components: {
                    default: MainMessageList,
                }
            },
            {
                path      : 'detail',
                name      : 'msgDetail',
                components: {
                    default: MessageDetail,
                }
            },
            {
                path      : 'new',
                name      : 'msgNew',
                components: {
                    default: MessageNew,
                }
            },
            {
                path      : 'newList',
                name      : 'newMsgList',
                components: {
                    default: NewMessageList,
                }
            },
            {
                path      : 'inbox',
                name      : 'inboxMsgList',
                components: {
                    default: InboxMessageList,
                }
            },
            {
                path      : 'read',
                name      : 'readMsgList',
                components: {
                    default: ReadMessageList,
                }
            },
            {
                path      : 'sent',
                name      : 'sentMsgList',
                components: {
                    default: SentMessageList,
                }
            },
            {
                path      : 'draft',
                name      : 'draftMsgList',
                components: {
                    default: DraftMessageList,
                }
            },
            {
                path      : 'delete',
                name      : 'deletedMsgList',
                components: {
                    default: DeletedMessageList,
                }
            },
        ]
    },
];
