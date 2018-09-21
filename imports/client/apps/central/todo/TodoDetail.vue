<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.todoDetail}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="todoName">{{mcLabel.title}}</label>
                        <input type="text" class="form-control" id="todoName"
                               :placeholder="mcLabel.title" maxlength="64" required autofocus
                               v-model="todo.todoName">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.todoName}}</span>
                    </div>
                    <div class="form-group">
                        <label for="todoDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="todoDesc" cols="30" rows="5"
                                  :placeholder="mcLabel.desc" v-model="todo.todoDesc" required></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.todoDesc}}</span>
                    </div>
                    <div class="form-group">
                        <label for="todoStart">{{mcLabel.startDate}}</label>
                        <input type="date" class="form-control" id="todoStart"
                               :placeholder="mcLabel.startDate" maxlength="25" v-model="todo.todoStart">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.todoStart}}</span>
                    </div>
                    <div class="form-group">
                        <label for="todoEnd">{{mcLabel.endDate}}</label>
                        <input type="date" class="form-control" id="todoEnd"
                               :placeholder="mcLabel.endDate" maxlength="25" v-model="todo.todoEnd">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.todoEnd}}</span>
                    </div>
                    <div class="form-group">
                        <label for="todoAssignment">{{mcLabel.assign}}</label>
                        <input type="text" class="form-control" id="todoAssignment"
                               :placeholder="mcLabel.assign" maxlength="255" required
                               v-model="todo.todoAssignment">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.todoAssignment}}</span>
                    </div>
                    <div class="form-group">
                        <label for="todoUpdate">{{mcLabel.remark}}</label>
                        <textarea class="form-control" id="todoUpdate" cols="30" rows="5"
                                  :placeholder="mcLabel.remark" v-model="todo.todoUpdate" required></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.todoUpdate}}</span>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="todoType">{{mcLabel.type}}</label>
                        <select class="form-control" v-model="todo.todoType" id="todoType" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.type}}</option>
                            <option v-for="item in todoTypes" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.todoType}}</span>
                    </div>
                    <div class="form-group">
                        <label for="todoParent">{{mcLabel.partOf}}</label>
                        <select class="form-control" v-model="todo.parentId" id="todoParent">
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.parent}}</option>
                            <option v-for="item in parentItems" :value="item._id">
                                {{ item.todoName }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="todoService">{{mcLabel.service}}</label>
                        <select class="form-control" v-model="todo.todoService" id="todoService" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.service}}</option>
                            <option v-for="item in serviceItems" :value="item._id">
                                {{ item.serviceName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.todoService}}</span>
                    </div>
                    <div class="form-group">
                        <label for="todoLikelihood">{{mcLabel.like}}</label>
                        <select class="form-control" v-model="todo.todoLikelihood" id="todoLikelihood" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.like}}</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.todoLikelihood}}</span>
                    </div>
                    <div class="form-group">
                        <label for="todoImpact">{{mcLabel.impact}}</label>
                        <select class="form-control" v-model="todo.todoImpact" id="todoImpact" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.impact}}</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.todoImpact}}</span>
                    </div>
                    <div class="form-group">
                        <label for="todoStatus">{{mcLabel.status}}</label>
                        <select class="form-control" v-model="todo.todoStatus" id="todoStatus" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.status}}</option>
                            <option v-for="item in todoStatuses" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.todoStatus}}</span>
                    </div>
                    <div class="form-group">
                        <label for="todoLang">{{mcLabel.lang}}</label>
                        <select class="form-control" v-model="todo.todoLang" id="todoLang" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                            <option v-for="item in langItems" :value="item.langCode">
                                {{ item.langName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.todoLang}}</span>
                    </div>
                    <div class="form-group">
                        <label for="isActive">{{mcLabel.isActive}} </label>
                        <input class="w3-check" type="checkbox" id="isActive" v-model="todo.isActive">
                        <button class="btn btn-primary" @click.prevent="saveTodo">{{mcLabel.save}}</button>
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
    import { validateTodo } from '/imports/lib/utils/ValidateRecord';

    const moment = require( 'moment' );

    export default {
        name      : 'todoDetail',
        components: {},
        data() {
            return {
                mcLabel       : {},
                langItems     : [],
                codeItems     : [],
                serviceItems  : [],
                todoItems     : [],
                todo          : {
                    todoName      : '',
                    todoDesc      : '',
                    todoType      : '',
                    todoService   : '',
                    parentId      : '',
                    todoLikelihood: '',
                    todoImpact    : '',
                    todoAssignment: '',
                    todoStart     : this.formatDate( Date.now() ),
                    todoEnd       : this.formatDate( Date.now() ),
                    todoUpdate    : '',
                    todoStatus    : '',
                    todoLang      : this.$constant.getDefaultLanguage(),
                    isActive      : false
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
            // Lookup parents-items, for existing records owner only
            parentItems() {
                switch( this.todo.todoType ) {
                    case 'Issue':
                    case 'Risk':
                    case 'Task':
                        return this.todoItems.filter( ( item ) => {
                            return ((item._id !== this.itemId) && (item.todoType === 'Project' || item.todoType === 'Program' || item.todoType === 'Portfolio' || item.todoType === 'Operations' || item.todoType === this.todo.todoType));
                        } );
                        break;
                    case 'Project':
                        return this.todoItems.filter( ( item ) => {
                            return ((item._id !== this.itemId) && (item.todoType === 'Program' || item.todoType === 'Portfolio' || item.todoType === this.todo.todoType));
                        } );
                        break;
                    case 'Program':
                    case 'Operations':
                        return this.todoItems.filter( ( item ) => {
                            return ((item._id !== this.itemId) && (item.todoType === 'Portfolio' || item.todoType === this.todo.todoType));
                        } );
                        break;
                    default:
                        return this.todoItems.filter( ( item ) => {
                            return ((item._id !== this.itemId) && (item.todoType === this.todo.todoType));
                        } );
                        break;
                }
            },
            todoTypes() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Todos';
                } );
            },
            todoLikes() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Industry';
                } );
            },
            todoStatuses() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Status';
                } );
            },
        },
        methods   : {
            formatDate( date ) {
                return this.$mo( date ).format( "YYYY-MM-DD" );
            },
            // Retrieve/get current item/record from the the server/database
            saveTodo() {
                // validate inputs:
//                this.todo.todoStart = new Date( this.todo.todoStart );
//                this.todo.todoEnd   = new Date( this.todo.todoEnd );

                const errors = validateTodo( this.todo );
                if( errors.todoName || errors.todoDesc || errors.todoType || errors.todoLang || errors.todoUpdate ) {
                    this.validateErrors = errors;
                }
                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveTodo', this.todo, this.itemId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage = true;
                                // capture new/updated record itemId
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
            if( Session.get( 'currentTodoItem' ) ) {
                const item  = Session.get( 'currentTodoItem' );
                this.itemId = item._id;
                this.todo   = {
                    todoName      : item.todoName,
                    todoDesc      : item.todoDesc,
                    todoType      : item.todoType,
                    todoService   : item.todoService,
                    parentId      : item.parentId,
                    todoLikelihood: item.todoLikelihood,
                    todoImpact    : item.todoImpact,
                    todoAssignment: item.todoAssignment,
                    todoStart     : this.formatDate( item.todoStart ),
                    todoEnd       : this.formatDate( item.todoEnd ),
                    todoUpdate    : item.todoUpdate,
                    todoStatus    : item.todoStatus,
                    todoLang      : item.todoLang,
                    isActive      : item.isActive,
                };
            } else {
                this.itemId = '';
                this.todo   = {
                    todoName      : '',
                    todoDesc      : '',
                    todoType      : '',
                    todoService   : '',
                    parentId      : '',
                    todoLikelihood: '',
                    todoImpact    : '',
                    todoAssignment: '',
                    todoStart     : this.formatDate(Date.now()),
                    todoEnd       : this.formatDate(Date.now()),
                    todoUpdate    : '',
                    todoStatus    : '',
                    todoLang      : this.$constant.getDefaultLanguage(),
                    isActive      : false,
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
                // todos
                Meteor.call( 'getTodo', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'TodoError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.todoItems   = this.$lo.sortBy( result.value, 'todoName' );
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
                // services
                Meteor.call( 'getService', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'ServiceError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage    = false;
                        this.pageMessage  = 'Items available';
                        this.serviceItems = this.$lo.sortBy( result.value, 'serviceName' ).filter( ( item ) => {
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
    }
</script>
