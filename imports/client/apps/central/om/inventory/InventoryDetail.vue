<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4 class="w3-left"><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.inventoryDetail}}</h4>
        </div>
        <hr>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <fieldset>
                        <legend><h4>Inventory Item</h4></legend>
                        <!--TODO: for admin-user only-->
                        <div class="form-group">
                            <label for="invProduct">{{mcLabel.product}}</label>
                            <select class="form-control" v-model="inventory.invProduct" id="invProduct">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.product}}</option>
                                <option v-for="item in currentProducts" :value="item._id">
                                    {{ item.productName }}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.invProduct}}</span>
                        </div>
                        <div class="form-group">
                            <label for="invQuantity">{{mcLabel.quantity}}</label>
                            <input type="number" min="0" step="1" class="form-control" id="invQuantity"
                                   :placeholder="mcLabel.quantity" maxlength="12"
                                   v-model="inventory.invQuantity">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.invQuantity}}</span>
                        </div>
                        <div v-if="isAdmin" class="form-group">
                            <label for="invOwner">{{mcLabel.owner}}</label>
                            <select class="form-control" v-model="inventory.invOwner" id="invOwner">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.owner}}</option>
                                <option v-for="item in userItems" :value="item._id">
                                    {{ item.username }} | {{item.profile.firstName}} {{item.profile.lastName}}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.invOwner}}</span>
                        </div>
                        <div class="form-group">
                            <label for="invDesc">{{mcLabel.desc}}</label>
                            <textarea class="form-control" id="invDesc" cols="30" rows="5"
                                      :placeholder="mcLabel.desc" v-model="inventory.invDesc"></textarea>
                            <span v-if="validateErrors" class="alert-warning">{{validateErrors.invDesc}}</span>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-4">
                                <label for="isActive">{{mcLabel.isActive}} </label>
                                <input class="w3-check" type="checkbox" id="isActive" v-model="inventory.isActive">
                            </div>
                            <div class="col-sm-4">
                                <button class="btn btn-primary" @click.prevent="saveInventory">{{mcLabel.save}}</button>
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div class="col-sm-6">
                    <fieldset>
                        <legend><h4>Inventory Location</h4></legend>
                        <div class="form-group">
                            <label for="invCountry">{{mcLabel.country}}</label>
                            <select class="form-control" v-model="inventory.invCountry" id="invCountry" required>
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.country}}</option>
                                <option v-for="item in countries" :value="item._id">
                                    {{ item.locationName }}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.invCountry}}</span>
                        </div>
                        <div class="form-group">
                            <label for="invState">{{mcLabel.state}}</label>
                            <select class="form-control" v-model="inventory.invState" id="invState">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.state}}</option>
                                <option v-for="item in states" :value="item._id">
                                    {{ item.locationName }}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.invState}}</span>
                        </div>
                        <div class="form-group">
                            <!--TODO: change to select/drop-down list-->
                            <label for="invCity">{{mcLabel.city}}</label>
                            <select class="form-control" v-model="inventory.invCity" id="invCity">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.city}}</option>
                                <option v-for="item in cities" :value="item._id">
                                    {{ item.locationName }}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.invCity}}</span>
                        </div>
                        <div class="form-group">
                            <!--TODO: change to select/drop-down list-->
                            <label for="invStore">{{mcLabel.store}}</label>
                            <select class="form-control" v-model="inventory.invStore" id="invStore">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.store}}</option>
                                <option v-for="item in storages" :value="item._id">
                                    {{ item.locationName }}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.invStore}}</span>
                        </div>
                        <div class="form-group">
                            <label for="invCabinet">{{mcLabel.cabinet}}</label>
                            <select class="form-control" v-model="inventory.invCabinet" id="invCabinet">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.cabinet}}</option>
                                <option v-for="item in cabinets" :value="item._id">
                                    {{ item.locationName }}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.invCabinet}}</span>
                        </div>
                        <div class="form-group">
                            <label for="invShelve">{{mcLabel.shelve}}</label>
                            <select class="form-control" v-model="inventory.invShelve" id="invShelve">
                                <option disabled value="">{{mcLabel.select}} {{mcLabel.cabinet}}</option>
                                <option v-for="item in shelves" :value="item._id">
                                    {{ item.locationName }}
                                </option>
                            </select>
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.invShelve}}</span>
                        </div>
                        <div class="form-group">
                            <label for="invPostalCode">{{mcLabel.postalCode}}</label>
                            <input type="text" class="form-control" id="invPostalCode"
                                   :placeholder="mcLabel.postalCode" maxlength="25"
                                   v-model="inventory.invPostalCode">
                            <span v-if="validateErrors"
                                  class="help-block w3-yellow">{{validateErrors.invPostalCode}}</span>
                        </div>
                    </fieldset>
                </div>
            </div>
            <div class="row">
                <div v-if="isMessage" class="w3-container w3-yellow">
                    <p>{{pageMessage}}</p>
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
    import { validateInventory } from '/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    // product, inventory [] (qty, date-added, location...) | qty-total, qty-sold, qty-available

    export default {
        name      : 'orderInventoryDetail',
        components: {},
        data() {
            return {
                mcLabel       : {},
                codeItems     : [],
                locationItems : [],
                userItems     : [],
                langItems     : [],
                productItems  : [],
                inventory     : {
                    invProduct   : '',
                    invQuantity  : 0,
                    invCountry   : '',
                    invState     : '',
                    invCity      : '',
                    invStore     : '',
                    invCabinet   : '',
                    invShelve    : '',
                    invPostalCode: '',
                    invOwner     : '',
                    invDesc      : '',
                    isActive     : false,
                },
                locType       : '',
                pageMessage   : '',
                isMessage     : false,
                itemId        : '',
                itemParams    : '',
                itemParamId   : '',
                isAdmin       : false,
                validateErrors: '',
            }
        },
        computed  : {
            countries() {
                return this.locationItems.filter( ( item ) => {
                    return (item.locationType === 'Country');
                } );
            },
            states() {
                return this.locationItems.filter( ( item ) => {
                    return ((item.locationType === 'State' || item.locationType === 'Province') && item.parentId === this.inventory.invCountry);
                } );
            },
            cities() {
                // Current a free text input, TODO: consider making a select/text input, post data updates
                return this.locationItems.filter( ( item ) => {
                    return ((item.locationType === 'City') && item.parentId === this.inventory.invState);
                } );
            },
            storages() {
                // warehouse / storages
                return this.locationItems.filter( ( item ) => {
                    return ((item.locationType === 'Storage') && item.parentId === this.inventory.invCity);
                } );
            },
            cabinets() {
                // cabinets
                return this.locationItems.filter( ( item ) => {
                    return ((item.locationType === 'Cabinet') && item.parentId === this.inventory.invStore);
                } );
            },
            shelves() {
                // shelves
                return this.locationItems.filter( ( item ) => {
                    return ((item.locationType === 'Shelve') && item.parentId === this.inventory.invCabinet);
                } );
            },
            currentProducts() {
                if( this.itemId ) {
                    return this.productItems.filter( ( item ) => {
                        return item._id === this.inventory.invProduct;
                    } );
                }
                return this.productItems;
            },
        },
        methods   : {
            fetchData() {
                // token
                const userToken     = this.$auth.getToken(),
                      queryParams   = {},
                      currentItemId = '';
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
                    }
                    else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
                if( userToken ) {
                    // products
                    Meteor.call( 'getProduct', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'ProductError: Retry.';
                        } else if( result.code === 'success' ) {
                            this.isMessage    = false;
                            this.pageMessage  = 'Items available';
                            this.productItems = _.sortBy( result.value, 'productName' ).filter( ( item ) => {
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
                            this.locationItems = _.sortBy( result.value, 'locationName' );
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
            saveInventory() {
                // Set invOwner to currentUser, for non-admin-users
                const userInfo = this.$store.getters['central/getCurrentUser'];
                if( userInfo ) {
                    if( !userInfo.isAdmin ) {
                        this.inventory.invOwner = Session.get( 'currentUser' )._id;
                    }
                }

                // cast number items
                this.inventory.invQuantity = Number( this.inventory.invQuantity );

                // validate inputs:
                const errors = validateInventory( this.inventory );
                if( errors.invProduct || errors.invQuantity || errors.invCountry || errors.invState || errors.invCity || errors.invPostalCode || errors.invOwner || errors.invDesc ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveInventory', this.inventory, this.itemId, userToken, ( error, result ) => {
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
            // admin-user status (true or false)
            if( this.$store.getters[ 'central/getCurrentUser' ] ) {
                this.isAdmin = this.$store.getters[ 'central/getCurrentUser' ].isAdmin;
            }
            // labels
            this.mcLabel = this.$label;
            // current item
            const item   = this.$store.getters[ 'central/getInventoryItem' ];
            if( item ) {
                this.itemId    = item._id;
                this.inventory = {
                    invProduct   : item.invProduct,
                    invQuantity  : item.invQuantity,
                    invCountry   : item.invCountry,
                    invState     : item.invState,
                    invCity      : item.invCity,
                    invStore     : item.invStore,
                    invCabinet   : item.invCabinet,
                    invShelve    : item.invShelve,
                    invPostalCode: item.invPostalCode,
                    invOwner     : item.invOwner,
                    invDesc      : item.invDesc,
                    isActive     : item.isActive,
                };
            } else {
                this.itemId    = '';
                this.inventory = {
                    invProduct   : '',
                    invQuantity  : 0,
                    invCountry   : '',
                    invState     : '',
                    invCity      : '',
                    invStore     : '',
                    invCabinet   : '',
                    invShelve    : '',
                    invPostalCode: '',
                    invOwner     : '',
                    invDesc      : '',
                    isActive     : false,
                };
            }
            // fetch records
            this.fetchData();
        },
    }
</script>
