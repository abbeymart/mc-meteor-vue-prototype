<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-th-list"/> {{mcLabel.msgsList}}</h4>
        </div>
        <div class="w3-container w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <table class="w3-table w3-striped w3-border w3-hoverable" id="mcMsgList">
                <thead>
                <tr class="w3-red">
                    <th scope="col">{{mcLabel.title}}</th>
                    <th scope="col">{{mcLabel.msg}}</th>
                    <th scope="col">{{mcLabel.status}}</th>
                    <th scope="col">{{mcLabel.lang}}</th>
                    <th scope="col">{{mcLabel.isActive}}</th>
                    <!--For all messages except Draft-->
                    <th scope="col">Read</th>
                    <th scope="col">Reply</th>
                    <!--For Draft messages only-->
                    <th scope="col">{{mcLabel.update}}</th>
                    <th scope="col">{{mcLabel.delete}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in currentItems" :key="item._id">
                    <td>{{item.msgTitle}}</td>
                    <td>{{item.msgDesc}}</td>
                    <td>{{item.msgStatus}}</td>
                    <td>{{langName(item.msgLang)}}</td>
                    <td>
                        <!--show/hide depending on active-state (Yes/No)-->
                        <span v-if="item.isActive">{{mcLabel.yes}}<i class="glyphicon glyphicon-check"/></span>
                        <span v-else>{{mcLabel.no}}<i class="glyphicon glyphicon-off"/></span>
                    </td>
                    <td>
                        <a v-if="!isMsgDraft(item)" id="readMsgItem" href="#" @click.prevent="readMsg(item)">{{mcLabel.read}}
                            <i class="glyphicon glyphicon-record"/>
                        </a>
                    </td>
                    <td>
                        <a v-if="!isMsgDraft(item)" id="replyMsgItem" href="#" @click.prevent="replyMsg(item)">{{mcLabel.reply}}
                            <i
                                    class="glyphicon glyphicon-edit"/>
                        </a>
                    </td>
                    <td>
                        <a v-if="isMsgDraft(item)" id="editMsgItem" href="#" @click.prevent="updateMsg(item)">{{mcLabel.update}}
                            <i class="glyphicon glyphicon-edit"/>
                        </a>
                    </td>
                    <td>
                        <a v-if="!isDeleted(item)" id="deleteItem" href="#" @click.prevent="deleteMsg(item)">
                            {{mcLabel.delete}}<i class="glyphicon glyphicon-remove-circle"/>
                        </a>
                        <a v-if="isDeleted(item)" id="undoDelete" href="#" @click.prevent="undeleteMsg(item)">
                            {{mcLabel.undelete}}<i class="glyphicon glyphicon-edit"/>
                        </a>
                        <!--TODO: include permanent removal of deleted message-->
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<style>

</style>
<script>
    import { Meteor } from 'meteor/meteor';
    import { Session } from 'meteor/session';
    import { mcMessage } from '/imports/lib/locales/getMessage';
    import _ from 'lodash';

    export default {
        name      : 'msgList',
        components: {},
        data() {
            return {
                mcLabel    : this.$label,
                isMessage  : false,
                pageMessage: '',
                msgItems   : [],
                langItems  : [],
                codeItems  : [],
                itemParams : {},
                itemId     : '',
                currentItem: '',
                isAdmin    : false,
                isSave     : false,
            }
        },
        props     : {
            msgStatus: {
                type   : String,
                default: ''
            }
        },
        computed  : {
            currentItems(){
                const msgStatus   = this.msgStatus || '',
                      currentUser = Session.get( 'currentUser' );
                let userId        = '';
                if( currentUser ) {
                    userId = currentUser._id;
                }
                if( msgStatus ) {
                    // New/unread ('Sent' status), inbox('Read' and 'Sent' status) for receiver
                    // @Listing for Admin users to include Feedback and Requests
                    if( this.isAdmin ) {
                        if( msgStatus === 'New' ) {
                            return this.msgItems.filter( ( item ) => {
                                return (item.msgStatus === 'Sent') && (item.msgReceiver === userId || item.msgReceiver === 'Admin');
                            } );
                        }
                        if( msgStatus === 'Inbox' ) {
                            return this.msgItems.filter( ( item ) => {
                                return (item.msgStatus === 'Sent' || item.msgStatus === 'Read' ) && (item.msgReceiver === userId || item.msgReceiver === 'Admin');
                            } );
                        }
                        return this.msgItems.filter( ( item ) => {
                            return item.msgStatus === msgStatus;
                        } );
                    }
                    // Listing for all users
                    if( msgStatus === 'New' ) {
                        return this.msgItems.filter( ( item ) => {
                            return (item.msgStatus === 'Sent') && (item.msgReceiver === userId);
                        } );
                    }
                    if( msgStatus === 'Inbox' ) {
                        return this.msgItems.filter( ( item ) => {
                            return (item.msgStatus === 'Sent' || item.msgStatus === 'Read' ) && (item.msgReceiver === userId);
                        } );
                    }
                    return this.msgItems.filter( ( item ) => {
                        return item.msgStatus === msgStatus;
                    } );
                }
                // Return all messages for listing, TODO: check appropriateness
                return this.msgItems;
            },
        },
        methods   : {
            fetchData(){
                const userToken     = this.$auth.getToken(),
                      queryParams   = {},
                      currentItemId = '';
                // DDP || Meteor.method
                if( userToken ) {
                    // services
                    Meteor.call( 'getMessage', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'MessageError: Retry.';
                        } else if( result.code === 'success'
                        ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.msgItems    = _.sortBy( result.value, 'contentTitle' );
                        }
                        else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                    // languages
                    Meteor.call( 'getLang', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'LanguageError: Retry.';
                        } else if( result.code === 'success'
                        ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.langItems   = this.$lo.sortBy( result.value, 'langName' ).filter( ( item ) => {
                                return item.isActive === true;
                            } );
                        }
                        else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                    // get standard code items
                    Meteor.call( 'getCode', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'CodeError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.codeItems   = this.$lo.sortBy( result.value, 'codeName' ).filter( ( item ) => {
                                return item.isActive === true;
                            } );
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Access-key missing or expired. Please login again.';
                }
            },
            isDeleted( item ) {
                if( item.msgStatus === 'Deleted' || item.msgSendToStatus === 'Deleted' ) {
                    return true;
                } else {
                    return false;
                }
            },
            isRead( item ){
                if( item.msgStatus === 'Read' || item.msgSendToStatus === 'Read' ) {
                    return true;
                } else {
                    return false;
                }
            },
            isReplied(item){
                if( item.msgStatus === 'Sent') {
                    return true;
                } else {
                    return false;
                }
            },
            isDraft(item){
                if( item.msgStatus === 'Draft' ) {
                    return true;
                } else {
                    return false;
                }
            },
            // Determine if the current message item status is Draft
            isMsgDraft( item ){
                return item.msgStatus === 'Draft' ? true : false;
            },

            catName( itemId ){
                const catName = _.find( this.codeItems, { _id: itemId } );
                return catName ? catName.codeName : 'n/a';
            },
            typeName( itemId ){
                const typeName = this.$lo.find( this.codeItems, { _id: itemId } );
                return typeName ? typeName.codeName : 'n/a';
            },
            statusName( itemId ){
                const typeName = this.$lo.find( this.codeItems, { _id: itemId } );
                return typeName ? typeName.codeName : 'n/a';
            },
            parentName( parentId ) {
                const parentName = this.$lo.find( this.msgItems, { _id: parentId } );
                return parentName ? parentName.msgTitle : 'n/a';
            },
            shortDesc ( item ) {
                // set the short description for item.desc
                return this.$utils.shortString( item, this.$constant.getShortDesc() );
            },
            langName( code ) {
                const langName = this.$lo.find( this.langItems, { langCode: code } );
                return langName ? langName.langName : 'n/a';

            },
            updateMsg( item ) {
                /**
                 * Can update/edit draft messages only
                 */
                // Set current item
                this.$store.dispatch('central/setMsgItem', item);
                // Capture parentItemId, mainly for draft/reply message
                this.$store.dispatch('central/setMsgParentId', {msgParentId: item.parentId});
                // Set message status (msgAction) to Draft
                this.$store.dispatch('central/setMsgAction', {msgAction: 'Draft'});
                // Reset contending actions
                this.$store.dispatch('central/setReplyMsgItem', '');
                this.$store.dispatch('central/setReadMsgItem', '');

                // Route to detail page
                this.$router.push( { name: 'msgDetail' } );
            },
            readMsg( item ){
                /**
                 * Can read received/new, sent and deleted messages
                 * Read status: set for received/inbox/New message only (msgSendToStatus)
                 */
                // Set the current message action, readMsgItem and reset currentMsgItem (for update)
                this.$store.dispatch('central/setMsgAction', {msgAction: 'Read'});
                this.$store.dispatch('central/setReadMsgItem', item);
                // Reset contending actions
                this.$store.dispatch('central/setMsgItem', '');
                this.$store.dispatch('central/setReplyMsgItem', '');

                // Do not change the msgSendToStatus for draft/sent/replied(sender) & deleted messages
                const currentUserId = this.$store.getters['central/getCurrentUser']._id || '';

                // For receiver messages (New, current message status)... msgSendToStatus
                if( item._id && (item.msgReceiver === currentUserId || item.msgReceiver === 'Admin') ) {
                    if( item.msgSendToStatus === 'New' ) {
                        item.msgPriorStatus  = item.msgSendToStatus; // for message recovery only
                        item.msgSendToStatus = 'Read';
                    }
                }
                if( item.msgSendToStatus === 'New' ) {
                    // save message
                    // Update the msgStatus / msgSendToStatus ('Deleted') and msgPriorStatus
                    // token/access key
                    const userToken = this.$auth.getToken();
                    // Meteor method
                    if( userToken ) {
                        Meteor.call( 'saveMessage', item, itemId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            }
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                            // TODO: Go to read page

                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = 'Please login';
                    }
                }
                // TODO: Go to read page
                this.$router.push( { name: 'msgDetail' } );
            },
            replyMsg( item ){
                /**
                 * Can reply received/new messages
                 */
                // Set the current message status, msgAction, replyMsgItem and reset replyMsgItem
                // Session.set( 'currentMsgStatus', item.msgStatus );
                this.$store.dispatch('central/setMsgStatus', {msgStatus: item.msgStatus});
                this.$store.dispatch('central/setMsgAction', {msgAction: 'Replied'});
                this.$store.dispatch('central/setReplyMsgItem', item);
                // Reset contending actions
                this.$store.dispatch('central/setMsgItem', '');
                this.$store.dispatch('central/setReadMsgItem', '');

                // Set the receiver of replied message to the original sender (redundant/optional)
//                Session.set( 'msgReplyReceiver', item.msgSender );
                // Route to detail page
                this.$router.push( { name: 'msgDetail' } );

            },
            deleteMsg( item ){
                /**
                 * TODO: deleted message should be tagged as inactive
                 * Can delete any message (draft, send, inbox/new/read etc.)
                 * record current msgStatus and msgSendToStatus, as msgPriorStatus for recovery/undo
                 */

                // userId / userName
                let userId, userName;
                const userInfo = this.$store.getters['central/getCurrentUser'];
                if( userInfo ) {
                    userId = userInfo._id;
                    userName = `${userInfo.username} | ${userInfo.profile.firstName} ${userInfo.profile.lastName}`;
                }

                // Message status for sender (msgStatus) and receiver (msgSentToStatus)
                // Prior message status for  the current msgStatus / msgSendToStatus, to recover message

                // Receiver messages, status: New or Read
                if( item.msgSendToStatus && (item.msgReceiver === userId || item.msgReceiver === userName || item.msgReceiver === 'Admin') ) {
                    item.msgPriorStatus  = item.msgSendToStatus;
                    item.msgSendToStatus = 'Deleted';
                }

                // Sender messages, status: Draft, Sent, Replied
                if( item.msgStatus && (item.msgSender === userId || item.msgSender === userName || item.msgSender === 'Admin') ) {
                    item.msgPriorStatus = item.msgStatus;
                    item.msgStatus      = 'Deleted';
                }

                // prepare the msgItem parameters to be saved
                const msgItem = {
                    msgTitle       : item.msgTitle,
                    msgBody        : item.msgBody,
                    msgDesc        : item.msgDesc,
                    msgCat         : item.msgCat,
                    msgStatus      : item.msgStatus,
                    msgSendToStatus: item.msgSendToStatus,
                    msgPriorStatus : item.msgPriorStatus,
                    msgPrivacy     : item.msgPrivacy,
                    msgSender      : item.msgSender,
                    msgReceiver    : item.msgReceiver,
                    msgLang        : item.msgLang,
                    parentId       : item.parentId || '',
                    isActive       : item.isActive
                };

                if( confirm( this.$message.confirmMsgDelete ) ) {
                    const itemId = item._id;
                    if( !itemId ) {
                        this.isMessage   = false;
                        this.pageMessage = mcMessage.itemMissing;
                    }
                    // Update the msgStatus / msgSendToStatus ('Deleted') and msgPriorStatus
                    // token/access key
                    const userToken = this.$auth.getToken();
                    // Meteor method
                    if( userToken ) {
                        Meteor.call( 'saveMessage', msgItem, itemId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage   = true;
                                this.pageMessage = `${result.code}: ${result.value}`;
                            }
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = 'Please login';
                    }
                }
            },
            undeleteMsg( item ){
                /**
                 * Swap the msgStatus (sender) and msgSendToStatus (receiver) with msgPriorStatus
                 *
                 */

                // userId / userName
                let userId, userName;
                const userInfo = this.$store.getters['central/getCurrentUser'];
                if( userInfo ) {
                    userId = userInfo._id;
                    userName = `${userInfo.username} | ${userInfo.profile.firstName} ${userInfo.profile.lastName}`;
                }

                // save current msgPriorStatus prior to swapping for receiver and/or sender
                const priorMsgStatus = item.msgPriorStatus;

                // Message status for sender (msgStatus) and receiver (msgSentToStatus)
                // Prior message status for  the current msgStatus / msgSendToStatus, to recover message
                // Receiver messages, status: New or Read
                if (item.msgReceiver === userId || item.msgReceiver === userName || item.msgReceiver === 'Admin') {
                    item.msgSendToStatus = priorMsgStatus;
                    item.msgPriorStatus  = 'Deleted';
                }
                // Sender messages, status: Draft, Sent, Replied...
                if(item.msgSender === userId || item.msgSender === userName || item.msgSender === 'Admin') {
                    item.msgStatus = priorMsgStatus;
                    item.msgPriorStatus = 'Deleted';
                }

                // prepare the msgItem parameters to be saved
                const msgItem = {
                    msgTitle       : item.msgTitle,
                    msgBody        : item.msgBody,
                    msgDesc        : item.msgDesc,
                    msgCat         : item.msgCat,
                    msgStatus      : item.msgStatus,
                    msgSendToStatus: item.msgSendToStatus,
                    msgPriorStatus : item.msgPriorStatus || '',
                    msgPrivacy     : item.msgPrivacy,
                    msgSender      : item.msgSender,
                    msgReceiver    : item.msgReceiver,
                    msgLang        : item.msgLang,
                    parentId       : item.parentId,
                    isActive       : item.isActive
                }

                if( confirm( this.$message.confirmMsgUndelete ) ) {
                    const itemId = item._id;
                    if( !itemId ) {
                        this.isMessage   = false;
                        this.pageMessage = mcMessage.itemMissing;
                    }
                    // Update the msgStatus / msgSendToStatus and msgPriorStatus
                    // token/access key
                    const userToken = this.$auth.getToken();
                    // Meteor method
                    if( userToken ) {
                        Meteor.call( 'saveMessage', msgItem, itemId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage   = true;
                                this.pageMessage = `${result.code}: ${result.value}`;
                            }
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = 'Please login';
                    }
                }
            },
            removeMsg( item ) {
                // TODO: consider activating permanent removal of messages
                const userToken = this.$auth.getToken();
                if( confirm( this.$message.confirmDelete ) ) {
                    const itemId = item._id;
                    if( !itemId ) {
                        this.isMessage   = false;
                        this.pageMessage = mcMessage.itemMissing;
                    }
                    // Meteor method
                    if( userToken ) {
                        Meteor.call( 'removeMessage', itemId, userToken, ( error, result ) => {
                                if( error ) {
                                    this.isMessage   = true;
                                    this.pageMessage = `${error}: Error deleting item. Please retry`;
                                }
                                this.isMessage   = true;
                                this.pageMessage = `${result.code}: ${result.value}`;
                            }
                        )
                        ;
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = 'Please login';
                    }
                }
            },
            updateItems( items ) {
                // update multiple selected items

            },
            deleteItems( items ) {
                // delete multiple selected items

            }
        },
        created() {
            this.msgStatus = this.$store.getters['central/getMsgListAction'];
            this.mcLabel = this.$label;
            // get the isAdmin status for the current user (set from the main Header)
            const userInfo = this.$store.getters['central/getCurrentUser'];
            if( userInfo ) {
                this.isAdmin = userInfo.isAdmin;
            }
            // Fetch items from the server, based on role assignment / authorization
            this.fetchData();
        },
        updated() {
            $( '#mcMsgList' ).DataTable({
                destroy     : true,
                "pagingType": "full_numbers",
            });
        }
    }
</script>
