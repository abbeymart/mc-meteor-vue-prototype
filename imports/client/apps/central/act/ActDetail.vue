<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.actDetail}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="actCat">{{mcLabel.cat}}</label>
                        <select class="form-control" v-model="act.actCat" id="actCat" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.cat}}</option>
                            <option v-for="item in actCategories" :key="item._id" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.actCat}}</span>
                    </div>
                    <div class="form-group">
                        <label for="actMin">{{mcLabel.min}}</label>
                        <input type="number" min="0" class="form-control" id="actMin"
                               :placeholder="mcLabel.min" maxlength="255" required
                               v-model="act.actMin">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.actMax}}</span>
                    </div>
                    <div class="form-group">
                        <label for="actUnit">{{mcLabel.unit}}</label>
                        <select class="form-control" v-model="act.actUnit" id="actUnit" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.cat}}</option>
                            <option v-for="item in actUnits" :key="item._id" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.actUnit}}</span>
                    </div>
                    <div class="form-group">
                        <label for="actDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="actDesc" cols="80" rows="5"
                                  :placeholder="mcLabel.desc" v-model="act.actDesc"></textarea>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.actDesc}}</span>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="actTitle">{{mcLabel.title}}</label>
                        <input type="text" class="form-control" id="actTitle"
                               :placeholder="mcLabel.title" maxlength="255" required
                               v-model="act.actTitle">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.actTitle}}</span>
                    </div>
                    <div class="form-group">
                        <label for="actMax">{{mcLabel.max}}</label>
                        <input type="number" min="0" class="form-control" id="actMax"
                               :placeholder="mcLabel.max" maxlength="255" required
                               v-model="act.actMax">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.actMax}}</span>
                    </div>
                    <div class="form-group">
                        <label for="actLevel">{{mcLabel.level}}</label>
                        <select class="form-control" v-model="act.actLevel" id="actLevel" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.level}}</option>
                            <option v-for="item in actLevels" :key="item._id" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.actLevel}}</span>
                    </div>
                    <div class="form-group">
                        <label for="actLang">{{mcLabel.lang}}</label>
                        <select class="form-control" v-model="act.actLang" id="actLang" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                            <option v-for="item in langItems" :key="item._id" :value="item.langCode">
                                {{ item.langName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.actLang}}</span>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-6">
                            <label for="isActive">{{mcLabel.isActive}} </label>
                            <input class="w3-check" type="checkbox" id="isActive" v-model="act.isActive">
                        </div>
                        <div>
                            <button class="btn btn-primary" @click.prevent="saveAct">{{mcLabel.save}}</button>
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
    import { validateAct } from'/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    export default{
        name      : 'actDetail',
        components: {},
        data() {
            return {
                mcLabel       : {},
                codeItems     : [],
                langItems     : [],
                act           : {
                    actCat  : '',
                    actTitle: '',
                    actMin  : 0.01,
                    actMax  : 1000.00,
                    actUnit : '',
                    actLevel: '',
                    actDesc : '',
                    actLang : 'en-US',
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
        computed  : {
            actUnits(){
                // ids of the measurement sub-categories (units of measure)
                const currency = this.codeItems.find((item) => {
                    return item.codeName === 'Currency';
                });
                const effort = this.codeItems.find((item) => {
                    return item.codeName === 'Effort';
                });
                const quantity = this.codeItems.find((item) => {
                    return item.codeName === 'Quantity';
                });
                if (currency || effort || quantity) {
                    const units = this.codeItems.filter( ( item ) => {
                        return (item.codeCat === 'Measurement' && (item.parentId === currency._id || item.parentId === effort._id || item.parentId === quantity._id));
                    } );
                    return _.sortBy(units, 'parentId');
                }
            },
            actLevels(){
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Activity Level';
                } );
            },
            actCategories(){
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Activity';
                } );
            },
        },
        methods   : {
            // Retrieve/get current item/record from the the server/database
            saveAct() {
                // validate inputs:
                const errors = validateAct( this.act );
                if( errors.actTitle || errors.actCat || errors.actLang || errors.actMin || errors.actMax || errors.actLevel || errors.actDesc ) {
                    this.validateErrors = errors;
                }
                // explicitly cast the min and max values to numbers
                this.act.actMin = Number(this.act.actMin);
                this.act.actMax = Number(this.act.actMax);

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveAct', this.act, this.itemId, userToken, ( error, result ) => {
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
            if( Session.get( 'currentActItem' ) ) {
                const item  = Session.get( 'currentActItem' );
                this.itemId = item._id;
                this.act    = {
                    actCat  : item.actCat,
                    actTitle: item.actTitle,
                    actMin  : item.actMin,
                    actMax  : item.actMax,
                    actUnit : item.actUnit,
                    actLevel: item.actLevel,
                    actDesc : item.actDesc,
                    actLang : item.actLang,
                    isActive: item.isActive,
                };
            } else {
                this.itemId = '';
                this.act    = {
                    actCat  : '',
                    actTitle: '',
                    actMin  : 0.01,
                    actMax  : 1000.00,
                    actUnit : '',
                    actLevel: '',
                    actDesc : '',
                    actLang : 'en-US',
                    isActive: false,
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
