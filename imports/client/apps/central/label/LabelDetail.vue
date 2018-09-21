<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.labelDetail}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="labelCode">{{mcLabel.code}}</label>
                    <input type="text" class="form-control" id="labelCode"
                           :placeholder="mcLabel.code" maxlength="255" required autofocus v-model="label.labelCode">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.labelCode}}</span>
                </div>
                <div class="form-group col-sm-6">
                    <label for="labelName">{{mcLabel.name}}</label>
                    <input type="text" class="form-control" id="labelName"
                           :placeholder="mcLabel.name" maxlength="255" required autofocus v-model="label.labelName">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.labelName}}</span>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="labelCat">{{mcLabel.cat}}</label>
                    <select class="form-control" v-model="label.labelCat" id="labelCat" required>
                        <option disabled value="">{{mcLabel.select}} {{mcLabel.cat}}</option>
                        <option v-for="item in labelCategories" :value="item.codeName">
                            {{ item.codeName }}
                        </option>
                    </select>
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.labelCat}}</span>
                </div>
                <div class="form-group col-sm-6">
                    <label for="labelLang">{{mcLabel.lang}}</label>
                    <select class="form-control" v-model="label.labelLang" id="labelLang" required>
                        <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                        <option v-for="item in langItems" :value="item.langCode">
                            {{ item.langName }}
                        </option>
                    </select>
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.labelLang}}</span>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="labelDesc">{{mcLabel.desc}}</label>
                    <textarea class="form-control" id="labelDesc" cols="30" rows="10"
                              :placeholder="mcLabel.desc" v-model="label.labelDesc"></textarea>
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.labelDesc}}</span>
                </div>
                <div class="col-sm-6">
                    <label for="isActive">{{mcLabel.isActive}} </label>
                    <input class="w3-check" type="checkbox" id="isActive" v-model="label.isActive">
                    <button class="btn btn-primary" @click.prevent="saveLabel">{{mcLabel.save}}</button>
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
    import { validateLabel } from'/imports/lib/utils/ValidateRecord';

    export default{
        name      : 'labelDetail',
        components: {},
        data() {
            return {
                mcLabel       : {},
                langItems     : [],
                codeItems     : [],
                label         : {
                    labelCode: '',
                    labelName: '',
                    labelDesc: '',
                    labelCat : '',
                    labelLang: 'en-US',
                    isActive : false,
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
            labelCategories(){
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Localization';
                } );
            },
        },
        methods   : {
            // Retrieve/get current item/record from the the server/database
            saveLabel() {
                // validate inputs:
                const errors = validateLabel( this.label );
                if( errors.labelName || errors.labelDesc || errors.labelCat || errors.labelLang ) {
                    this.validateErrors = errors;
                }
                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveLabel', this.label, this.itemId, userToken, ( error, result ) => {
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
            const item = this.$store.getters['central/getLabelItem'];
            if( item && !this.$lo.isEmpty(item) ) {
                this.itemId     = item._id;
                this.label      = {
                    labelCode: item.labelCode,
                    labelName: item.labelName,
                    labelDesc: item.labelDesc,
                    labelCat : item.labelCat,
                    labelLang: item.labelLang,
                    isActive : item.isActive,
                };
            } else {
                this.itemId = '';
                this.label  = {
                    labelCode: '',
                    labelName: '',
                    labelDesc: '',
                    labelCat : '',
                    labelLang: 'en-US',
                    isActive : false,
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
            } else {
                this.isMessage   = true;
                this.pageMessage = 'Access-key missing or expired. Please login again.';
            }
        },
    }
</script>
