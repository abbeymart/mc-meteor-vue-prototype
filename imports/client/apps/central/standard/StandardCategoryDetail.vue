<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.stdCatDetail}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="catName">{{mcLabel.name}}</label>
                    <input type="text" class="form-control" id="catName"
                           :placeholder="mcLabel.name" maxlength="255" required autofocus v-model="cat.catName">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.catName}}</span>
                </div>
                <div class="form-group col-sm-6">
                    <label for="catLang">{{mcLabel.lang}}</label>
                    <select class="form-control" v-model="cat.catLang" id="catLang" required>
                        <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                        <option v-for="item in langItems" :value="item.langCode">
                            {{ item.langName }}
                        </option>
                    </select>
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.catLang}}</span>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="catDesc">{{mcLabel.desc}}</label>
                    <textarea class="form-control" id="catDesc" cols="30" rows="10"
                              :placeholder="mcLabel.desc" v-model="cat.catDesc"></textarea>
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.catDesc}}</span>
                </div>
                <div class="col-sm-6">
                    <label for="isActive">{{mcLabel.isActive}} </label>
                    <input class="w3-check" type="checkbox" id="isActive" v-model="cat.isActive">
                    <button class="btn btn-primary" @click.prevent="saveCat">{{mcLabel.save}}</button>
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
    import { validateStandardCategory } from'/imports/lib/utils/ValidateRecord';

    export default{
        name      : 'standardCategoryDetail',
        components: {},
        data() {
            return {
                mcLabel       : {},
                langItems     : [],
                cat           : {
                    catName : '',
                    catDesc : '',
                    catLang : 'en-US',
                    isActive: false
                },
                pageMessage   : '',
                isMessage     : false,
                itemId        : '',
                saveStatus    : '',
                validateErrors: '',

            }
        },
        methods   : {
            // Retrieve/get current item/record from the the server/database
            saveCat() {
                // validate inputs:
                const errors = validateStandardCategory( this.cat );
                if( errors.catName || errors.catDesc || errors.catLang ) {
                    this.validateErrors = errors;
                }
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveCat', this.cat, this.itemId, userToken, ( error, result ) => {
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
            this.mcLabel = this.$label;
            if( Session.get( 'currentCatItem' ) ) {
                const catItem = Session.get( 'currentCatItem' );
                this.itemId   = catItem._id;
                this.cat      = {
                    catName : catItem.catName,
                    catDesc : catItem.catDesc,
                    catLang : catItem.catLang,
                    isActive: catItem.isActive
                };
            } else {
                this.itemId = '';
                this.cat    = {
                    catName : '',
                    catDesc : '',
                    catLang : 'en-US',
                    isActive: false,
                };
            }
            Meteor.call( 'getAllLang', ( error, result ) => {
                if( error ) {
                    this.isMessage   = true;
                    this.pageMessage = 'LanguageError: Retry.';
                } else if( result.code === 'success') {
                    this.isMessage   = false;
                    this.pageMessage = 'Items available';
                    this.langItems   = result.value.filter( ( item ) => {
                            return item.isActive === true;
                    } ) ;
                 } else {
                    this.isMessage   = true;
                    this.pageMessage = `${result.code}: ${result.value}`;
                }
            } );
        },
    }

</script>