<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.assignDetail}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="assignTodo">{{mcLabel.action}}</label>
                        <select class="form-control" v-model="assign.assignTodo" id="assignTodo" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.action}}</option>
                            <option v-for="item in todoItems" :value="item._id">
                                {{ item.todoName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.assignTodo}}</span>
                    </div>
                    <div class="form-group">
                        <label for="assignUser">{{mcLabel.assign}}</label>
                        <select class="form-control" v-model="assign.assignUser" id="assignUser" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.assign}}</option>
                            <option v-for="item in userItems" :value="item._id">
                                {{ item.profile.firstName }} {{item.profile.lastName}} | {{item.username}}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.assignUser}}</span>
                    </div>
                    <div class="form-group">
                        <label for="assignEffort">{{mcLabel.effort}}</label>
                        <input type="number" min="0.1" step="0.1" class="form-control" id="assignEffort"
                               :placeholder="mcLabel.effort" maxlength="25" required
                               v-model="assign.assignEffort">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.assignEffort}}</span>
                    </div>
                    <div class="form-group">
                        <label for="assignUnit">{{mcLabel.effortUnit}}</label>
                        <select class="form-control" v-model="assign.assignUnit" id="assignUnit" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.effortUnit}}</option>
                            <option v-for="item in assignUnits" :value="item._id">
                                {{item.codeName}}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.assignUnit}}</span>
                    </div>
                    <div class="form-group">
                        <label for="assignDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="assignDesc" cols="30" rows="5"
                                  :placeholder="mcLabel.desc" v-model="assign.assignDesc"></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.assignDesc}}</span>
                    </div>
                    <div class="form-group">
                        <label for="isActive">{{mcLabel.isActive}} </label>
                        <input class="w3-check" type="checkbox" id="isActive" v-model="assign.isActive">
                        <button class="btn btn-primary" @click.prevent="saveAssign">{{mcLabel.save}}</button>
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
    import { Session } from 'meteor/session';
    import { validateAssign } from'/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';
    const moment = require( 'moment' );

    export default{
        name      : 'assignmentDetail',
        components: {},
        data() {
            return {
                mcLabel       : {},
                langItems     : [],
                codeItems     : [],
                todoItems     : [],
                userItems     : [],
                assign        : {
                    assignTodo  : '',
                    assignUser  : '',
                    assignEffort: 1.0,
                    assignUnit  : '',
                    assignDesc  : '',
                    isActive    : false
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
            assignTodos() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Organization';
                } );
            },
            assignUsers() {
                return this.locationItems.filter( ( item ) => {
                    return ((item.locationType === 'State' || item.locationType === 'Province') && (item.parentId === this.org.orgCountry));
                } );
            },
            assignUnits(){
                // id of the sub-category - 'Effort Measure'
                const subItem = this.codeItems.find((item) => {
                    return item.codeName === 'Effort';
                    });
                if (subItem) {
                    return this.codeItems.filter( ( item ) => {
                            return (item.codeCat === 'Measurement' && item.parentId === subItem._id);
                } );
                }
            },
        },
        methods   : {
            // Retrieve/get current item/record from the the server/database
            saveAssign() {
                // validate inputs:
                this.assign.assignEffort = Number( this.assign.assignEffort );

                const errors = validateAssign( this.assign );
                if( errors.assignTodo || errors.assignUser ) {
                    this.validateErrors = errors;
                }
                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveAssign', this.assign, this.itemId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage   = true;
                                // capture new/updated record itemId
                                if( result.code === 'inserted' || result.code === 'updated' ) {
                                    this.itemId = result.docId;
                                }
                                this.pageMessage = `${result.code}: ${result.value}`;
                            }
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = 'inputs-errors: ' + JSON.stringify(errors);
                    }
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Please login';
                }
            },
        },
        created(){
            // token
            const userToken     = this.$auth.getToken(),
                  queryParams   = {},
                  currentItemId = '';
            this.mcLabel        = this.$label;
            if( Session.get( 'currentAssignItem' ) ) {
                const item  = Session.get( 'currentAssignItem' );
                this.itemId = item._id;
                this.assign = {
                    assignTodo  : item.assignTodo,
                    assignUser  : item.assignUser,
                    assignEffort: item.assignEffort,
                    assignUnit  : item.assignUnit,
                    assignDesc  : item.assignDesc,
                    isActive    : item.isActive,
                };
            } else {
                this.itemId = '';
                this.assign = {
                    assignTodo  : '',
                    assignUser  : '',
                    assignEffort: 1.0,
                    assignUnit  : '',
                    assignDesc  : '',
                    isActive    : false
                };
            }
            Meteor.call( 'getAllLang', ( error, result ) => {
                if( error ) {
                    this.isMessage   = true;
                    this.pageMessage = 'LanguageError: Retry.';
                } else if( result.code === 'success' ) {
                    this.isMessage   = false;
                    this.pageMessage = 'Items available';
                    this.langItems   = _.sortBy( result.value, 'langName' ).filter( ( item ) => {
                        return item.isActive === true;
                    } );
                } else {
                    this.isMessage   = true;
                    this.pageMessage = `${result.code}: ${result.value}`;
                }
            } );
            if( userToken ) {
                // todos
                Meteor.call( 'getTodo', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'TodoError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.todoItems   = _.sortBy( result.value, 'todoName' );
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
                    } else if( result.code === 'success') {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.userItems   = _.sortBy( result.value, 'username' );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } ) ;
                // get standard code items
                Meteor.call( 'getCode', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'CodeError: Retry.';
                    } else if( result.code === 'success'
                    ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.codeItems   = _.sortBy( result.value, 'codeName' ).filter( ( item ) => {
                            return item.isActive === true;
                        } );
                    }
                    else {
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
