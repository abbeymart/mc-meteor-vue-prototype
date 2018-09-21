<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.actLevelDetail}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="act">{{mcLabel.activity}}</label>
                        <select class="form-control" v-model="actLevel.act" id="act" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.activity}}</option>
                            <option v-for="item in actItems" :key="item._id" :value="item._id">
                                {{ item.actTitle }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.act}}</span>
                    </div>
                    <div class="form-group">
                        <label for="level">{{mcLabel.level}}</label>
                        <select class="form-control" v-model="actLevel.level" id="level" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.level}}</option>
                            <option v-for="item in actLevels" :key="item._id" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.act}}</span>
                    </div>
                    <div class="form-group">
                        <label for="group">{{mcLabel.group}}</label>
                        <select class="form-control" v-model="actLevel.group" id="group" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.group}}</option>
                            <option v-for="item in actGroups" :key="item._id" :value="item._id">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.group}}</span>
                    </div>
                    <div class="form-group">
                        <label for="scope">{{mcLabel.scope}}</label>
                        <select class="form-control" v-model="actLevel.scope" id="scope" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.scope}}</option>
                            <option v-for="item in actScopes" :key="item._id" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.group}}</span>
                    </div>
                    <div class="form-group">
                        <label for="desc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="desc" cols="80" rows="5"
                                  :placeholder="mcLabel.desc" v-model="actLevel.desc"></textarea>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.desc}}</span>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div>
                        <div>
                            <div class="form-group col-sm-6">
                                <label for="canBuy">{{mcLabel.buy}} </label>
                                <input class="w3-check" type="checkbox" id="canBuy" v-model="actLevel.canBuy">
                            </div>
                            <div class="form-group col-sm-6">
                                <label for="canSell">{{mcLabel.sell}} </label>
                                <input class="w3-check" type="checkbox" id="canSell" v-model="actLevel.canSell">
                            </div>
                        </div>
                        <div>
                            <div class="form-group col-sm-6">
                                <label for="canRequest">{{mcLabel.request}} </label>
                                <input class="w3-check" type="checkbox" id="canRequest" v-model="actLevel.canRequest">
                            </div>
                            <div class="form-group col-sm-6">
                                <label for="canInform">{{mcLabel.inform}} </label>
                                <input class="w3-check" type="checkbox" id="canInform" v-model="actLevel.canInform">
                            </div>
                        </div>
                        <div>
                            <div class="form-group col-sm-6">
                                <label for="canContribute">{{mcLabel.contribute}} </label>
                                <input class="w3-check" type="checkbox" id="canContribute"
                                       v-model="actLevel.canContribute">
                            </div>
                            <div class="form-group col-sm-6">
                                <label for="canRecommend">{{mcLabel.recommend}} </label>
                                <input class="w3-check" type="checkbox" id="canRecommend"
                                       v-model="actLevel.canRecommend">
                            </div>
                        </div>
                        <div>
                            <div class="form-group col-sm-6">
                                <label for="canApprove">{{mcLabel.approve}} </label>
                                <input class="w3-check" type="checkbox" id="canApprove" v-model="actLevel.canApprove">
                            </div>
                            <div class="form-group col-sm-6">
                            </div>
                        </div>
                        <hr/>
                        <div>
                            <div class="form-group col-sm-6">
                                <label for="isActive">{{mcLabel.isActive}} </label>
                                <input class="w3-check" type="checkbox" id="isActive" v-model="actLevel.isActive">
                            </div>
                            <div class="form-group col-sm-6">
                                <button class="btn btn-primary" @click.prevent="saveActLevel">{{mcLabel.save}}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </form>
        <hr>
        <!--<span v-if="isMessage" class="alert-info">{{pageMessage}}</span>-->
    </div>
</template>

<style>

</style>
<script>
    // View components, locales...
    import { Meteor } from 'meteor/meteor';
    import { Session } from 'meteor/session';
    import { validateActLevel } from'/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    export default{
        name      : 'actLevelDetail',
        components: {},
        data() {
            return {
                mcLabel       : {},
                codeItems     : [],
                actItems      : [],
                actLevel      : {
                    act          : '',
                    level        : '',
                    group        : '',
                    scope        : '',
                    desc         : '',
                    canBuy       : false,
                    canSell      : false,
                    canRequest   : false,
                    canInform    : false,
                    canContribute: false,
                    canRecommend : false,
                    canApprove   : false,
                    isActive     : false,
                },
                pageMessage   : '',
                isMessage     : false,
                itemId        : '',
                itemParams    : '',
                itemParamId   : '',
                validateErrors: '',
            }
        },
        computed  : {
            actLevels(){
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Activity Level';
                } );
            },
            actGroups(){
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'User';
                } );
            },
            actScopes(){
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Activity Scope';
                } );
            },
        },
        methods   : {
            // Retrieve/get current item/record from the the server/database
            saveActLevel() {
                // validate inputs:
                const errors = validateActLevel( this.actLevel );
                if( errors.act || errors.level || errors.group || errors.desc ) {
                    this.validateErrors = errors;
                }
                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveActLevel', this.actLevel, this.itemId, userToken, ( error, result ) => {
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
                        this.pageMessage = 'inputs-errors: ' + errors;
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
            if( Session.get( 'currentActLevelItem' ) ) {
                const item    = Session.get( 'currentActLevelItem' );
                this.itemId   = item._id;
                this.actLevel = {
                    act          : item.act,
                    level        : item.level,
                    group        : item.group,
                    scope        : item.scope,
                    desc         : item.desc,
                    canBuy       : item.canBuy,
                    canSell      : item.canSell,
                    canRequest   : item.canRequest,
                    canInform    : item.canInform,
                    canContribute: item.canContribute,
                    canRecommend : item.canRecommend,
                    canApprove   : item.canApprove,
                    isActive     : item.isActive,
                };
            } else {
                this.itemId   = '';
                this.actLevel = {
                    act          : '',
                    level        : '',
                    group        : '',
                    scope        : '',
                    desc         : '',
                    canBuy       : false,
                    canSell      : false,
                    canRequest   : false,
                    canInform    : false,
                    canContribute: false,
                    canRecommend : false,
                    canApprove   : false,
                    isActive     : false,
                };
            }
            if( userToken ) {
                // get standard code items
                Meteor.call( 'getCode', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'CodeError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.codeItems   = _.sortBy( result.value, 'codeName' ).filter( ( item ) => {
                            return item.isActive === true;
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
                // activities
                Meteor.call( 'getAct', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'RoleError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.actItems    = result.value;
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
    }
</script>
