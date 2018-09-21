<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.catDetail}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="catName">{{mcLabel.name}}</label>
                        <input type="text" class="form-control" id="catName"
                               :placeholder="mcLabel.name" maxlength="255" required autofocus
                               v-model="orderCat.catName">
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.catName}}</span>
                    </div>
                    <div class="form-group">
                        <label for="catParent">{{mcLabel.parent}}</label>
                        <select class="form-control" v-model="orderCat.parentId" id="catParent" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.parent}}</option>
                            <option v-for="item in parentItems" :value="item._id">
                                {{ item.catName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.parentId}}</span>
                    </div>
                    <div class="form-group">
                        <label for="catLang">{{mcLabel.lang}}</label>
                        <select class="form-control" v-model="orderCat.catLang" id="catLang" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                            <option v-for="item in langItems" :value="item.langCode">
                                {{ item.langName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.catLang}}</span>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="catGroup">{{mcLabel.group}}</label>
                        <select class="form-control" v-model="orderCat.catGroup" id="catGroup" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.group}}</option>
                            <option v-for="item in catGroups" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.catGroup}}</span>
                    </div>
                    <div class="form-group">
                        <label for="catDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="catDesc" cols="30" rows="4"
                                  :placeholder="mcLabel.desc" v-model="orderCat.catDesc"></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.catDesc}}</span>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-6">
                            <label for="isActive">{{mcLabel.isActive}} </label>
                            <input class="w3-check" type="checkbox" id="isActive" v-model="orderCat.isActive">
                        </div>
                        <div class="col-sm-6">
                            <button class="btn btn-primary" @click.prevent="saveOrderCat">{{mcLabel.save}}</button>
                        </div>
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
    import { validateOrderCategory } from'/imports/lib/utils/ValidateRecord';
    import _ from 'lodash';

    export default{
        name      : 'orderCatDetail',
        components: {},
        data() {
            return {
                mcLabel       : {},
                codeItems     : [],
                userItems     : [],
                langItems     : [],
                orderCatItems : [],
                orderCat      : {
                    catName  : '',
                    catOwner : '',
                    catGroup : '',
                    parentId : '',
                    catLang  : 'en-US',
                    catDesc  : '',
                    isDefault: false,
                    isActive : true,
                },
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
            parentItems() {
                return this.orderCatItems.filter( ( item ) => {
                    return ((item._id !== this.itemId) && (item.catOwner === this.orderCat.catOwner) && (item.catGroup === this.orderCat.catGroup));
                } );
            },
            catGroups(){
                const salesItem   = this.codeItems.find( ( item ) => {
                    return (item.codeName === 'Sales' && item.codeCat === 'Trading');
                } );
                const financeItem = this.codeItems.find( ( item ) => {
                    return (item.codeName === 'Finance' && item.codeCat === 'Trading');
                } );
                // for admin-users: list all trading groups for sales and finance
                if( Session.get( 'currentUser' ) ) {
                    this.isAdmin = Session.get( 'currentUser' ).isAdmin;
                }
                if( financeItem && salesItem ) {

                }
                // restrict financial category-items for admin-users only
                if( this.isAdmin ) {
                    return this.codeItems.filter( ( item ) => {
                        return (item.codeCat === 'Trading' && (item.parentId === salesItem._id || item.parentId === financeItem._id ));
                    } );
                }
                return this.codeItems.filter( ( item ) => {
                    return (item.codeCat === 'Trading' && item.parentId === salesItem._id);
                } );
            },
        },
        methods   : {
            // Retrieve/get current item/record from the the server/database
            saveOrderCat() {
                // Set catOwner to currentUser
                if( Session.get( 'currentUser' ) ) {
                    this.orderCat.catOwner = Session.get( 'currentUser' )._id;
                }

                // set isDefault to true to specific category/folder items (e.g. 'Cart', 'Wish List')
                if( this.orderCat.catName === 'Cart' || this.orderCat.catName === 'Wish List' ) {
                    this.orderCat.isDefault = true;
                } else {
                    this.orderCat.isDefault = false;
                }

                // validate inputs:
                const errors = validateOrderCategory( this.orderCat );
                if( errors.catName || errors.catOwner || errors.catGroup || errors.catLang || errors.catDesc ) {
                    this.validateErrors = errors;
                }
                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveOrderCat', this.orderCat, this.itemId, userToken, ( error, result ) => {
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
            if( Session.get( 'currentOrderCatItem' ) ) {
                const item    = Session.get( 'currentOrderCatItem' );
                this.itemId   = item._id;
                this.orderCat = {
                    catName  : item.catName,
                    catOwner : item.catOwner,
                    catGroup : item.catGroup,
                    parentId : item.parentId,
                    catLang  : item.catLang,
                    catDesc  : item.catDesc,
                    isDefault: item.isDefault || false,
                    isActive : item.isActive,
                };
            } else {
                this.itemId   = '';
                this.orderCat = {
                    catName  : '',
                    catOwner : '',
                    catGroup : '',
                    parentId : '',
                    catLang  : 'en-US',
                    catDesc  : '',
                    isDefault: false,
                    isActive : true,
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
                // folders
                Meteor.call( 'getOrderCat', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'OrderCatError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage     = false;
                        this.pageMessage   = 'Items available';
                        this.orderCatItems = _.sortBy( result.value, 'catName' ).filter( ( item ) => {
                            return item.isActive === true;
                        } );
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