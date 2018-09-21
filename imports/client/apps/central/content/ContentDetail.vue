<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.contentDetail}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="form-group col-sm-12">
                    <label for="contentTitle">{{mcLabel.title}}</label>
                    <input type="text" class="form-control" id="contentTitle"
                           :placeholder="mcLabel.title" maxlength="255" required autofocus
                           v-model="content.contentTitle">
                    <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.contentTitle}}</span>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-12">
                    <label for="contentSubTitle">{{mcLabel.subTitle}}</label>
                    <input type="text" class="form-control" id="contentSubTitle"
                           :placeholder="mcLabel.subTitle" maxlength="100"
                           v-model="content.contentSubTitle">
                    <span v-if="validateErrors"
                          class="help-block w3-yellow">{{validateErrors.contentSubTitle}}</span>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-9">
                    <div class="form-group">
                        <label for="contentDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="contentDesc" cols="60" rows="5"
                                  :placeholder="mcLabel.desc" v-model="content.contentDesc"></textarea>
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.contentDesc}}</span>
                    </div>
                </div>
                <div class="col-sm-3">
                    <div class="form-group">
                        <label for="contentTag">{{mcLabel.tag}}</label>
                        <input type="text" class="form-control" id="contentTag"
                               :placeholder="mcLabel.tag" maxlength="25"
                               v-model="content.contentTag">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.contentTag}}</span>
                    </div>
                    <div class="form-group">
                        <label for="contentPriority">{{mcLabel.priority}}</label>
                        <input type="number" min="0" class="form-control" id="contentPriority"
                               :placeholder="mcLabel.priority" maxlength="255"
                               v-model="content.contentPriority">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.contentPriority}}</span>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-9">
                    <div class="form-group">
                        <label for="contentInfo">{{mcLabel.content}}</label>
                        <textarea class="form-control" id="contentInfo" cols="60" rows="5"
                                  :placeholder="mcLabel.content" v-model="content.contentBody"></textarea>
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.contentBody}}</span>
                    </div>
                    <!--TODO: configure/use rich-text-editor (summernote or similar)-->
                    <!--<label for = "contentBody">{{mcLabel.content}}</label>
                    <div id = "contentBody">
                        {{mcLabel.content}}
                    </div>-->
                    <!--<textarea class="form-control" id="contentDesc" cols="30" rows="10"-->
                    <!--v-model="content.contentDesc"></textarea>-->
                    <!--<span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.contentBody}}</span>-->
                </div>
                <div class="col-sm-3">
                    <div class="form-group">
                        <label for="contentLang">{{mcLabel.lang}}</label>
                        <select class="form-control" v-model="content.contentLang" id="contentLang" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                            <option v-for="item in langItems" :value="item.langCode">
                                {{ item.langName }}
                            </option>
                        </select>
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.contentLang}}</span>
                    </div>
                    <div class="form-group">
                        <label for="contentAccess">{{mcLabel.access}}</label>
                        <select class="form-control" v-model="content.contentAccess" id="contentAccess" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.access}}</option>
                            <option v-for="item in accessLevels" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.contentAccess}}</span>
                    </div>
                    <div class="form-group">
                        <label for="contentType">{{mcLabel.type}}</label>
                        <select class="form-control" v-model="content.contentType" id="contentType" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.type}}</option>
                            <option v-for="item in contentTypes" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.contentType}}</span>
                    </div>
                    <div class="form-group">
                        <label for="contentCat">{{mcLabel.cat}}</label>
                        <select class="form-control" v-model="content.contentCat" id="contentCat" required>
                            <option disabled value="">{{mcLabel.selectCat}}</option>
                            <option v-for="item in contentCategories" :value="item.codeName">
                                {{ item.codeName }}
                            </option>
                        </select>
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.contentCat}}</span>
                    </div>
                    <div class="form-group">
                        <label for="contentParent">{{mcLabel.parent}}</label>
                        <select class="form-control" v-model="content.parentId" id="contentParent">
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.parent}}</option>
                            <option v-for="item in parentItems" :value="item._id">
                                {{ item.contentTitle }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-6">
                            <label for="isActive">{{mcLabel.isActive}} </label>
                            <input class="w3-check" type="checkbox" id="isActive" v-model="content.isActive">
                        </div>
                        <div class="col-sm-6">
                            <button class="btn btn-primary" @click.prevent="saveContent">{{mcLabel.save}}</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div v-if="isMessage" class="w3-container w3-yellow">
            <p>{{pageMessage}}</p>
        </div>
    </div>
</template>

<style>

</style>
<script>
    // View components, locales...
    import { Meteor } from 'meteor/meteor';
    import { validateContent } from '/imports/lib/utils/ValidateRecord';
    import { centralMixin } from "../../../include/mixins/centralMixin";

    const sanitizeHtml = require( 'sanitize-html' );

    export default {
        name      : 'contentDetail',
        components: {
            "vue-html-editor": require( "vue-html-editor" ),
        },
        mixins    : [
            centralMixin
        ],
        data() {
            return {
                contentItems   : [],
                content        : {
                    contentTitle   : '',
                    contentSubTitle: '',
                    contentTag     : '',
                    contentCat     : 'mConnect',
                    contentType    : 'Page',
                    parentId       : '',
                    contentPriority: 100,
                    contentAccess  : 'Private',
                    contentBody    : '',
                    contentDesc    : '',
                    contentLang    : this.$constant.getDefaultLanguage(),
                    isActive       : false,
                },
                testContentBody: '',
                itemId         : '',
                itemParams     : '',
                itemParamId    : '',
                validateErrors : '',

            }
        },
        computed  : {
            // Lookup parents-items, by solution hierarchy (solution-packageGroup-package-function...)
            parentItems() {
                return this.contentItems.filter( ( item ) => {
                    return ((item._id !== this.itemId) && (item.contentCat === this.content.contentCat));
                } );
            },
            accessLevels() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Access';
                } );
            },
            contentTypes() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Content Type';
                } );
            },
            contentCategories() {
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Content Category';
                } );
            },
        },
        methods   : {
            // Retrieve/get current item/record from the the server/database
            saveContent() {
                // validate inputs:
                // TODO: description sanitation
                // this.content.contentBody     = sanitizeHtml( $( '#contentBody' ).summernote( 'code' ) );
                this.content.contentPriority = Number( this.content.contentPriority );
                let errors                   = validateContent( this.content );
                if( errors.contentTitle || errors.contentDesc || errors.contentType || errors.contentCat || errors.contentLang || errors.contentSubTitle || errors.contentTag ) {
                    this.validateErrors = errors;
                }
                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( this.$lo.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        Meteor.call( 'saveContent', this.content, this.itemId, userToken, ( error, result ) => {
                            if( error ) {
                                this.isMessage   = true;
                                this.pageMessage = `${error}: Error saving item. Please retry`;
                            }
                            this.isMessage = true;
                            // capture new record itemId
                            if( result.code === 'inserted' || result.code === 'updated' ) {
                                this.itemId = result.docId;
                            }
                            this.pageMessage = `${result.code}: ${result.value}`;
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
                  currentItemId = '';
            const item   = this.$store.getters[ 'central/getContentItem' ];

            if( item ) {
                this.itemId  = item._id;
                this.content = {
                    contentTitle   : item.contentTitle,
                    contentSubTitle: item.contentSubTitle,
                    contentTag     : item.contentTag,
                    contentCat     : item.contentCat,
                    contentType    : item.contentType,
                    parentId       : item.parentId,
                    contentPriority: item.contentPriority,
                    contentAccess  : item.contentAccess || 'Private',
                    contentBody    : item.contentBody,
                    contentDesc    : item.contentDesc || '',
                    contentLang    : item.contentLang,
                    isActive       : item.isActive,
                };
            } else {
                this.itemId  = '';
                this.content = {
                    contentTitle   : '',
                    contentSubTitle: '',
                    contentTag     : '',
                    contentCat     : 'mConnect',
                    contentType    : 'Page',
                    parentId       : '',
                    contentPriority: 100,
                    contentAccess  : 'Private',
                    contentBody    : '',
                    contentDesc    : '',
                    contentLang    : this.$constant.getDefaultLanguage(),
                    isActive       : false,
                };
            }
            if( userToken ) {
                // services
                Meteor.call( 'getContent', queryParams, currentItemId, userToken, ( error, result ) => {
                    if( error ) {
                        this.isMessage   = true;
                        this.pageMessage = 'ServiceError: Retry.';
                    } else if( result.code === 'success' ) {
                        this.isMessage    = false;
                        this.pageMessage  = 'Items available';
                        this.contentItems = _.sortBy( result.value, 'contentTitle' );
                    } else {
                        this.isMessage   = true;
                        this.pageMessage = `${result.code}: ${result.value}`;
                    }
                } );
            }

            // summernote configuration
            /*$( "#contentBody" ).summernote( {
                height     : 300,
                lineHeight : 20,
                minHeight  : 100,
                placeholder: this.mcLabel.contentBody,
            } );*/

//            $( "#contentDesc" ).summernote( 'code', '' );
        },
        ready() {
            // summernote configuration
            // $( "#contentBody" ).summernote( {
            //     height: 300,
            //     lineHeight: 20,
            //     minHeight: 100,
            //     placeholder: this.mcLabel.contentBody,
            // });

            // summernote value setting (as 'code')
            // $( "#contentBody" ).summernote( 'code', this.content.contentBody );

        },
        updated() {
            // summernote configuration
            /*$( "#contentBody" ).summernote( {
                height: 300,
                lineHeight: 20,
                minHeight: 100,
                placeholder: this.mcLabel.contentBody,
            } );*/

            // summernote value setting (as 'code')
            // $( "#contentBody" ).summernote( 'code', this.contentBody );
        }
    }
</script>
