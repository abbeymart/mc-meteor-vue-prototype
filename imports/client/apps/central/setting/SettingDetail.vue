<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.settingDetail}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="settingCat">{{mcLabel.cat}}</label>
                    <select class="form-control" v-model="setting.settingCat" id="settingCat" required>
                        <option disabled value="">{{mcLabel.select}} {{mcLabel.cat}}</option>
                        <option v-for="item in settingCategories" :value="item.codeName">
                            {{ item.codeName }}
                        </option>
                    </select>
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.serviceType}}</span>
                </div>
                <div class="form-group col-sm-6">
                    <label for="settingName">{{mcLabel.name}}</label>
                    <select class="form-control" v-model="setting.settingName" id="settingName">
                        <option disabled value="">{{mcLabel.select}} {{mcLabel.name}}</option>
                        <option v-for="item in settingNames" :value="item.codeName">
                            {{ item.codeName }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="settingRelation">{{mcLabel.relation}}</label>
                    <select class="form-control" v-model="setting.settingRelation" id="settingRelation" required>
                        <option disabled value="">{{mcLabel.select}} {{mcLabel.relation}}</option>
                        <option v-for="item in settingRelations" :value="item.codeName">
                            {{ item.codeName }}
                        </option>
                    </select>
                    <span v-if="validateErrors" class="alert-warning">{{validateErrors.settingRelation}}</span>
                </div>
                <div class="form-group col-sm-6">
                    <label for="settingValue">{{mcLabel.value}}</label>
                    <input type="text" class="form-control" id="settingValue"
                           :placeholder="mcLabel.value" maxlength="255" required autofocus
                           v-model="setting.settingValue">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.settingValue}}</span>
                </div>
            </div>

            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="settingDesc">{{mcLabel.desc}}</label>
                    <textarea class="form-control" id="settingDesc" cols="30" rows="10"
                              :placeholder="mcLabel.desc" v-model="setting.settingDesc"></textarea>
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.settingDesc}}</span>
                </div>
                <div class="form-group col-sm-6">
                    <label for="settingLang">{{mcLabel.lang}}</label>
                    <select class="form-control" v-model="setting.settingLang" id="settingLang" required>
                        <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                        <option v-for="item in langItems" :value="item.langCode">
                            {{ item.langName }}
                        </option>
                    </select>
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.settingLang}}</span>
                    <hr>
                    <label for="isActive">{{mcLabel.isActive}} </label>
                    <input class="w3-check" type="checkbox" id="isActive" v-model="setting.isActive">
                    <button class="btn btn-primary" @click.prevent="saveSetting">{{mcLabel.save}}</button>
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
    import { validateSetting } from'/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    export default{
        name      : 'settingDetail',
        components: {},
        data() {
            return {
                mcLabel       : {},
                langItems     : [],
                codeItems     : [],
                serviceItems  : [],
                setting       : {
                    settingCat     : '',
                    settingName    : '',
                    settingRelation: '',
                    settingValue   : '',
                    settingDesc    : '',
                    settingLang    : 'en-US',
                    isActive       : false,
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
            // Lookup parents-items, by solution hierarchy (solution-packageGroup-package-function...)
            settingNames() {
                const category = this.codeItems.find( item => {
                    return (item.codeName === this.setting.settingCat);
                } );
                if( category ) {
                    return this.codeItems.filter( ( item ) => {
                        return item.parentId === category._id;
                    } );
                } else {
                    return [];
                }
            },
            settingCategories(){
                return this.codeItems.filter( ( item ) => {
                        return (item.codeCat === 'Settings' && item.parentId === '');
                    } ) || [];
            },
            settingRelations() {
                return this.codeItems.filter( ( item ) => {
                        return item.codeCat === 'Settings Relation';
                    } ) || [];
            },
        },
        methods   : {
            // Retrieve/get current item/record from the the server/database
            saveSetting() {
                // validate inputs:
                const errors = validateSetting( this.setting );
                if( errors.settingCat || errors.settingName || errors.settingRelation || errors.settingValue || errors.settingDesc ) {
                    this.validateErrors = errors;
                }
                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveSetting', this.setting, this.itemId, userToken, ( error, result ) => {
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
            if( Session.get( 'currentSettingItem' ) ) {
                const settingItem = Session.get( 'currentSettingItem' );
                this.itemId       = settingItem._id;
                this.setting      = {
                    settingCat     : settingItem.settingCat,
                    settingName    : settingItem.settingName,
                    settingRelation: settingItem.settingRelation,
                    settingValue   : settingItem.settingValue,
                    settingDesc    : settingItem.settingDesc,
                    settingLang    : settingItem.settingLang,
                    isActive       : settingItem.isActive,
                };
            } else {
                this.itemId  = '';
                this.setting = {
                    settingCat     : '',
                    settingName    : '',
                    settingRelation: '',
                    settingValue   : '',
                    settingDesc    : '',
                    settingLang    : 'en-US',
                    isActive       : '',
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