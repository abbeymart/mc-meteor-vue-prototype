<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.orgDetail}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="orgNumber">{{mcLabel.orgNumber}}</label>
                        <input type="text" class="form-control" id="orgNumber"
                               :placeholder="mcLabel.orgNumber" maxlength="64" required autofocus
                               v-model="org.orgNumber">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.orgNumber}}</span>
                    </div>
                    <div class="form-group">
                        <label for="orgName">{{mcLabel.name}}</label>
                        <input type="text" class="form-control" id="orgName"
                               :placeholder="mcLabel.orgName" maxlength="255" required
                               v-model="org.orgName">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.orgName}}</span>
                    </div>
                    <div class="form-group">
                        <label for="orgRegDate">{{mcLabel.startDate}}</label>
                        <input type="date" class="form-control" id="orgRegDate"
                               :placeholder="mcLabel.startDate" maxlength="25"
                               v-model="org.orgRegDate">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.orgRegDate}}</span>
                    </div>
                    <div class="form-group">
                        <label for="orgAddress">{{mcLabel.address}}</label>
                        <input type="text" class="form-control" id="orgAddress"
                               :placeholder="mcLabel.address" maxlength="255" required
                               v-model="org.orgAddress">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.orgAddress}}</span>
                    </div>
                    <div class="form-group">
                        <label for="orgCity">{{mcLabel.addressCity}}</label>
                        <input type="text" min="0" class="form-control" id="orgCity"
                               :placeholder="mcLabel.city" maxlength="255" required
                               v-model="org.orgCity">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.orgCity}}</span>
                    </div>
                    <div class="form-group">
                        <label for="orgDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="orgDesc" cols="30" rows="5"
                                  :placeholder="mcLabel.desc" v-model="org.orgDesc"></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.orgDesc}}</span>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="orgType">{{mcLabel.type}}</label>
                        <select class="form-control" v-model="org.orgType" id="orgType" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.type}}</option>
                            <option v-for="item in orgTypes" :value="item._id">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.orgType}}</span>
                    </div>
                    <div class="form-group">
                        <label for="orgIndustry">{{mcLabel.orgIndustry}}</label>
                        <select class="form-control" v-model="org.orgIndustry" id="orgIndustry" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.orgIndustry}}</option>
                            <option v-for="item in orgIndustries" :value="item._id">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.orgIndustry}}</span>
                    </div>
                    <div class="form-group">
                        <label for="orgCountry">{{mcLabel.country}}</label>
                        <select class="form-control" v-model="org.orgCountry" id="orgCountry" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.country}}</option>
                            <option v-for="item in orgCountries" :value="item._id">
                                {{ item.locationName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.orgCountry}}</span>
                    </div>
                    <div class="form-group">
                        <label for="orgState">{{mcLabel.state}}</label>
                        <select class="form-control" v-model="org.orgState" id="orgState" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.state}}</option>
                            <option v-for="item in orgStates" :value="item._id">
                                {{ item.locationName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.orgState}}</span>
                    </div>
                    <div class="form-group">
                        <label for="orgParent">{{mcLabel.parent}}</label>
                        <select class="form-control" v-model="org.parentId" id="orgParent">
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.parent}}</option>
                            <option v-for="item in parentItems" :value="item._id">
                                {{ item.orgName }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="orgLang">{{mcLabel.lang}}</label>
                        <select class="form-control" v-model="org.orgLang" id="orgLang" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                            <option v-for="item in langItems" :value="item.langCode">
                                {{ item.langName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.orgLang}}</span>
                    </div>
                    <div class="form-group">
                        <label for="isActive">{{mcLabel.isActive}} </label>
                        <input class="w3-check" type="checkbox" id="isActive" v-model="org.isActive">
                        <button class="btn btn-primary" @click.prevent="saveOrg">{{mcLabel.save}}</button>
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
    import { validateOrganization } from '/imports/lib/utils/ValidateRecord';

    export default {
        name      : 'organizationDetail',
        components: {},
        data() {
            return {
                mcLabel       : this.$label,
                langItems     : [],
                codeItems     : [],
                locationItems : [],
                orgItems      : [],
                org           : {
                    orgNumber  : '',
                    orgName    : '',
                    orgDesc    : '',
                    orgType    : '',
                    orgIndustry: '',
                    orgRegDate : this.formatDate( Date.now() ),
                    orgCountry : '',
                    orgState   : '',
                    orgCity    : '',
                    parentId   : '',
                    orgAddress : '',
                    orgLang    : this.$constant.getDefaultLanguage(),
                    isActive   : false
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
            // Lookup parents-items, for existing records owner only
            parentItems() {
                const userInfo = this.$store.getters[ 'central/getCurrentUser' ];
                if( userInfo ) {
                    const userId = userInfo._id;
                    return this.orgItems.filter( ( item ) => {
                        return ((item._id !== this.itemId) && (item.createdBy === userId));
                    } );
                }
            },
            orgTypes() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Organization';
                } );
            },
            orgIndustries() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Industry';
                } );
            },
            orgCountries() {
                return this.locationItems.filter( ( item ) => {
                    return item.locationType === 'Country';
                } );
            },
            orgStates() {
                return this.locationItems.filter( ( item ) => {
                    return ((item.locationType === 'State' || item.locationType === 'Province') && (item.parentId === this.org.orgCountry));
                } );
            },
        },
        methods   : {
            formatDate( date ) {
                return this.$mo( date ).format( "YYYY-MM-DD" );
            },
            // Retrieve/get current item/record from the the server/database
            saveOrg() {
                // validate inputs:
//                this.org.orgRegDate = new Date( this.org.orgRegDate );

                const errors = validateOrganization( this.org );
                if( errors.orgNumber || errors.orgName || errors.orgType || errors.orgCountry || errors.orgLang || errors.orgDesc || errors.City || errors.orgAddress ) {
                    this.validateErrors = errors;
                }
                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveOrg', this.org, this.itemId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage = true;
                                // capture new record itemId
                                if( result.code === 'inserted' || result.code === 'updated' ) {
                                    this.itemId = result.docId;
                                }
                                this.pageMessage = `${result.code}: ${result.value}`;
                            }
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = 'inputs-errors: ' + JSON.stringify( errors );
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
                  currentItemId = '',
                  item          = this.$store.getters[ 'central/getOrgItem' ];
            if( item ) {
                this.itemId = item._id;
                this.org    = {
                    orgNumber  : item.orgNumber,
                    orgName    : item.orgName,
                    orgDesc    : item.orgDesc,
                    orgType    : item.orgType,
                    orgIndustry: item.orgIndustry,
                    orgRegDate : this.formatDate( item.orgRegDate ),
                    orgAddress : item.orgAddress,
                    orgCountry : item.orgCountry,
                    orgState   : item.orgState,
                    orgCity    : item.orgCity,
                    parentId   : item.parentId,
                    orgLang    : item.orgLang,
                    isActive   : item.isActive,
                };
            } else {
                this.itemId = '';
                this.org    = {
                    orgNumber  : '',
                    orgName    : '',
                    orgDesc    : '',
                    orgType    : '',
                    orgIndustry: '',
                    orgRegDate : this.formatDate( Date.now() ),
                    orgAddress : '',
                    orgCountry : '',
                    orgState   : '',
                    orgCity    : '',
                    parentId   : '',
                    orgLang    : this.$constant.getDefaultLanguage(),
                    isActive   : false
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
                // organizations
                Meteor.call( 'getOrg', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'ServiceError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage   = false;
                        this.pageMessage = 'Items available';
                        this.orgItems    = this.$lo.sortBy( result.value, 'orgName' );
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
                        this.codeItems   = this.$lo.sortBy( result.value, 'codeName' ).filter( ( item ) => {
                            return item.isActive === true;
                        } );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
                // locations
                Meteor.call( 'getLocation', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'LocationError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage     = false;
                        this.pageMessage   = 'Items available';
                        this.locationItems = this.$lo.sortBy( result.value, 'locationName' ).filter( ( item ) => {
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
