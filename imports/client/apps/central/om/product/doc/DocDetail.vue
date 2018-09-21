<template>
    <div>
        <div class="w3-container w3-blue w3-round-medium w3-margin-8">
            <h4><i class="glyphicon glyphicon-thumbs-up"></i> {{mcLabel.productDocDetail}}</h4>
        </div>
        <form class="w3-margin-8">
            <div v-if="isMessage" class="w3-container w3-yellow">
                <p>{{pageMessage}}</p>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="docProduct">{{mcLabel.product}}</label>
                        <select class="form-control" v-model="doc.docProduct" id="docProduct" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.product}}</option>
                            <option v-for="item in productItems" :value="item._id">{{ item.productName }}</option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.docProduct}}</span>
                    </div>
                    <div class="form-group">
                        <label for="docType">{{mcLabel.type}}</label>
                        <select class="form-control" v-model="doc.docType" id="docType" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.type}}</option>
                            <option v-for="item in docTypes" :value="item.codeName">{{ item.codeName }}</option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.docType}}</span>
                    </div>
                    <div class="form-group">
                        <label for="docOwner">{{mcLabel.owner}}</label>
                        <select class="form-control" v-model="doc.docOwner" id="docOwner" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.owner}}</option>
                            <option v-for="item in userItems" :value="item._id">
                                {{ item.profile.firstName}} {{item.profile.lastName}} | {{item.username}}
                            </option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.docOwner}}</span>
                    </div>
                    <div class="form-group">
                        <label for="docLang">{{mcLabel.lang}}</label>
                        <select class="form-control" v-model="doc.docLang" id="docLang" required>
                            <option disabled value="">{{mcLabel.select}} {{mcLabel.lang}}</option>
                            <option v-for="item in langItems" :value="item.langCode">{{ item.langName}}</option>
                        </select>
                        <span v-if="validateErrors" class="help-block w3-yellow">{{validateErrors.docLang}}</span>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="docName">{{mcLabel.docName}}</label>
                        <input type="text" class="form-control" id="docName"
                               :placeholder="mcLabel.docName" maxlength="255" required
                               v-model="doc.docName">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.docName}}</span>
                    </div>
                    <div class="form-group">
                        <label for="docFile">{{mcLabel.fileName}}</label>
                        <span v-if="doc.docUrl">
                            <a :href="doc.docUrl" target="_blank">[{{doc.docName}}]</a>
                        </span>
                        <input type="file" class="form-control" id="docFile"
                               :placeholder="mcLabel.fileName" maxlength="255" required multiple
                               v-on:change="filesUpdate">
                        <span v-if="validateErrors"
                              class="help-block w3-yellow">{{validateErrors.docFile}}</span>
                    </div>
                    <div class="form-group">
                        <label for="docDesc">{{mcLabel.desc}}</label>
                        <textarea class="form-control" id="docDesc" cols="30" rows="5"
                                  :placeholder="mcLabel.desc" v-model="doc.docDesc" required></textarea>
                        <span v-if="validateErrors" class="alert-warning">{{validateErrors.docDesc}}</span>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-6">
                            <label for="isActive">{{mcLabel.isActive}} </label>
                            <input class="w3-check" type="checkbox" id="isActive" v-model="doc.isActive">
                        </div>
                        <div class="col-sm-6">
                            <button class="btn btn-primary" @click.prevent="saveItem">{{mcLabel.save}}</button>
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
    import { Tracker } from 'meteor/tracker';
    import { Session } from 'meteor/session';
    import { Images, Languages, Documents } from '/imports/collections/Central';
    import { validateDocument, validateProductDocument } from'/imports/lib/utils/ValidateRecord';
    import { Supply } from 'vue-supply';
    import _ from 'lodash';
//    const cloudinary = require('cloudinary');

    export default{
        name      : 'productDocDetail',
        components: {},
        data() {
            return {
                mcLabel       : {},
                codeItems     : [],
                productItems  : [],
                userItems     : [],
                langItems     : [],
                docLangItems  : [],
                doc           : {
                    docProduct: '',
                    docType   : '',
                    docName   : '',
                    docFile   : '',
                    docOwner  : '',
                    docRef    : '',
                    docUrl    : '',
                    docSize   : 0,
                    docLang   : 'en-US',
                    docDesc   : '',
                    isActive  : false
                },
                options       : {
                    url             : '/api/upload',
                    multiple        : true,
                    dragDrop        : true,
                    fileName        : '',
                    fileType        : '',
                    fileSize        : 0,
                    fileCount       : 0,
                    fileSizeDisplay : '',
                    fileCountError  : true,
                    fileSizeError   : true,
                    fileTypeError   : true,
                    fileTypeErrorMsg: [],
                    fileEvent       : '',
                },
                pageMessage   : '',
                isMessage     : false,
                itemId        : '',
                itemParams    : '',
                itemParamId   : '',
                validateErrors: '',
                docSubReady   : '',
                langSubReady  : '',
                imageSubReady : '',
                userIdInfo    : '',
                userInfo      : '',
                currentImage  : {},
            }
        },
        computed  : {
            docProducts(){
                return this.productItems.filter( ( item ) => {
                    return item.active === true;
                } );
            },
            docTypes(){
                return this.codeItems.filter( ( item ) => {
                    return item.codeCat === 'Document Type';
                } );
            },
            languageItems(){
                return Languages.find().fetch();
            },
            imageItems(){
                return Images.find().fetch();
            },
            documentItems(){
                return Documents.find().fetch();
            }
        },
        methods   : {
            fetchData(){
                // token
                const userToken     = this.$auth.getToken(),
                      queryParams   = {},
                      currentItemId = '',
                      recLimit      = this.$constant.getQueryLimit();

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
                    // products
                    Meteor.call( 'getProduct', queryParams, currentItemId, userToken, ( error, result ) => {
                        if( error ) {
                            this.isMessage   = true;
                            this.pageMessage = 'ProductError: Retry.';
                        } else if( result.code === 'success'
                        ) {
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
            imageInfo(){
                this.currentImage = this.imageItems.find( ( item ) => {
                    return item._id === this.doc.docRef;
                } );
                return this.imageItems.find( ( item ) => {
                    return item._id === this.doc.docRef;
                } );
            },
            fileUpdate(){
                // single file operation
                const files  = document.getElementById( 'docFile' ).files;
                const file   = document.getElementById( 'docFile' ).files[ 0 ];
                const nBytes = file.size,
                      nFiles = files.length,
                      nType  = file.type;

                if( file ) {
                    // Check for permitted file-count
                    if( nFiles <= this.$constant.getMaxFileCount() ) {
                        this.options.fileCountError = false;
                    }
                    // Check for permitted file-size
                    if( nBytes <= this.$constant.getMaxFileSize() ) {
                        this.options.fileSizeError = false;
                    }
                    // check for permitted file-type
                    if( nType === 'image/jpeg' || nType === 'image/jpg' || nType === 'image/png' || nType === 'application/pdf' || nType === 'application/doc' || nType === 'application/xls' || nType === 'application/ppt' ) {
                        this.options.fileTypeError = false;
                    }
                    // File size formatting
                    let sOutput = nBytes + " bytes";
                    // optional code for multiples approximation
                    for( let aMultiples = [ "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB" ], nMultiple = 0,
                             nApprox                                                                    = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++ ) {
                        sOutput = nApprox.toFixed( 3 ) + " " + aMultiples[ nMultiple ] + " (" + nBytes + " bytes)";
                    }
                    this.options.fileSizeDisplay = sOutput; // in bytes
                    this.options.fileName        = file.name;
                    this.options.fileSize        = file.size; // in bytes
                    this.options.fileType        = file.type;
                    this.options.fileCount       = files.length;
                }
            },
            filesUpdate(){
                // multiple files operation
                const oFiles = document.getElementById( "docFile" ).files;

                if( oFiles ) {
                    const nFiles = oFiles.length;
                    let nBytes   = 0;

                    // Check for permitted file-count
                    if( nFiles <= this.$constant.getMaxFileCount() ) {
                        this.options.fileCountError = false;
                    }

                    // Total size in bytes for all files and check file-types
                    for( let i = 0; i < nFiles; i++ ) {
                        nBytes += oFiles[ i ].size;
                        // current file-type
                        let fileType = oFiles[ i ].type;
                        // check for permitted file-types
                        if( fileType === 'image/jpeg' || fileType === 'image/jpg' || fileType === 'image/png' || fileType === 'application/pdf' || fileType === 'application/doc' || fileType === 'application/xls' || fileType === 'application/ppt' ) {
                            this.options.fileTypeError = false;
                        } else {
                            this.options.fileTypeError = true;
                            const typeMsg              = {
                                fileName: oFiles[ i ].name,
                                fileMsg : `${fileType}: ${this.$label.fileType}`
                            };
                            this.options.fileTypeErrorMsg.push( typeMsg );
                        }
                    }
                    // Check for permitted file-size
                    if( nBytes <= this.$constant.getMaxFileSize() ) {
                        this.options.fileSizeError = false;
                    }

                    let sOutput = nBytes + " bytes";
                    // optional code for multiples approximation
                    for( let aMultiples = [ "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB" ], nMultiple = 0,
                             nApprox                                                                    = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++ ) {
                        sOutput = nApprox.toFixed( 3 ) + " " + aMultiples[ nMultiple ] + " (" + nBytes + " bytes)";
                    }
                }
            },
            // Retrieve/get current item/record from the the server/database
            saveItem() {
                // files handle
                const files = document.getElementById( 'docFile' ).files;

                // set docName
                if( !this.doc.docName ) {
                    this.doc.docName = this.doc.docProduct;
                }

                // set docOwner
                if( !this.doc.docOwner ) {
                    this.doc.docOwner = Session.get('currentUser')._id;
                }

                // validate inputs: TODO: review/fine-tune
                const errors = validateProductDocument( this.doc );
                if( errors.docProduct || errors.docType || errors.docName || errors.docLang ) {
                    this.validateErrors = errors;
                }
                // check permitted file-types, file-count and file-size
                if( this.options.fileCountError ) {
                    this.isMessage   = true;
                    this.pageMessage = this.$label.fileCount;
                    return;
                }
                if( this.options.fileSizeError ) {
                    this.isMessage   = true;
                    this.pageMessage = this.$label.fileSize;
                    return;
                }
                // token / access key
                const userToken = this.$auth.getToken();
                // Meteor method
                if( userToken ) {
                    if( _.isEmpty( errors ) ) {
                        // reset validateErrors
                        this.validateErrors = '';
                        // upload file(s) to the server
                        for( let i = 0, ln = files.length; i < ln; i++ ) {
                            Images.insert( files[ i ], ( err, fileObj ) => {
                                // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
                                // update the this.doc information: docFile-name
                                if( err ) {
                                    this.isMessage   = true;
                                    this.pageMessage = `${err}: Error saving item. Please retry`;
                                    return;
                                }
                                if( fileObj ) {
//                                    console.log(fileObj);
                                    // docRef
                                    this.doc.docRef  = fileObj._id.toString();
                                    // TODO: docUrl (Product documents / images)
                                    this.doc.docUrl  = '/cfs/files/images/' + fileObj._id.toString();
                                    // document-filename
                                    this.doc.docFile = files[ i ].name;
                                    // document-type
                                    this.doc.docType = files[ i ].type;
                                    // document-size
                                    this.doc.docSize = files[ i ].size;
                                    // set docName for multiple files, using original name as prefix
                                    let docName      = this.doc.docName || this.doc.docProduct || '';
                                    if( docName.includes( '_' ) ) {
                                        docName = docName.split( '_' )[ 0 ]; // original name
                                    }
                                    this.doc.docName = `${docName}_${i}`;
                                    // save file/document information in the documents collection
                                    Meteor.call( 'saveProductDoc', this.doc, this.itemId, userToken, ( error, result ) => {
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
                                }
                            } );
                        }
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
                  currentItemId = '',
                  recLimit      = this.$constant.getQueryLimit();
            this.mcLabel        = this.$label;
            this.userInfo       = Meteor.user();
            this.userIdInfo     = Meteor.userId();
            if( Session.get( 'currentProductDocItem' ) ) {
                const item  = Session.get( 'currentProductDocItem' );
                this.itemId = item._id;
                this.doc    = {
                    docProduct: item.docProduct,
                    docType   : item.docType,
                    docName   : item.docName,
                    docFile   : item.docFile,
                    docOwner  : item.docOwner,
                    docRef    : item.docRef,
                    docUrl    : item.docUrl,
                    docSize   : item.docSize,
                    docLang   : item.docLang,
                    docDesc   : item.docDesc,
                    isActive  : item.isActive
                };
            } else {
                this.itemId = '';
                this.doc    = {
                    docProduct: '',
                    docType   : '',
                    docName   : '',
                    docFile   : '',
                    docOwner  : '',
                    docRef    : '',
                    docUrl    : '',
                    docSize   : 0,
                    docLang   : 'en-US',
                    docDesc   : '',
                    isActive  : false
                };
            }
            // Subscribe to published collections:
            this.imageSubReady = Meteor.subscribe( 'imageAll', queryParams, currentItemId, userToken );
            this.docSubReady   = Meteor.subscribe( 'docAll', queryParams, currentItemId, userToken );
            this.langSubReady  = Meteor.subscribe( 'langAll', queryParams, currentItemId, userToken );

            // Fetch items from the server, based on role assignment / authorization
            this.fetchData();
        },
    }
</script>
