<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.serviceDetail}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="serviceName">{{mcLabel.name}}</label>
                    <input type="text" class="form-control" id="serviceName"
                           :placeholder="mcLabel.name" maxlength="255" required autofocus v-model="service.serviceName">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.serviceName}}</span>
                </div>
                <div class="form-group col-sm-6">
                    <label for="serviceLang">{{mcLabel.lang}}</label>
                    <select class="form-control" v-model="service.serviceLang" id="serviceLang" required>
                        <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                        <option v-for="item in langItems" :value="item.langCode" :key="item._id">
                            {{ item.langName }}
                        </option>
                    </select>
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.serviceLang}}</span>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="serviceType">{{mcLabel.type}}</label>
                    <select class="form-control" v-model="service.serviceType" id="serviceType" required>
                        <option disabled value="">{{mcLabel.select}} {{mcLabel.type}}</option>
                        <option v-for="item in serviceTypes" :value="item.codeName" :key="item._id">
                            {{ item.codeName }}
                        </option>
                    </select>
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.serviceType}}</span>
                </div>
                <div class="form-group col-sm-6">
                    <label for="serviceParent">{{mcLabel.parent}}</label>
                    <select class="form-control" v-model="service.parentId" id="serviceParent">
                        <option disabled value="">{{mcLabel.select}} {{mcLabel.parent}}</option>
                        <option v-for="item in parentItems" :value="item._id" :key="item._id">
                            {{ item.serviceName }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="serviceCost">{{mcLabel.cost}}</label>
                    <input type="number" min="0" step="0.1" class="form-control" id="serviceCost"
                           :placeholder="mcLabel.cost" maxlength="255" required v-model="service.serviceCost">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.serviceCost}}</span>
                </div>
                <div class="form-group col-sm-6">
                    <label for="servicePriority">{{mcLabel.priority}}</label>
                    <input type="number" min="0" class="form-control" id="servicePriority"
                           :placeholder="mcLabel.priority" maxlength="255"
                           v-model="service.servicePriority">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.servicePriority}}</span>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label for="serviceDesc">{{mcLabel.desc}}</label>
                    <textarea class="form-control" id="serviceDesc" cols="30" rows="10"
                              :placeholder="mcLabel.desc" v-model="service.serviceDesc"></textarea>
                    <span v-if="validateErrors" class="alert-warning">{{validateErrors.serviceDesc}}</span>
                </div>
                <div class="form-group col-sm-6">
                    <div>
                        <label for="servicePath">{{mcLabel.path}}</label>
                        <input type="text" class="form-control" id="servicePath"
                               :placeholder="mcLabel.path" maxlength="255" required
                               v-model="service.servicePath">
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.servicePath}}</span>
                    </div>
                    <div>
                        <label for="isActive">{{mcLabel.isActive}} </label>
                        <input class="w3-check" type="checkbox" id="isActive" v-model="service.isActive">
                        <button class="btn btn-primary" @click.prevent="saveService">{{mcLabel.save}}</button>
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
    import { validateService } from '/imports/lib/utils/ValidateRecord';
    import { centralMixin } from "../../../include/mixins/centralMixin";

    export default {
        name      : 'serviceDetail',
        components: {},
        mixins    : [
            centralMixin,
        ],
        data() {
            return {
                serviceItems  : [],
                service       : {
                    serviceName    : '',
                    serviceDesc    : '',
                    serviceType    : '',
                    parentId       : '',
                    serviceLang    : this.$constant.getDefaultLanguage(),
                    servicePriority: 100,
                    serviceCost    : 0,
                    servicePath    : '',
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
            parentItems() {
                const itemType = this.service.serviceType;
                switch( itemType ) {
                    case 'Test Case': {
                        return this.serviceItems.filter( ( item ) => {
                            return ((item._id !== this.itemId) && (item.serviceType === 'Use Case'));
                        } );
                        break;
                    }
                    case 'Use Case': {
                        return this.serviceItems.filter( ( item ) => {
                            return ((item._id !== this.itemId) && (item.serviceType === 'Function' || item.serviceType === 'Package'));
                        } );
                        break;
                    }
                    case 'Function': {
                        return this.serviceItems.filter( ( item ) => {
                            return ((item._id !== this.itemId) && (item.serviceType === 'Package'));
                        } );
                        break;
                    }
                    case 'Package': {
                        return this.serviceItems.filter( ( item ) => {
                            return ((item._id !== this.itemId) && (item.serviceType === 'Package Group'));
                        } );
                        break;
                    }
                    case 'Package Group': {
                        return this.serviceItems.filter( ( item ) => {
                            return ((item._id !== this.itemId) && (item.serviceType === 'Solution'));
                        } );
                        break;
                    }
                    case 'Solution': {
                        return this.serviceItems.filter( ( item ) => {
                            return ((item._id !== this.itemId) && (item.serviceType === 'Portfolio'));
                        } );
                        break;
                    }
                    case 'Delegation': {
                        return this.serviceItems.filter( ( item ) => {
                            return ((item._id !== this.itemId) && (item.serviceType === 'Delegation'));
                        } );
                        break;
                    }
                }
            },
            serviceTypes() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Solution';
                } );
            },
        },
        methods   : {
            fetchData() {
                // token
                const userToken     = this.$auth.getToken(),
                      queryParams   = {},
                      currentItemId = '';
                if( userToken ) {
                    // services
                    Meteor.call( 'getService', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'ServiceError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage    = false;
                            this.pageMessage  = 'Items available';
                            this.serviceItems = this.$lo.sortBy( result.value, 'serviceName' );
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
            saveService() {
                // validate inputs:
                this.service.servicePriority = Number( this.service.servicePriority );
                const errors                 = validateService( this.service );
                if( errors.serviceName || errors.serviceDesc || errors.serviceType || errors.servicePath || errors.serviceLang ) {
                    this.validateErrors = errors;
                }
                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveService', this.service, this.itemId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            } else {
                                this.isMessage = true;
                                // capture new/updated record itemId
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
            const item = this.$store.getters[ 'central/getServiceItem' ];
            if( item ) {
                this.itemId  = item._id;
                this.service = {
                    serviceName    : item.serviceName,
                    serviceDesc    : item.serviceDesc,
                    serviceType    : item.serviceType,
                    parentId       : item.parentId,
                    serviceLang    : item.serviceLang,
                    servicePriority: item.servicePriority || 100,
                    serviceCost    : item.serviceCost || 0,
                    servicePath    : item.servicePath,
                    isActive       : item.isActive || false,
                };
            } else {
                this.itemId  = '';
                this.service = {
                    serviceName    : '',
                    serviceDesc    : '',
                    serviceType    : '',
                    parentId       : '',
                    serviceLang    : this.$constant.getDefaultLanguage(),
                    servicePriority: 100,
                    serviceCost    : 0,
                    servicePath    : '',
                    isActive       : false,
                };
            }
            // Fetch items from the server, based on role assignment / authorization
            this.fetchData();
        },
    }

</script>
