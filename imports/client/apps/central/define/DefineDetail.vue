<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.stdCodeDetailTitle}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="codeName">{{mcLabel.name}}</label>
                    <input type="text" class="form-control" id="codeName"
                           :placeholder="mcLabel.name" maxlength="255" required autofocus v-model="code.codeName">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.codeName}}</span>
                </div>
                <div class="form-group col-sm-6">
                    <label for="codeLang">{{mcLabel.lang}}</label>
                    <option disabled value="">{{mcLabel.selectLang}}</option>
                    <select class="form-control" v-model="code.codeLang" id="codeLang" required>
                        <option v-for="item in langItems" :value="item.langCode">
                            {{ item.langName }}
                        </option>
                    </select>
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.codeLang}}</span>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="codeCat">{{mcLabel.cat}}</label>
                    <select class="form-control" v-model="code.codeCat" id="codeCat" required>
                        <option disabled value="">{{mcLabel.selectCat}}</option>
                        <option v-for="item in catItems" :value="item.catName">
                            {{ item.catName }}
                        </option>
                    </select>
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.codeCat}}</span>
                </div>
                <div class="form-group col-sm-6">
                    <label for="codeParent">{{mcLabel.partOf}}</label>
                    <option disabled value="">{{mcLabel.selectParent}}</option>
                    <select class="form-control" v-model="code.parentId" id="codeParent">
                        <option v-for="item in parentItems" :value="item._id">
                            {{ item.codeName }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="codeDesc">{{mcLabel.desc}}</label>
                    <textarea class="form-control" id="codeDesc" cols="30" rows="10"
                              :placeholder="mcLabel.desc" v-model="code.codeDesc"></textarea>
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.codeDesc}}</span>
                </div>
                <div class="col-sm-6">
                    <label for="isActive">{{mcLabel.isActive}} </label>
                    <input class="w3-check" type="checkbox" id="isActive" v-model="code.isActive">
                    <button class="btn btn-primary" @click.prevent="saveCode">{{mcLabel.save}}</button>
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
    import { validateStandardCode } from'/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    export default{
        name      : 'defineDetail',
        components: {},
        data() {
            return {
                mcLabel       : {},
                langItems     : [],
                catItems      : [],
                codeItems     : [],
                code          : {
                    codeName: '',
                    codeDesc: '',
                    codeCat : '',
                    parentId: '',
                    codeLang: 'en-US',
                    isActive: false,
                },
                pageMessage   : '',
                isMessage     : false,
                itemId        : '',
                itemParams    : '',
                itemParamId   : '',
                validateErrors: '',

            }
        },
        computed: {
            // Lookup parents-items for items within the same category
            parentItems() {
                return _.sortBy(this.codeItems, 'codeName').filter( ( item ) => {
                    return item.codeCat === this.code.codeCat;
                } );
            },
        },
        methods   : {
            // Retrieve/get current item/record from the the server/database
            saveCode() {
                // validate inputs:
                const errors = validateStandardCode( this.code );
                if( errors.codeName || errors.codeDesc || errors.codeCat || errors.codeLang ) {
                    this.validateErrors = errors;
                }
                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveCode', this.code, this.itemId, userToken, ( error, result ) => {
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
        created(){
            // token
            const userToken     = this.$auth.getToken(),
                  queryParams   = {},
                  currentItemId = '';
            this.mcLabel        = this.$label;
            if( Session.get( 'currentCodeItem' ) ) {
                const codeItem = Session.get( 'currentCodeItem' );
                this.itemId    = codeItem._id;
                this.code      = {
                    codeName: codeItem.codeName,
                    codeDesc: codeItem.codeDesc,
                    codeCat : codeItem.codeCat,
                    codeLang: codeItem.codeLang,
                    parentId: codeItem.parentId,
                    isActive: codeItem.isActive
                };
            } else {
                this.itemId = '';
                this.code   = {
                    codeName: '',
                    codeDesc: '',
                    codeCat : '',
                    codeLang: 'en-US',
                    parentId: '',
                    isActive: ''
                };
            }
            Meteor.call( 'getAllLang', ( error, result ) => {
                if( error ) {
                    this.isMessage   = true;
                    this.pageMessage = 'LanguageError: Retry.';
                } else if( result.code === 'success' ) {
                    this.isMessage   = false;
                    this.pageMessage = 'Items available';
                    this.langItems   = _.sortBy(result.value, 'langCode').filter( ( item ) => {
                        return item.isActive === true;
                    } );
                } else {
                    this.isMessage   = true;
                    this.pageMessage = `${result.code}: ${result.value}`;
                }
            } );
            if( userToken ) {
                // get standard category items
                Meteor.call( 'getCat', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'CategoryError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.catItems   = _.sortBy(result.value, 'catName').filter( ( item ) => {
                            return item.isActive === true;
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
                // get standard code items, TODO: refactor...?
                Meteor.call( 'getCode', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'CodeError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.codeItems   = _.sortBy(result.value, 'codeName').filter( ( item ) => {
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