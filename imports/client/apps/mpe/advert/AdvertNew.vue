<template>
    <div>

    </div>
</template>
<style>

</style>
<script>
    import { Meteor } from 'meteor/meteor';
    import { Session } from 'meteor/session';

    export default{
        name      : 'advertNew',
        data(){
            return {
                searchCat: '',
            }
        },
        components: {

        },
        created() {
            if( Session.get( 'mcSearchCat' ) ) {
                this.searchCat = Session.get( 'mcSearchCat' );
            }
        },
        updated(){
//            if( Session.get( 'mcSearchCat' ) ) {
//                this.searchCat = Session.get( 'mcSearchCat' );
//            }
        }
    }
</script>