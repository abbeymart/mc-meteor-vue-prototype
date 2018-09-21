<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.groupLevelDetail}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="roleGroup">{{mcLabel.group}}</label>
                        <select class="form-control" v-model="role.roleGroup" id="roleGroup" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.group}}</option>
                            <option v-for="item in roleGroups" :key="item._id" :value="item._id">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.roleGroup}}</span>
                    </div>
                    <div class="form-group">
                        <label for="roleCat">{{mcLabel.cat}}</label>
                        <select class="form-control" v-model="role.roleCat" id="roleCat" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.cat}}</option>
                            <option v-for="item in roleCategories" :key="item._id" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.roleCat}}</span>
                    </div>
                    <div class="form-group">
                        <label for="roleService">{{mcLabel.service}}</label>
                        <select class="form-control" v-model="role.roleService" id="roleService" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.service}}</option>
                            <option v-for="item in roleServices" :key="item._id" :value="item._id">
                                {{ item.serviceName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.roleService}}</span>
                    </div>
                    <div class="form-group">
                        <div>
                            <div class="form-group col-sm-6">
                                <label for="isCreate">{{mcLabel.isCreate}} </label>
                                <input class="w3-check" type="checkbox" id="isCreate" v-model="role.roleCreate">
                            </div>
                            <div class="form-group col-sm-6">
                                <label for="isRead">{{mcLabel.isRead}} </label>
                                <input class="w3-check" type="checkbox" id="isRead" v-model="role.roleRead">
                            </div>
                        </div>
                        <div>
                            <div class="form-group col-sm-6">
                                <label for="isUpdate">{{mcLabel.isUpdate}} </label>
                                <input class="w3-check" type="checkbox" id="isUpdate" v-model="role.roleUpdate">
                            </div>
                            <div class="form-group col-sm-6">
                                <label for="isDelete">{{mcLabel.isDelete}} </label>
                                <input class="w3-check" type="checkbox" id="isDelete" v-model="role.roleDelete">
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="form-group">
                            <label for="roleDesc">{{mcLabel.desc}}</label>
                            <textarea class="form-control" id="roleDesc" cols="80" rows="5"
                                      :placeholder="mcLabel.desc" v-model="role.roleDesc"></textarea>
                            <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.roleDesc}}</span>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-6">
                                <label for="isActive">{{mcLabel.isActive}} </label>
                                <input class="w3-check" type="checkbox" id="isActive" v-model="role.isActive">
                            </div>
                            <div>
                                <button class="btn btn-primary" @click.prevent="saveRole">{{mcLabel.save}}</button>
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
    import { validateRole } from'/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    export default{
        name      : 'groupLevelDetail',
        components: {},
        data() {
            return {
                mcLabel       : {},
                codeItems     : [],
                serviceItems  : [],
                role          : {
                    roleGroup  : '',
                    roleCat    : '',
                    roleService: '',
                    roleDesc   : '',
                    roleCreate : '',
                    roleRead   : '',
                    roleUpdate : '',
                    roleDelete : '',
                    isActive   : false,
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
            roleGroups(){
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'User';
                } );
            },
            roleCategories(){
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Solution';
                } );
            },
            roleServices(){
                return this.serviceItems.filter( ( item ) => {
                    return item.serviceType === this.role.roleCat;
                } );
            },
        },
        methods   : {
            // Retrieve/get current item/record from the the server/database
            saveRole() {
                // validate inputs:
                const errors = validateRole( this.role );
                if( errors.roleGroup || errors.roleService || errors.roleDesc ) {
                    this.validateErrors = errors;
                }
                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveRole', this.role, this.itemId, userToken, ( error, result ) => {
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
            if( Session.get( 'currentRoleItem' ) ) {
                const roleItem = Session.get( 'currentRoleItem' );
                this.itemId    = roleItem._id;
                this.role      = {
                    roleGroup  : roleItem.roleGroup,
                    roleCat    : roleItem.roleCat,
                    roleService: roleItem.roleService,
                    roleDesc   : roleItem.roleDesc,
                    roleCreate : roleItem.roleCreate,
                    roleRead   : roleItem.roleRead,
                    roleUpdate : roleItem.roleUpdate,
                    roleDelete : roleItem.roleDelete,
                    isActive   : roleItem.isActive,
                };
            } else {
                this.itemId = '';
                this.role   = {
                    roleGroup  : '',
                    roleCat    : '',
                    roleService: '',
                    roleDesc   : '',
                    roleCreate : '',
                    roleRead   : '',
                    roleUpdate : '',
                    roleDelete : '',
                    isActive   : false,
                };
            }
            if( userToken ) {
                // services
                Meteor.call( 'getService', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'ServiceError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage    = false;
                        this.pageMessage  = 'Items available';
                        this.serviceItems = _.sortBy( result.value, 'serviceName' ).filter( ( item ) => {
                            return item.isActive === true;
                        } );
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
                        this.codeItems   = _.sortBy( result.value, 'codeName' ).filter( ( item ) => {
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
        updated() {
//            this.roleServices = this.serviceItems.filter( ( item ) => {
//                return item.serviceType === this.role.roleCat;
//            } );
        }
    }
</script>