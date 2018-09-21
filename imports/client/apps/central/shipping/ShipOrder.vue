<template>
    <div>
        <!--TODO: ship order-items, partly or fully-->
        <!--orderNo/ship-method, order-items for shipment, -->
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.shipOrder}}</h4>
        </div>
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
        <form class="w3-margin-8">
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="shipOrder">{{mcLabel.orderItem}}</label>
                        <select class="form-control" v-model="ship.shipOrder" id="shipOrder" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.orderItem}}</option>
                            <option v-for="item in shipOrders" :value="item._id">
                                {{ item.orderName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipOrder}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipItems">{{mcLabel.shipItems}}</label>
                        <input type="text" class="form-control" id="shipItems"
                               :placeholder="mcLabel.shipItems" maxlength="255" required autofocus
                               v-model="ship.shipItems">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.shipItems}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipAmount">{{mcLabel.cost}}</label>
                        <input type="number" min="0" step="0.01" class="form-control" id="shipAmount"
                               :placeholder="mcLabel.cost" maxlength="255" required
                               v-model="ship.shipAmount">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.shipAmount}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipMethod">{{mcLabel.shipMethod}}</label>
                        <select class="form-control" v-model="ship.shipMethod" id="shipMethod" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.shipMethod}}</option>
                            <option v-for="item in shipMethods" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipMethod}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipFor">{{mcLabel.customer}}</label>
                        <select class="form-control" v-model="ship.shipFor" id="shipFor" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.customer}}</option>
                            <option v-for="item in userItems" :value="item._id">
                                {{ item.username }} | {{ item.profile.firstName }} {{ item.profile.lastName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipFor}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="shipDesc" cols="30" rows="5"
                                  :placeholder="mcLabel.desc" v-model="ship.shipDesc"></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.shipDesc}}</span>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="shipFrom">{{mcLabel.from}}</label>
                        <select class="form-control" v-model="ship.shipFrom" id="shipFrom" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.from}}</option>
                            <option v-for="item in fromLocations" :value="item.locationCode">
                                {{ item.locationName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipFrom}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipTo">{{mcLabel.to}}</label>
                        <select class="form-control" v-model="ship.shipTo" id="shipTo" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.to}}</option>
                            <option v-for="item in fromLocations" :value="item.locationCode">
                                {{ item.locationName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipTo}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipDate">{{mcLabel.shipDate}}</label>
                        <input type="date" min="0" step="0.01" class="form-control" id="shipDate"
                               :placeholder="mcLabel.shipDate" maxlength="255" required
                               v-model="ship.shipTrack">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.shipDate}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipTrack">{{mcLabel.track}}</label>
                        <input type="text" min="0" step="0.01" class="form-control" id="shipTrack"
                               :placeholder="mcLabel.track" maxlength="255" required
                               v-model="ship.shipTrack">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.shipTrack}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipStatus">{{mcLabel.status}}</label>
                        <select class="form-control" v-model="ship.shipStatus" id="shipStatus" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.status}}</option>
                            <option v-for="item in shipStatuses" :value="item.locationCode">
                                {{ item.locationName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipStatus}}</span>
                    </div>
                    <div class="form-group">
                        <label for="shipLang">{{mcLabel.lang}}</label>
                        <select class="form-control" v-model="ship.shipLang" id="shipLang" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                            <option v-for="item in langItems" :value="item.langCode">
                                {{ item.langName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.shipStatus}}</span>
                    </div>
                    <div class="form-group">
                        <label for="isActive">{{mcLabel.isActive}} </label>
                        <input class="w3-check" type="checkbox" id="isActive" v-model="ship.isActive">
                        <button class="btn btn-primary" @click.prevent="saveShip">
                            {{mcLabel.save}}
                        </button>
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
    import { validateShipping } from'/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';
    const moment = require( 'moment' );

    export default{
        name    : 'shipOrder',
        data() {
            return {
                mcLabel        : {},
                orderItems     : [],
                userItems      : [],
                langItems      : [],
                codeItems      : [],
                shipMethodItems: [],
                locationItems  : [],
                locationType   : 'Country',
                locationFromId : '',
                ship           : {
                    shipOrder   : '',
                    shipItems   : '',
                    shipMethod  : '',
                    shipFor     : '',
                    shipAmount  : 0,
                    shipFrom    : '',
                    shipTo      : '',
                    shipDate    : Date.now(),
                    shipTrack   : '',
                    shipStatus  : '',
                    shipLang    : 'en-US',
                    shipDesc    : '',
                    isActive    : false
                },
                pageMessage    : '',
                isMessage      : false,
                itemId         : '',
                itemParams     : '',
                itemParamId    : '',
                validateErrors : '',
            }
        },
        computed: {
            shipTypes() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Shipping';
                } );
            },
            shipStatuses(){
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Shipping';
                } );
            },
            shippedDate() {
                return moment( this.ship.shipDate ).format( "YYYY-MM-DD" );
            },
            currencies(){
                const parentInfo = this.codeItems.find( ( item ) => {
                    return item.codeName === 'Currency';
                } )
                if( parentInfo ) {
                    return this.codeItems.filter( ( item ) => {
                        return item.codeCat === 'Measurement' && item.parentId === parentInfo._id;
                    } );
                }
            },
            locationTypes() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Location';
                } );
            },
            fromLocations() {
                return this.locationItems.filter( ( item ) => {
                    return item.locationType === 'Country';
                } );
            },
            toLocations() {
                // TODO: shipTo depend on locationFrom and this.locationType (Region, Country, State)
                if( this.locationType === 'State' || this.locationType === 'Province' ) {
                    // Get the locationId of the source country (from seller-profile)
                    const locInfo = this.locationItems.find( ( item ) => {
                        return (item.locationCode === this.shipCost.shipFrom);
                    } );
                    if( locInfo ) {
                        return this.locationItems.filter( ( item ) => {
                            return ((item.locationType === 'State' || item.locationType === 'Province' ) && item.parentId === locInfo._id);
                        } );
                    }
                }
                return this.locationItems.filter( ( item ) => {
                    return item.locationType === this.locationType;
                } );
            },
            shipLocations() {
                return this.locationItems.filter( ( item ) => {
                    return item.locationType === this.locationType;
                } );
            },
            shipOrders() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Location';
                } );
            },
            shipMethods() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Location';
                } );
            },
        },
        methods : {
            setFromLocation( item ){
                this.locationFromId = item._id;
            },

            // Retrieve/get current item/record from the the server/database
            saveShip() {

                // validate inputs
                let errors = validateShipping( this.ship );
                if( errors.shipOrder || errors.shipItems || errors.shipMethod || errors.shipFor || errors.shipAmount || errors.shipFrom || errors.shipTo || errors.shipDate || errors.shipStatus || errors.shipTrack || errors.shipDesc ) {
                    this.validateErrors = errors;
                }

                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveShip', this.ship, this.itemId, userToken, ( error, result ) => {
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
                        this.pageMessage = 'inputs-errors: ' + errors;
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
            // New or draft message
            if( Session.get( 'currentShipItem' ) ) {
                const item  = Session.get( 'currentShipItem' );
                this.itemId = item._id;
                this.ship   = {
                    shipOrder   : item.shipOrder,
                    shipItems   : item.shipItems,
                    shipMethod  : item.shipMethod,
                    shipFor     : item.shipFor,
                    shipAmount  : item.shipAmount,
                    shipFrom    : item.shipFor,
                    shipTo      : item.shipTo,
                    shipDate    : moment( item.shipDate ).format( "YYYY-MM-DD" ),
                    shipTrack   : item.shipTrack,
                    shipStatus  : item.shipStatus,
                    shipLang    : item.shipLang,
                    shipDesc    : item.shipDesc,
                    isActive    : item.isActive
                };
            } else {
                this.itemId = '';
                this.ship   = {
                    shipOrder   : '',
                    shipItems   : '',
                    shipMethod  : '',
                    shipFor     : '',
                    shipAmount  : 0,
                    shipFrom    : '',
                    shipTo      : '',
                    shipDate    : Date.now(),
                    shipTrack   : '',
                    shipStatus  : '',
                    shipLang    : 'en-US',
                    shipDesc    : '',
                    isActive    : false
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
                // providers
                Meteor.call( 'getShipCost', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'ShipMethodError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage       = false;
                        this.pageMessage     = 'Items available';
                        this.shipMethodItems = _.sortBy( result.value, 'shipName' );
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
                        this.locationItems = _.sortBy( result.value, 'locationName' ).filter( ( item ) => {
                            return item.isActive === true;
                        } );
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
    }
</script>