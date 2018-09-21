<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.langDetail}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="langCode">{{mcLabel.langCode}}</label>
                    <input type="text" class="form-control" id="langCode"
                           :placeholder="mcLabel.langCode" maxlength="255" required autofocus v-model="lang.langCode">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.langCode}}</span>
                </div>
                <div class="form-group col-sm-6">
                    <label for="langName">{{mcLabel.langName}}</label>
                    <input type="text" class="form-control" id="langName"
                           :placeholder="mcLabel.langName" maxlength="255" required autofocus v-model="lang.langName">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.langName}}</span>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="langDesc">{{mcLabel.desc}}</label>
                    <textarea class="form-control" name="langDesc" id="langDesc" cols="30" rows="10"
                              :placeholder="mcLabel.desc" v-model="lang.langDesc"></textarea>
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.langDesc}}</span>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <label for="isActive">{{mcLabel.isActive}} </label>
                    <input class="w3-check" type="checkbox" id="isActive" v-model="lang.isActive">
                    <button id="saveLang" class="btn btn-primary" @click.prevent="saveLang">{{mcLabel.save}}</button>
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
    import { validateLanguage } from'/imports/lib/utils/ValidateRecord';

    export default{
        name      : 'languageDetail',
        components: {},
        data() {
            return {
                mcLabel       : {},
                currentLang   : '',
                lang          : {
                    langCode: '',
                    langName: '',
                    langDesc: '',
                    isActive: false
                },
                pageMessage   : '',
                isMessage     : false,
                itemId        : '',
                validateErrors: '',
            }
        },
        methods   : {
            // Retrieve/get current item/record from the the server/database
            saveLang() {
                // disable save button
                document.getElementById('saveLang').prop('disable', true);

                // validate inputs:
                const errors = validateLanguage( this.lang );
                if( errors.langCode || errors.langName || errors.langDesc ) {
                    this.validateErrors = errors;
                }
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveLang', this.lang, this.itemId, userToken, ( error, result ) => {
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
                    this.pageMessage = 'Access-key missing or expired. Please login again.';
                }
                // enable save button
                document.getElementById('saveLang').prop('disable', false);
            },
        },
        created() {
            this.mcLabel = this.$label;
            const item = this.$store.getters[ 'central/getLangItem' ];
            if( item && !this.$lo.isEmpty(item)) {
                this.itemId    = item._id;
                this.lang      = {
                    langCode: item.langCode,
                    langName: item.langName,
                    langDesc: item.langDesc,
                    isActive: item.isActive
                };
            } else {
                this.itemId = '';
                this.lang   = {
                    langCode: '',
                    langName: '',
                    langDesc: '',
                    isActive: false,
                };
            }
        },
    }
</script>
