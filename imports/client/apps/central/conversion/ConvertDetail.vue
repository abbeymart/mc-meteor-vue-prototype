<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.convertDetail}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="convertCat">{{mcLabel.cat}}</label>
                        <select class="form-control" v-model="convert.convertCat" id="convertCat" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.cat}}</option>
                            <option v-for="item in convertCategories" :value="item._id" :key="item._id">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.convertCat}}</span>
                    </div>
                    <div class="form-group">
                        <label for="convertFrom">{{mcLabel.from}}</label>
                        <select class="form-control" v-model="convert.convertFrom" id="convertFrom" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.from}}</option>
                            <option v-for="item in convertFromNames" :value="item._id" :key="item._id">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.convertFrom}}</span>
                    </div>
                    <div class="form-group">
                        <label for="convertTo">{{mcLabel.to}}</label>
                        <select class="form-control" v-model="convert.convertTo" id="convertTo" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.to}}</option>
                            <option v-for="item in convertToNames" :value="item._id" :key="item._id">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.convertTo}}</span>
                    </div>
                    <div class="form-group">
                        <label for="convertValue">{{mcLabel.value}}</label>
                        <input type="number" min="0.1" step="0.001" class="form-control" id="convertValue"
                               :placeholder="mcLabel.value" maxlength="25" required
                               v-model="convert.convertValue">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.convertValue}}</span>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="convertLang">{{mcLabel.lang}}</label>
                        <select class="form-control" v-model="convert.convertLang" id="convertLang" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                            <option v-for="item in langItems" :value="item.langCode" :key="item._id">
                                {{ item.langName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.convertLang}}</span>
                    </div>
                    <div class="form-group">
                        <label for="convertDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="convertDesc" cols="30" rows="5" :placeholder="mcLabel.desc"
                                  v-model="convert.convertDesc"></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.convertDesc}}</span>
                    </div>
                    <div class="form-group">
                        <label for="isActive">{{mcLabel.isActive}} </label>
                        <input class="w3-check" type="checkbox" id="isActive" v-model="convert.isActive">
                        <button class="btn btn-primary" @click.prevent="saveConvert">{{mcLabel.save}}</button>
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
    import { validateConvert } from'/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    export default{
        name      : 'convertDetail',
        components: {},
        data() {
            return {
                mcLabel       : {},
                langItems     : [],
                codeItems     : [],
                convert       : {
                    convertCat  : '',
                    convertFrom : '',
                    convertTo   : '',
                    convertValue: 1,
                    convertLang : 'en-US',
                    convertDesc : '',
                    isActive    : false,
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
            convertCategories() {
                return this.codeItems.filter( ( item ) => {
                    return (item.codeCat === 'Measurement') && (item.parentId === '');
                } );
            },
            convertFromNames() {
                return this.codeItems.filter( ( item ) => {
                    return item.parentId === this.convert.convertCat;
                } );
            },
            convertToNames() {
                return this.codeItems.filter( ( item ) => {
                    return (item.parentId === this.convert.convertCat) && (item._id !== this.convert.convertFrom);
                } );
            },
        },
        methods   : {
            // Retrieve/get current item/record from the the server/database
            saveConvert() {
                // validate inputs:
                const errors = validateConvert( this.convert );
                if( errors.convertCat || errors.convertFrom || errors.convertTo || errors.convertValue || errors.convertLang || errors.convertDesc ) {
                    this.validateErrors = errors;
                    console.log( errors );
                }
                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveContact', this.contact, this.itemId, userToken, ( error, result ) => {
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
            if( Session.get( 'currentConvertItem' ) ) {
                const item   = Session.get( 'currentConvertItem' );
                this.itemId  = item._id;
                this.convert = {
                    convertCat  : item.convertCat,
                    convertFrom : item.convertFrom,
                    convertTo   : item.convertTo,
                    convertValue: item.convertValue,
                    convertLang : item.convertLang,
                    convertDesc : item.convertDesc,
                    isActive    : item.isActive,
                };
            } else {
                this.itemId  = '';
                this.convert = {
                    convertCat  : '',
                    convertFrom : '',
                    convertTo   : '',
                    convertValue: 1,
                    convertLang : 'en-US',
                    convertDesc : '',
                    isActive    : false,
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
