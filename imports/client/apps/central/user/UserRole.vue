<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.userRole}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="grantRole">{{mcLabel.role}}</label>
                        <select class="form-control" v-model="grant.grantRole" id="grantRole" required>
                            <option v-for="item in grantRoles" :value="item._id">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.grantRole}}</span>
                    </div>
                    <div class="form-group">
                        <label for="grantUser">{{mcLabel.user}}</label>
                        <select class="form-control" v-model="grant.grantUser" id="grantUser" required>
                            <option v-for="item in userItems" :value="item._id">
                                {{ item.username }} | {{item.profile.firstName}} {{item.profile.lastName}}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.grantUser}}</span>
                    </div>
                    <div class="form-group">
                        <label for="grantDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="grantDesc" cols="30" rows="10"
                                  v-model="grant.grantDesc"></textarea>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.grantDesc}}</span>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-6">
                            <label for="isActive">{{mcLabel.isActive}} </label>
                            <input class="w3-check" type="checkbox" id="isActive" v-model="grant.isActive">
                        </div>
                        <div>
                            <button class="btn btn-primary" @click.prevent="saveGrant">{{mcLabel.save}}</button>
                        </div>
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
    import { validateGrant } from'/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    export default{
        name      : 'grantDetail',
        components: {},
        data() {
            return {
                mcLabel       : {},
                roleItems     : [],
                userItems     : [],
                grant         : {
                    grantRole: '',
                    grantUser: '',
                    grantDesc: '',
                    isActive : false,
                },
                pageMessage   : '',
                isMessage     : false,
                itemId        : '',
                itemParams    : '',
                validateErrors: '',

            }
        },
        computed  : {
            // Lookup parents-items, by solution hierarchy (solution-packageGroup-package-function...)
            grantRoles(){
                return this.roleItems.filter( ( item ) => {
                    return item.codeCat === 'User';
                } );
            },
        },
        methods   : {
            fetchData(){
                // token
                const userToken     = this.$auth.getToken(),
                      queryParams   = {},
                      currentItemId = '';
                if( userToken ) {
                    // get standard code items
                    Meteor.call( 'getCode', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'CodeError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage   = false;
                            this.pageMessage = 'Items available';
                            this.roleItems   = this.$lo.sortBy( result.value, 'codeName' ).filter( ( item ) => {
                                return item.isActive === true;
                            } );
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
                } else {
                    this.isMessage   = true;
                    this.pageMessage = 'Access-key missing or expired. Please login again.';
                }
            },
            // Retrieve/get current item/record from the the server/database
            saveGrant() {
                // validate inputs:
                let errors = validateGrant( this.grant );
                if( errors.grantRole || errors.grantUser || errors.grantDesc ) {
                    this.validateErrors = errors;
                }
                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        Meteor.call( 'saveGrant', this.grant, this.itemId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage   = true;
                                this.pageMessage = `${result.code}: ${result.value}`;
                            }
                        } )
                        ;
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
            this.mcLabel        = this.$label;
            if( Session.get( 'currentGrantItem' ) ) {
                const grantItem = Session.get( 'currentGrantItem' );
                this.itemId     = grantItem._id;
                this.grant      = {
                    grantRole: grantItem.grantRole,
                    grantUser: grantItem.grantUser,
                    grantDesc: grantItem.grantDesc,
                    isActive : grantItem.isActive,
                };
            } else {
                this.itemId = '';
                this.grant  = {
                    grantRole: '',
                    grantUser: '',
                    grantDesc: '',
                    isActive : false,
                };
            }
            // get /fetch data
            this.fetchData();
        },
    }
</script>