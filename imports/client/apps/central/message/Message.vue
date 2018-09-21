<template>
    <!--Rebuild / simplify the message package-->
    <div class="w3-container">
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <ul class="nav nav-pills w3-lightgrey">
            <li class="mcBlockLink" style="display: block;">
                <h4>{{mcLabel.msgs}} &raquo;&raquo;</h4>
            </li>
            <li class="mcBoldLink"><a href="#" @click.prevent="listMsg">{{mcLabel.list}}</a></li>
            <!--<li v-if="isItem" class="mcBoldLink"><a href="#">{{mcLabel.update}}</a></li>-->
            <li class="mcBoldLink"><a href="#" @click.prevent="newItem">{{mcLabel.msgNew}}</a></li>
            <li class="w3-dropdown-hover">
                <a href="#" class="mcBoldLink">
                    <i class="glyphicon glyphicon-briefcase" style="color: tomato"></i>
                    {{mcLabel.msg}}
                    <span class="caret"/>
                </a>
                <!--dropdown list-->
                <div class="w3-dropdown-content w3-white w3-card-4 w3-round-medium">
                    <div>
                        <a href="#" @click.prevent="newMsg">{{mcLabel.msgsListNew}}</a>
                    </div>
                    <div>
                        <a href="#" @click.prevent="inMsg">{{mcLabel.msgsListInbox}}</a>
                    </div>
                    <div>
                        <a href="#" @click.prevent="draftMsg">{{mcLabel.msgsListDraft}}</a>
                    </div>
                    <div>
                        <a href="#" @click.prevent="sentMsg">{{mcLabel.msgsListSent}}</a>
                    </div>
                    <div>
                        <a href="#" @click.prevent="deletedMsg">{{mcLabel.msgsListDeleted}}</a>
                    </div>
                </div>
            </li>
        </ul>
        <div>
            <router-view class="w3-animate-left"></router-view>
        </div>
    </div>
</template>
<style>

</style>
<script>
    export default {
        name      : 'msg',
        components: {},
        data() {
            return {
                mcLabel     : this.$label,
                currentItems: '',
                isMessage   : false,
                pageMessage : '',
                isItem      : false,
            }
        },
        methods   : {
            newItem() {
                // reset isItem to false and reset currentMsgItem, for new item
                this.isItem = false;
                this.$store.dispatch('central/setMsgItem', '');
                // Session.set( 'currentMsgItem', '' );
                // Reset msgListAction and set the msgAction as "Draft"
                this.$store.dispatch('central/setMsgListAction', {msgListAction: ''});
                this.$store.dispatch('central/setMsgAction', {msgAction: ''});
                // Session.set( 'msgListAction', '' );
                // Session.set( 'msgAction', 'Draft' );
                // toggle new / detail page: if new, goto detailPage || if detail, goto newPage
                // get the current URL path (last/ending path-name, endswith* .../new or .../detail
                const pathLoc              = document.location;
                const { parts, lastIndex } = this.$utils.currentUrlInfo( pathLoc );

                // go to the new/detail page
                if( parts[ lastIndex ] === 'new' ) {
                    this.$router.push( { name: 'msgDetail' } );
                } else {
                    this.$router.push( { name: 'msgNew' } );
                }
            },
            listMsg() {
                this.$store.dispatch('central/setMsgListAction', {msgListAction: ''});
                this.$router.push( { name: 'mainMsgList' } );
            },
            updateMsg() {
                this.$store.dispatch('central/setMsgListAction', {msgListAction: ''});
                this.$router.push( { name: 'msgDetail' } );
            },
            newMsg() {
                this.$store.dispatch('central/setMsgListAction', {msgListAction: 'New'});
                this.$router.push( { name: 'newMsgList' } );
            },
            inMsg() {
                this.$store.dispatch('central/setMsgListAction', {msgListAction: 'Inbox'});
                this.$router.push( { name: 'inboxMsgList' } );
            },
            draftMsg() {
                this.$store.dispatch('central/setMsgListAction', {msgListAction: 'Draft'});
                this.$router.push( { name: 'draftMsgList' } );
            },
            sentMsg() {
                this.$store.dispatch('central/setMsgListAction', {msgListAction: 'Sent'});
                this.$router.push( { name: 'sentMsgList' } );
            },
            deletedMsg() {
                this.$store.dispatch('central/setMsgListAction', {msgListAction: 'Deleted'});
                this.$router.push( { name: 'deletedMsgList' } );
            },
        },
        created() {
            // this.mcLabel = this.$label;
            this.isItem = !!this.$store.getters['central/getMsgItem'];
        },
        updated() {
            // if update-item, set new tab label to Update
            this.isItem = !!this.$store.getters['central/getMsgItem'];
        },
    }
</script>
