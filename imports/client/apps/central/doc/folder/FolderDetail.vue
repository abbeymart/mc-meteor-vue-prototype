<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.folderDetail}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="folderName">{{mcLabel.folder}} {{mcLabel.name}}</label>
                        <input type="text" class="form-control" id="folderName"
                               :placeholder="mcLabel.name" maxlength="255" required autofocus
                               v-model="folder.folderName">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.folderName}}</span>
                    </div>
                    <div class="form-group">
                        <label for="folderOwner">{{mcLabel.owner}}</label>
                        <select class="form-control" v-model="folder.folderOwner" id="folderOwner" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.owner}}</option>
                            <option v-for="item in userItems" :value="item._id">
                                {{ item.profile.firstName }} {{item.profile.lastName}} | {{item.username}}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.folderOwner}}</span>
                    </div>
                    <div class="form-group">
                        <label for="folderParent">{{mcLabel.parent}}</label>
                        <select class="form-control" v-model="folder.parentId" id="folderParent">
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.parent}}</option>
                            <option v-for="item in parentItems" :value="item._id">
                                {{ item.folderName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.parentId}}</span>
                    </div>
                    <div class="form-group">
                        <label for="folderLang">{{mcLabel.lang}}</label>
                        <select class="form-control" v-model="folder.folderLang" id="folderLang" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                            <option v-for="item in langItems" :value="item.langCode">
                                {{ item.langName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.folderLang}}</span>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="folderAct">{{mcLabel.activity}}</label>
                        <input type="text" class="form-control" id="folderAct"
                               :placeholder="mcLabel.activity" maxlength="255"
                               v-model="folder.folderActivity">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.folderActivity}}</span>
                    </div>
                    <div class="form-group">
                        <label for="folderDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="folderDesc" cols="30" rows="5"
                                  :placeholder="mcLabel.desc" v-model="folder.folderDesc"></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.folderDesc}}</span>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-6">
                            <label for="isActive">{{mcLabel.isActive}} </label>
                            <input class="w3-check" type="checkbox" id="isActive" v-model="folder.isActive">
                        </div>
                        <div class="col-sm-6">
                            <button class="btn btn-primary" @click.prevent="saveFolder">{{mcLabel.save}}</button>
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
    import { validateFolder } from'/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    export default{
        name      : 'folderDetail',
        components: {},
        data() {
            return {
                mcLabel       : {},
                codeItems     : [],
                userItems     : [],
                langItems     : [],
                folderItems   : [],
                folder        : {
                    folderName    : '',
                    folderOwner   : '',
                    folderActivity: '',
                    parentId      : '',
                    folderLang    : 'en-US',
                    folderDesc    : '',
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
            parentItems() {
                return this.folderItems.filter( ( item ) => {
                    return ((item._id !== this.itemId) && (item.folderOwner === this.folder.folderOwner));
                } );
            },
            roleCategories(){
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Solution';
                } );
            },
        },
        methods   : {
            // Retrieve/get current item/record from the the server/database
            saveFolder() {
                // validate inputs:
                const errors = validateFolder( this.folder );
                if( errors.folderOwner || errors.folderName || errors.folderLang ) {
                    this.validateErrors = errors;
                }
                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveFolder', this.folder, this.itemId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage   = true;
                                // capture new record itemId
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
        created() {
            // token
            const userToken     = this.$auth.getToken(),
                  queryParams   = {},
                  currentItemId = '';
            this.mcLabel        = this.$label;
            const item = this.$store.getters['central/getFolderItem'];
            if( item ) {
                this.itemId = item._id;
                this.folder = {
                    folderName    : item.folderName,
                    folderOwner   : item.folderOwner,
                    folderActivity: item.folderActivity,
                    parentId      : item.parentId,
                    folderLang    : item.folderLang,
                    folderDesc    : item.folderDesc,
                    isActive      : item.isActive,
                };
            } else {
                this.itemId = '';
                this.folder = {
                    folderName    : '',
                    folderOwner   : '',
                    folderActivity: '',
                    parentId      : '',
                    folderLang    : 'en-US',
                    folderDesc    : '',
                    isActive      : false
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
                // folders
                Meteor.call( 'getFolder', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'FolderError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.folderItems = _.sortBy( result.value, 'folderName' ).filter( ( item ) => {
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
                        this.userItems   = _.sortBy( result.value, 'username' );
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
    }
</script>
