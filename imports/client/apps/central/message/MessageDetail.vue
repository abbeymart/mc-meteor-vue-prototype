<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.msgDetail}}</h4>
        </div>
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <div v-if="isRead">
            <h4>{{mcLabel.msgRead}}</h4>
            <!--Display message to reply to, TODO: localize labels-->
            <p>
                <b>From: </b> {{readItem.msgSender}} | <b>Subject: </b>{{readItem.msgTitle}} | <b>Dated: </b>{{readItem.updatedDate}}
            </p>
            <p>
                <b>To: </b> {{readItem.msgReceiver}} | <b>{{mcLabel.cat}}: </b>{{readItem.msgCat}} | <b>Privacy: </b>{{privacyName(readItem.msgPrivacy)}}
            </p>
            <p>
                <span v-if="readItem.parentId"><b>{{mcLabel.parent}}: </b> {{msgParentName(readItem.parentId)}} | </span><b>{{mcLabel.status}}: </b>{{readItem.msgStatus}}
            </p>
            <div>
                <label for="readMsg">{{mcLabel.body}}</label>
                <!--TODO: convert msgBody to plain text for display only-->
                <textarea class="form-control" id="readMsg" cols="30" rows="5"
                          :placeholder="mcLabel.body" :value="readItem.msgBody" disabled></textarea>
            </div>
        </div>
        <div v-if="isReply">
            <!--Display message to reply to, TODO: localize labels-->
            <h4>{{mcLabel.msgReply}}</h4>
            <p><b>Reply To: </b> {{replyItem.msgSender}} | <b>Subject: </b>{{replyItem.msgTitle}} | <b>Dated: </b>{{replyItem.updatedDate}}
            </p>
            <div>
                <label for="replyMsg">{{mcLabel.body}}</label>
                <!--TODO: convert msgBody to plain text for display only-->
                <textarea class="form-control" id="replyMsg" cols="30" rows="5"
                          :placeholder="mcLabel.body" :value="replyItem.msgBody" disabled></textarea>
            </div>
            <div>
                <h4>Reply Section (below)</h4>
            </div>
        </div>
        <form v-if="!isRead" class="w3-margin-8">
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="msgTitle">{{mcLabel.title}}</label>
                        <input type="text" class="form-control" id="msgTitle"
                               :placeholder="mcLabel.title" maxlength="255" required autofocus
                               v-model="msg.msgTitle">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.msgTitle}}</span>
                    </div>
                    <div class="form-group">
                        <label for="msgSender">{{mcLabel.from}}: {{currentUsername}}</label>
                        <input type="text" class="form-control" id="msgSender"
                               :placeholder="mcLabel.from" maxlength="255"
                               :value="currentUsername" disabled>
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.msgSender}}</span>
                    </div>
                    <div class="form-group">
                        <label for="msgCat">{{mcLabel.cat}}</label>
                        <select class="form-control" v-model="msg.msgCat" id="msgCat" v-on:change="msgAdmin" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.cat}}</option>
                            <option v-for="item in msgCategories" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.msgCat}}</span>
                    </div>
                    <!--Activate for email/chat only, from msgCat-->
                    <div v-if="!isMsgAdmin" class="form-group">
                        <label for="msgReceiver">{{mcLabel.to}}</label>
                        <select class="form-control" v-model="msg.msgReceiver" id="msgReceiver" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.to}}</option>
                            <option v-for="item in userItems" :value="item._id">
                                {{item.username}} | {{ item.profile.firstName }} {{item.profile.lastName}}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.msgReceiver}}</span>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="msgStatus">{{mcLabel.status}}</label>
                        <input type="text" class="form-control" id="msgStatus"
                               :placeholder="mcLabel.status" maxlength="255" required
                               :value="msg.msgStatus || msgStatus" disabled>
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.msgStatus}}</span>
                    </div>
                    <div class="form-group">
                        <label for="msgPrivacy">{{mcLabel.privacy}}</label>
                        <select class="form-control" v-model="msg.msgPrivacy" id="msgPrivacy" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.privacy}}</option>
                            <option v-for="item in msgPrivacies" :value="item._id">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.msgPrivacy}}</span>
                    </div>
                    <div class="form-group">
                        <label for="msgLang">{{mcLabel.lang}}</label>
                        <select class="form-control" v-model="msg.msgLang" id="msgLang" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                            <option v-for="item in langItems" :value="item.langCode">
                                {{ item.langName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.msgLang}}</span>
                    </div>
                    <!--active for existing message with Parent item (for reply)-->
                    <div v-if="msg.parentId" class="form-group">
                        <label for="msgParent">{{mcLabel.parent}}</label>
                        <input type="text" class="form-control" id="msgParent"
                               :placeholder="mcLabel.parent" maxlength="255"
                               :value="msgParentName(msg.parentId)" disabled>
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.parentId}}</span>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-group">
                    <label for="msgBody">{{mcLabel.msgBody}}</label>
                    <div class="row">
                        <div class="form-control" id="msgBody">
                            {{mcLabel.msgDetail}}
                        </div>
                    </div>
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.msgBody}}</span>
                </div>
                <div class="form-group">
                    <label for="msgDesc">{{mcLabel.desc}}</label>
                    <textarea class="form-control" id="msgDesc" cols="30" rows="5"
                              :placeholder="mcLabel.desc" v-model="msg.msgDesc" required></textarea>
                    <span v-if="validateErrors" class="alert-warning">{{validateErrors.msgDesc}}</span>
                </div>
                <div class="form-group">
                    <div>
                        <label for="isActive">{{mcLabel.isActive}} </label>
                        <input class="w3-check" type="checkbox" id="isActive" v-model="msg.isActive">
                    </div>
                    <!--Display save button for all except for msgReadStatus-->
                    <div>
                        <button v-if="!isRead" class="btn btn-primary" @click.prevent="saveMsg('Draft')">
                            {{mcLabel.save}}
                        </button>
                        <!--Send message button for new / draft / reply messages-->
                        <button v-if="isSend" class="btn btn-primary" @click.prevent="saveMsg('Sent')">
                            {{mcLabel.send}}
                        </button>
                        <!--Send Reply button for msgReplyStatus-->
                        <!--<button v-if="isReply" class="btn btn-primary" @click.prevent="saveMsg('Replied')">-->
                        <!--{{mcLabel.reply}}-->
                        <!--</button>-->
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<style>

</style>
<script>
    // View components, locales...
    import { Meteor } from 'meteor/meteor';
    import { validateMessage } from '/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    const sanitizeHtml = require( 'sanitize-html' );

    export default {
        name    : 'msgDetail',
        data() {
            return {
                mcLabel        : {},
                langItems      : [],
                codeItems      : [],
                userItems      : [],
                msgItems       : [],
                msg            : {
                    msgTitle       : '',
                    msgBody        : '',
                    msgDesc        : '',
                    msgCat         : '',
                    msgStatus      : '',
                    msgSendToStatus: '',
                    msgPriorStatus : '',
                    msgPrivacy     : '',
                    msgSender      : '',
                    msgReceiver    : '',
                    msgLang        : 'en-US',
                    parentId       : '',
                    isActive       : false
                },
                pageMessage    : '',
                isMessage      : false,
                isReadReply    : false,
                isDraft        : false,
                isRead         : false,
                isSend         : false,
                isReply        : false,
                isUpdate       : false,
                isMsgAdmin     : false,
                hasParent      : false,
                msgStatus      : '',
                currentUsername: '',
                currentSender  : '',
                currentReceiver: '',
                replyItem      : '',
                readItem       : '',
                itemId         : '',
                itemParams     : '',
                itemParamId    : '',
                validateErrors : '',
            }
        },
        computed: {
            // Lookup parents-items, by solution hierarchy (solution-packageGroup-package-function...)
            parentItems() {
                return this.msgItems.filter( ( item ) => {
                    return ((item._id !== this.itemId) && (item.msgCat === this.msg.msgCat));
                } );
            },
            msgStatuses() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Message Status';
                } );
            },
            msgPrivacies() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Message Privacy';
                } );
            },
            msgTypes() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Message Type';
                } );
            },
            msgCategories() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Message';
                } );
            },
        },
        methods : {
            msgAdmin() {
                if( this.msg.msgCat === 'Feedback' || this.msg.msgCat === 'Request' ) {
                    this.isMsgAdmin = true;
                    return true;
                } else {
                    this.isMsgAdmin = false;
                    return false;
                }
            },
            msgParent() {
                const currentItem = this.$store.getters[ 'central/getMsgItem' ];
                return !!(currentItem && currentItem.parentId);

            },
            msgParentName( itemId ) {
                const parentItem = this.msgItems.find( ( item ) => {
                    return item._id === itemId;
                } );
                return parentItem ? parentItem.msgTitle : 'n/a'
            },
            catName( itemId ) {
                const catName = _.find( this.codeItems, { _id: itemId } );
                return catName ? catName.codeName : 'n/a';
            },
            privacyName( itemId ) {
                const name = _.find( this.codeItems, { _id: itemId } );
                return name ? name.codeName : 'n/a';
            },
            // Retrieve/get current item/record from the the server/database
            saveMsg( actionType ) {
                /**
                 * Scenarios:
                 * DRAFT: New, Existing Draft and Replied messages (msgStatus: Draft)
                 * SENT: New, Existing Draft and Replied messages (msgStatus: Sent)
                 * Received message: will have msgReceived status of New
                 */

                    // Capture prior msgAction, mainly for a replied message
                const priorMsgAction = this.$store.getters[ 'central/getMsgAction' ];

                // Set success messages for the action types
                let msgSaveAction = '';
                if( actionType === 'Draft' ) {
                    msgSaveAction = 'New / draft message saved successfully';
                }
                if( actionType === 'Sent' ) {
                    msgSaveAction = 'Message sent successfully';
                }
                if( actionType === 'Replied' ) {
                    msgSaveAction = 'Reply sent successfully';
                }

                // Set message receiver depending on the message category (msgCat)
                let currentMsgReceiver = '';
                const msgCat           = this.msg.msgCat;
                if( msgCat === 'Chat' || msgCat === 'Email' ) {
                    currentMsgReceiver = this.msg.msgReceiver;
                } else {
                    // Mail-box for contact, feedback or request messages (sys-admin mailbox)
                    currentMsgReceiver = 'Admin';
                }

                // Message parameters: sender(msgSentFromStatus), receiver (msgSentToStatus) and msgParent (for reply)
                let msgSendFromStatus = actionType || '',
                    msgSendToStatus   = '',
                    msgParent         = '',
                    itemId            = '';

                // DRAFT: New/insert (message / reply) & Existing/update (draft / replied) messages
                if( actionType === 'Draft' ) {
                    // New draft message, itemId = ''
                    msgSendFromStatus = actionType;
                    // For a new replied message, set the msgParentId and itemId =''
                    const replyItem   = this.$store.getters[ 'central/getReplyMsgItem' ];
                    if( priorMsgAction === 'Replied' && replyItem ) {
                        msgParent          = replyItem.parentId;
                        currentMsgReceiver = replyItem.msgSender;
                        itemId             = '';
                    }
                    // Existing draft message (new or replied), with itemId set
                    const msgItem = this.$store.getters[ 'central/getMsgItem' ];
                    if( msgItem ) {
                        itemId = msgItem._id || this.itemId;
                    }
                    // For an existing draft-replied message (not sent), covered by existing draft scenario
//                    if( Session.get( 'currentMsgItem' ) && this.msg.parentId ) {
//                        itemId = Session.get( 'currentMsgItem' )._id || this.itemId;
//                    }
                }

                // SENT: New, Existing Draft and Replied messages (msgStatus: Sent)
                if( actionType === 'Sent' ) {
                    // Send a new message (no draft), itemId = ''
                    if( this.itemId === '' ) {
                        msgSendToStatus   = 'New';
                        msgSendFromStatus = 'Sent';
                    }
                    // Send an existing draft (new)
                    const msgItem   = this.$store.getters[ 'central/getMsgItem' ],
                          replyItem = this.$store.getters[ 'central/getReplyMsgItem' ],
                          msgStatus = this.msg.Status;
                    if( msgItem && msgStatus === 'Draft' ) {
                        msgSendToStatus   = 'New';
                        msgSendFromStatus = 'Sent';
                        itemId            = msgItem._id || this.itemId;
                        // Send an existing draft (reply)... redundant?
                        if( this.msg.parentId ) {
                            msgParent = this.msg.parentId;
                        }
                    }
                    // Send a new-reply, itemId = ''
                    if( priorMsgAction === 'Replied' && replyItem ) {
                        msgParent          = replyItem.parentId;
                        msgSendToStatus    = 'New';
                        msgSendFromStatus  = 'Sent';
                        currentMsgReceiver = replyItem.msgSender;
                    }
                }

                // adjust inputs based on the current scenario
                this.msg.msgStatus       = msgSendFromStatus;
                this.msg.msgSendToStatus = msgSendToStatus;
                this.msg.msgPriorStatus  = '';
                this.msg.msgSender       = this.$store.getters[ 'central/getCurrentUser' ]._id;
                this.msg.msgReceiver     = currentMsgReceiver;
                this.msg.parentId        = msgParent;

                // validate inputs:
                // description/message body sanitation
                this.msg.msgBody = sanitizeHtml( $( '#msgBody' ).summernote( 'code' ) );
                // @TODO: update validation step, if msgStatus = Sent / Replied, msgSendToStatus is required
                let errors       = validateMessage( this.msg );
                if( errors.msgTitle || errors.msgBody || errors.msgCat || errors.msgStatus || errors.msgSender || errors.msgLang ) {
                    this.validateErrors = errors;
                }
                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveMessage', this.msg, itemId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage = true;
                                // capture new record itemId
                                if( result.code === 'inserted' || result.code === 'updated' ) {
                                    this.itemId = result.docId;
                                }
                                this.pageMessage = `${result.code}: ${result.value}`;
                            }
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = 'inputs-errors: ' + JSON.stringify( errors );
                    }
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Please login';
                }
            },
        },
        created() {
            // token
            const userToken     = this.$auth.getToken(),
                  queryParams   = {},
                  currentItemId = '';
            this.mcLabel        = this.$label;
            // New or draft message
            const item          = this.$store.getters[ 'central/getMsgItem' ],
                  readItem      = this.$store.getters[ 'central/getReadMsgItem' ],
                  replyItem     = this.$store.getters[ 'central/getReplyMsgItem' ];
            if( item ) {
                this.itemId = item._id;
                this.msg    = {
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
                // Replied message
            } else if( replyItem ) {
                this.replyItem = replyItem;
                this.isReply   = true;
            } else if( readItem ) {
                this.readItem = readItem;
                this.isRead   = true;
            } else {
                this.itemId = '';
                this.msg    = {
                    msgTitle       : '',
                    msgBody        : '',
                    msgDesc        : '',
                    msgCat         : '',
                    msgStatus      : '',
                    msgSendToStatus: '',
                    msgPriorStatus : '',
                    msgPrivacy     : '',
                    msgSender      : '',
                    msgReceiver    : '',
                    msgLang        : 'en-US',
                    parentId       : '',
                    isActive       : false
                };
            }

            Meteor.call( 'getAllLang', ( error, result ) => {
                if( error ) {
                    this.isMessage   = true;
                    this.pageMessage = 'LanguageError: Retry.';
                } else if( result.code === 'success' ) {
                    this.isMessage   = false;
                    this.pageMessage = 'Items available';
                    this.langItems   = this.$lo.sortBy( result.value, 'langName' ).filter( ( item ) => {
                        return item.isActive === true;
                    } );
                } else {
                    this.isMessage   = true;
                    this.pageMessage = `${result.code}: ${result.value}`;
                }
            } );
            if( userToken ) {
                //currentSender
                if( item ) {
                    const userId = item.msgSender;
                    Meteor.call( 'findUser', userId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'UserError, Retry: ' + error;
                        } else if( result.code === 'success' ) {
                            this.isMessage     = false;
                            this.pageMessage   = 'Item available';
                            const userInfo     = result.value;
                            this.currentSender = `${userInfo.username} | ${userInfo.profile.firstName} ${userInfo.profile.lastName}`;
                        } else {
                            this.isMessage   = true;
                            this.pageMessage = `${result.code}: ${result.value}`;
                        }
                    } );
                }
                // messages
                Meteor.call( 'getMessage', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'MessageError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.msgItems    = this.$lo.sortBy( result.value, 'msgTitle' );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
                // user(s)
                Meteor.call( 'getUser', userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'UserError, Retry: ' + error;
                    } else if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.userItems   = this.$lo.sortBy( result.value, 'username' );
                    } else {
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

            // message action status
            const msgAction = this.$store.getters[ 'central/getMsgAction' ];
            if( msgAction ) {
                if( msgAction === 'Read' ) {
                    this.isRead      = true;
                    this.isReadReply = true;
                    this.msgStatus   = 'Read';
                } else if( msgAction === 'Draft' ) {
                    this.isDraft   = true;
                    this.isSend    = true;
                    this.isUpdate  = true;
                    this.msgStatus = 'Draft';
                } else if( msgAction === 'Sent' ) {
                    this.isSend    = true;
                    this.msgStatus = 'Sent';
                } else if( msgAction === 'Replied' ) {
                    this.isDraft     = true;
                    this.isSend      = true;
                    this.isReply     = true;
                    this.isReadReply = true;
                    this.msgStatus   = 'Replied';
                } else {
                    this.msgStatus = msgAction || '';
                }
            }

            // hasParent status
            if( item && item.parentId ) {
                this.hasParent = true;
            }

            // current user information / record
            const currentUser = this.$store.getters[ 'central/getCurrentUser' ];

            // currentUsername
            if( currentUser ) {
                this.currentUsername = `${currentUser.username} | ${currentUser.profile.firstName} ${currentUser.profile.lastName}`;
            }
            // currentReceiver
            if( item ) {
                const currentItem = item;
                if( currentItem.msgReceiver === 'Admin' ) {
                    return 'Admin';
                }
                if( currentUser && (currentItem.msgReceiver === currentUser._id) ) {
                    this.currentReceiver = `${currentUser.username} | ${currentUser.profile.firstName} ${currentUser.profile.lastName}`;
                }
            }
        },
        updated() {
            // summernote configuration
            $( "#msgBody" ).summernote( {
                height     : 300,
                lineHeight : 20,
                minHeight  : 100,
                placeholder: this.mcLabel.msgDetail
            } );
            // summernote value setting (as 'code')
            $( "#msgBody" ).summernote( 'code', this.msg.msgBody );
        }
    }
</script>
