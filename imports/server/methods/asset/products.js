/**
 * Created by abbeymart on 2017-03-13.
 * product samples, list/details (goods and services - sales, subscription): itemId/Name, itemFeatures[], cost,
 * costUnit (one-time, monthly, quarterly, yearly etc.), discounts[], shipping[], description etc. carts | wishes...
 * TODO: shipping per product, include in product-feature.
 */
// Import required module(s)
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import {
    validateProduct,
    validateProductFeature,
    validateWish,
    validatePrice,
    validateDiscount,
    validateInventory,
    validateProductDocument,
    validateProductReview,
} from '/imports/lib/utils/ValidateRecord';
import { mcMessage } from '/imports/lib/locales/getMessage';
import saveRecord from '../central/shared/saveRecord';
import removeRecord from '../central/shared/removeRecord';
import getRecord from '../central/shared/getRecord';
import getTextRecord from '../central/shared/getTextRecord';
import { checkError, validateError } from '../central/shared/utils';
import { Products, Prices, Discounts, Features, ProductDocuments, Inventories } from "/imports/collections/Asset";
import { Wishes } from "/imports/collections/Mpe";

Meteor.methods( {
    getProduct( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Products', { collParams, currentDocId, token } );
    },
    getProductText( searchText = '', token = '', skip = 0, limit = 100000 ) {
        try {
            check( searchText, String );
            check( token, String );
            check( skip, Number );
            check( limit, Number );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getTextRecord( 'Products', { searchText, token, skip, limit } );
    },
    saveProduct( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                productCode         : String,   // auto-generate (unique)
                productName         : String,
                productKeyword      : String,
                productCat          : String,
                productGroup        : String,  // good | service??
                productCountry      : String,
                productState        : String,
                productCity         : String,
                productPostalCode   : String,
                productOwner        : String,
                productCost         : Number,
                productCurrency     : String,
                productCostUnit     : String,  // monthly, quarterly, half-year, 1year, 2years, 3years
                productTax          : String,  // [{},]
                productQuantity     : Number,  // Cumulative inventory, prior + new items
                productQuantityTotal: Number,
                productSold         : Number,  // increment from orders
                productImage        : String,  // [{},]
                productFeature      : Object,  // {color, size...}
                productDesc         : String,
                productShip         : String,
                productUrl          : String,
                productMarket       : String,
                productLang         : String,
                parentId            : String,
                isTrade             : Boolean,
                isTax               : Boolean,
                isActive            : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items , checked also on the client side
        const errors = validateProduct( collParams );
        if( errors.productName || errors.productKeyword || errors.productCat || errors.productGroup || errors.productOwner || errors.productCost || errors.productCostUnit || errors.productTax || errors.productDesc || errors.productQuantity || errors.productShip || errors.productCountry || errors.productState || errors.productCity || errors.productPostalCode || errors.productUrl ) {
            return validateError( errors );
        }

        // Save method check, for new document/record:
        // Check duplicate document with the same attribute, for save method, to ensure uniqueness
        const duplicateDoc = Products.findOne(
            {
                productName  : collParams.productName,
                productCat   : collParams.productCat,
                productOwner : collParams.productOwner,
                productMarket: collParams.productMarket,
            }
        ) ? true : false;

        // Update method check, for existing record:
        // Check if other document with the same / changed name exist, to avoid duplicate name
        const docNotUnique = Products.findOne(
            {
                _id          : { $ne: currentDocId },
                productName  : collParams.productName,
                productCat   : collParams.productCat,
                productOwner : collParams.productOwner,
                productMarket: collParams.productMarket,
            }
        ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Products', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeProduct( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Products', currentDocId, token );
    },
    getFeature( collParams = {}, currentDocId = '', token = '' ) {
        // key : value
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Features', { collParams, currentDocId, token } );
    },
    saveFeature( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                featureProduct      : String,
                featureKey          : String,
                featureValue        : String,
                featureCost         : Number,
                featureCostUnit     : String,  // monthly, quarterly, half-year, 1year, 2years, 3years
                featureDiscount     : Number,
                featureDiscountUnit : String,  // # || % (ref: taxes package)
                featureDiscountStart: String,
                featureDiscountEnd  : String,
                featureTax          : String,
                featureImage        : String,
                featureDesc         : String,
                featureQuantity     : Number,
                featureSold         : Number,
                isTrade             : Boolean,
                isActive            : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items , checked also on the client side
        const errors = validateProductFeature( collParams );
        if( errors.featureProduct || errors.featureKey || errors.featureValue || errors.featureCost || errors.featureCostUnit || errors.featureDesc || errors.featureDiscount || errors.featureDiscountUnit || errors.featureDiscountStart || errors.featureDiscountEnd || errors.featureQuantity ) {
            return validateError( errors );
        }

        // Save method check, for new document/record:
        // Check if a duplicate document with the same todoName, todoType, todoLang and todoService exists, for save
        // method, to ensure uniqueness
        const duplicateDoc = Features.findOne(
            {
                featureKey    : collParams.featureKey,
                featureProduct: collParams.featureProduct,
            }
        ) ? true : false;

        // Update method check, for existing record:
        // Check if other document with the same / changed name exist, to avoid duplicate name
        const docNotUnique = Features.findOne(
            {
                _id           : { $ne: currentDocId },
                featureKey    : collParams.featureKey,
                featureProduct: collParams.featureProduct,
            }
        ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Features', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeFeature( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Features', currentDocId, token );
    },
    getPrice( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Prices', { collParams, currentDocId, token } );
    },
    savePrice( collParams, currentDocId, token = '' ) {
        // Group pricing (B2B, B2C, G2B, G2G, G2C etc.) by role/user-group
        // Check the attributes formats
        try {
            check( collParams, {
                product    : String,
                cost       : Number,
                currency   : String,
                unit       : String,
                startDate  : String,
                endDate    : String,
                group      : String,
                minQuantity: Number,
                maxQuantity: Number,
                desc       : String,
                isActive   : Boolean,
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items , checked also on the client side
        const errors = validatePrice( collParams );
        if( errors.product || errors.cost || errors.currency || errors.unit || errors.startDate || errors.endDate || errors.group || errors.minQuantity || errors.maxQuantity || errors.desc ) {
            return validateError( errors );
        }

        // Save method check, for new document/record:
        // Check duplicate document with the same attribute, for save method, to ensure uniqueness
        const duplicateDoc = Prices.findOne(
            {
                product  : collParams.product,
                group    : collParams.group,
                startDate: collParams.startDate,
                endDate  : collParams.endDate,
            }
        ) ? true : false;

        // Update method check, for existing record:
        // Check if other document with the same / changed name exist, to avoid duplicate name
        const docNotUnique = Prices.findOne(
            {
                _id      : { $ne: currentDocId },
                product  : collParams.product,
                group    : collParams.group,
                startDate: collParams.startDate,
                endDate  : collParams.endDate,
            }
        ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Prices', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removePrice( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Prices', currentDocId, token );
    },
    getDiscount( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Discounts', { collParams, currentDocId, token } );
    },
    saveDiscount( collParams, currentDocId, token = '' ) {
        // Group pricing (B2B, B2C, G2B, G2G, G2C etc.) by role/user-group
        // Check the attributes formats
        // console.log(collParams, currentDocId);
        // return;

        try {
            check( collParams, {
                code       : String,
                amount     : Number,
                unit       : String,
                startDate  : String,
                endDate    : String,
                group      : String,
                minQuantity: Number,
                maxQuantity: Number,
                desc       : String,
                beforeTax  : Boolean,
                afterTax   : Boolean,
                isActive   : Boolean,
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items , checked also on the client side
        const errors = validateDiscount( collParams );
        if( errors.code || errors.cost || errors.currency || errors.unit || errors.startDate || errors.endDate || errors.group || errors.minQuantity || errors.maxQuantity || errors.desc ) {
            return validateError( errors );
        }

        // Save method check, for new document/record:
        // Check duplicate document with the same attribute, for save method, to ensure uniqueness
        const duplicateDoc = Discounts.findOne(
            {
                code     : collParams.code,
                group    : collParams.group,
                startDate: collParams.startDate,
                endDate  : collParams.endDate,
            }
        ) ? true : false;

        // Update method check, for existing record:
        // Check if other document with the same / changed name exist, to avoid duplicate name
        const docNotUnique = Discounts.findOne(
            {
                _id      : { $ne: currentDocId },
                code     : collParams.code,
                group    : collParams.group,
                startDate: collParams.startDate,
                endDate  : collParams.endDate,
            }
        ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Discounts', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeDiscount( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Prices', currentDocId, token );
    },
    getInventory( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Inventories', { collParams, currentDocId, token } );
    },
    saveInventory( collParams, currentDocId, token = '' ) {
        // product, inventory [] (qty, date-added, location...) | qty-total, qty-sold, qty-available
        // Check the attributes formats
        try {
            check( collParams, {
                invProduct   : String,
                invQuantity  : Number,
                invCountry   : String,
                invState     : String,
                invCity      : String,
                invStore     : String,
                invCabinet   : String,
                invShelve    : String,
                invPostalCode: String,
                invOwner     : String,
                invDesc      : String,
                isActive     : Boolean
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items , checked also on the client side
        const errors = validateInventory( collParams );
        if( errors.invProduct || errors.invQuantity || errors.invCountry || errors.invState || errors.invCity || errors.invPostalCode || errors.invOwner || errors.invDesc ) {
            return validateError( errors );
        }

        // Save method check, for new document/record:
        // Check duplicate document with the same attribute, for save method, to ensure uniqueness
        const duplicateDoc = false;

        // Update method check, for existing record:
        // Check if other document with the same / changed name exist, to avoid duplicate name
        const docNotUnique = false;

        // TODO: store/update qty-total for the product (coll: products)
        // wrap in a try-catch or transaction* block
        // scenario-1, new inventory-item(currentDocId = ''): current-qty-total + collParams.invQuantity
        if( !currentDocId ) {
            try {
                // get current-qty-total from products collection:
                const currentProduct = Products.findOne( { _id: collParams.invProduct } );
                let currentTotal     = 0;
                if( currentProduct ) {
                    if( currentProduct.productQuantityTotal ) {
                        currentTotal = currentProduct.productQuantityTotal + collParams.invQuantity;
                    } else {
                        currentTotal = collParams.invQuantity;
                    }
                } else {
                    currentTotal = collParams.invQuantity;
                }
                // update product-collection, for invProduct, with the productQuantityTotal
                const productInvUpdate = Products.update( { _id: collParams.invProduct }, { $set: { productQuantityTotal: currentTotal } } );
                // save inventory-item
                if( productInvUpdate ) {
                    // Call saveRecord method to create new or update existing record
                    return saveRecord( 'Inventories', collParams, currentDocId, duplicateDoc, docNotUnique, token );
                } else {
                    return {
                        code   : 'insertError',
                        resCode: 403,
                        value  : 'Error updating product-inventory-quantity'
                    };
                }
            } catch( error ) {
                return {
                    code   : 'insertError',
                    resCode: 403,
                    value  : error.reason + ': ' + mcMessage.insertErrorMessage
                };
            }
        }
        // scenario-2, updated inventory-item(currentDocId !=''):
        // current-qty-total - prior/current-invQuantity + collParams.invQuantity
        if( currentDocId ) {
            try {
                // get prior/current-invQuantity from inventories collection:
                const priorInvItem   = Inventories.findOne( { _id: currentDocId } );
                // get current-qty-total from products collection:
                const currentProduct = Products.findOne( { _id: collParams.invProduct } );
                let currentTotal     = 0;
                if( currentProduct ) {
                    if( currentProduct.productQuantityTotal ) {
                        currentTotal = currentProduct.productQuantityTotal - priorInvItem.invQuantity + collParams.invQuantity;
                    } else {
                        currentTotal = collParams.invQuantity;
                    }
                } else {
                    currentTotal = collParams.invQuantity;
                }
                // update product-collection, for invProduct, with the productQuantityTotal
                const productInvUpdate = Products.update( { _id: collParams.invProduct }, { $set: { productQuantityTotal: currentTotal } } );
                // save inventory-item
                if( productInvUpdate ) {
                    // Call saveRecord method to create new or update existing record
                    return saveRecord( 'Inventories', collParams, currentDocId, duplicateDoc, docNotUnique, token );
                } else {
                    return {
                        code   : 'insertError',
                        resCode: 403,
                        value  : 'Error updating product-inventory-quantity'
                    };
                }
            } catch( error ) {
                return {
                    code   : 'updateError',
                    resCode: 403,
                    value  : error.reason + ': ' + mcMessage.updateErrorMessage
                };
            }
        }
    },
    removeInventory( currentDocId, token = '' ) {
        // TODO: perform inventory updates in products collection OR disable delete action (preferred, for audit
        // purposes) Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }
        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Inventories', currentDocId, token );
    },
    getWish( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'Wishes', { collParams, currentDocId, token } );
    },
    saveWishItem( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                wishProduct    : String,
                wishProductName: String,
                wishFolder     : String,
                wishPriority   : String,
                wishUrl        : String,
                wishQuantity   : Number,
                wishPurchased  : Number,
                wishDesc       : String,
                wishOwner      : String,
                isActive       : Boolean,
            } );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items , checked also on the client side
        const errors = validateWish( collParams );
        if( errors.wishProduct || errors.wishProductName || errors.wishFolder || errors.wishPriority || errors.wishUrl || errors.wishQuantity || errors.wishDesc ) {
            return validateError( errors );
        }

        // Save method check, for new document/record:
        // Check if a duplicate document with the same todoName, todoType, todoLang and todoService exists, for save
        // method, to ensure uniqueness
        let duplicateDoc = false;

        // check the existing wishId for a wishProduct/wishFolder/wishOwner
        const currentWish = Wishes.findOne(
            {
                wishProduct: collParams.wishProduct,
                wishFolder : collParams.wishFolder,
                wishOwner  : collParams.wishOwner,
            }
        );
        if( currentWish ) {
            duplicateDoc             = true;
            currentDocId             = currentWish._id;
            collParams.wishQuantity  = collParams.wishQuantity || currentWish.wishQuantity;
            collParams.wishPurchased = collParams.wishPurchased + currentWish.wishPurchased;
            collParams.wishPriority  = collParams.wishPriority || currentWish.wishPriority;
            collParams.wishUrl       = collParams.wishUrl || currentWish.wishUrl;
            collParams.wishDesc      = collParams.wishDesc || currentWish.wishDesc;
        }

        // Update method check, for existing record:
        // Check if other document with the same / changed name exist, to avoid duplicate name
        const docNotUnique = Wishes.findOne(
            {
                _id        : { $ne: currentDocId },
                wishProduct: collParams.wishProduct,
                wishFolder : collParams.wishFolder,
                wishOwner  : collParams.wishOwner,
            }
        ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Wishes', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeWishItem( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'Wishes', currentDocId, token );
    },
    getProductDoc( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'ProductDocuments', { collParams, currentDocId, token } );
    },
    saveProductDoc( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                docProduct: String,
                docType   : String,
                docName   : String,
                docFile   : String,
                docOwner  : String,
                docRef    : String,
                docUrl    : String,
                docSize   : Number,
                docLang   : String,
                docDesc   : String,
                isActive  : Boolean
            } );
            check( currentDocId, String );
            check( token, String );

        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateProductDocument( collParams );
        if( errors.docCat || errors.docType || errors.docName || errors.docLang ) {
            return validateError( errors );
        }

        // reset currentDocId, to create a new record/document, for multiple file-upload
        // condition: if docFile/docName/docOwner does not existing
        const docExist = ProductDocuments.findOne( {
            docProduct: collParams.docProduct,
            docFile   : collParams.docFile,
            docOwner  : collParams.docOwner,
        } );
        if( !docExist ) {
            currentDocId = '';
        }

        // Insert: check if duplicate record exists
        const duplicateDoc = ProductDocuments.findOne( {
            docProduct: collParams.docProduct,
            docFile   : collParams.docFile,
            docOwner  : collParams.docOwner,
        } ) ? true : false;

        // Update: check if another record with the same information/name exists
        const docNotUnique = ProductDocuments.findOne( {
            _id       : {
                $ne: currentDocId
            },
            docProduct: collParams.docProduct,
            docFile   : collParams.docFile,
            docOwner  : collParams.docOwner,
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'ProductDocuments', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeProductDoc( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'ProductDocuments', currentDocId, token );
    },
    getProductReview( collParams = {}, currentDocId = '', token = '' ) {
        try {
            check( collParams, Object );
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Get items, for authenticated / authorized user, by token
        return getRecord( 'ProductReviews', { collParams, currentDocId, token } );
    },
    saveProductReview( collParams, currentDocId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                reviewProduct     : String,
                reviewProductScore: Number,
                reviewPriceScore  : Number,
                reviewShipScore   : Number,
                reviewSellerScore : Number,
                reviewValueScore  : Number,
                reviewBy          : String,
                reviewLang        : String,
                reviewDesc        : String,
                isActive          : Boolean
            } );
            check( currentDocId, String );
            check( token, String );

        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items, checked also on the client side
        const errors = validateProductReview( collParams );
        if( errors.reviewProduct || errors.reviewProductScore || errors.reviewSellerScore || errors.reviewPriceScore || errors.reviewShipScore || errors.reviewValueScore || errors.reviewBy || errors.reviewLang || errors.reviewDesc ) {
            return validateError( errors );
        }

        // reset currentDocId, to create a new record/document, for multiple file-upload
        // condition: if docFile/docName/docOwner does not existing
        const docExist = ProductDocuments.findOne( {
            docProduct: collParams.docProduct,
            docFile   : collParams.docFile,
            docOwner  : collParams.docOwner,
        } );
        if( !docExist ) {
            currentDocId = '';
        }

        // Insert: check if duplicate record exists
        const duplicateDoc = ProductDocuments.findOne( {
            docProduct: collParams.docProduct,
            docFile   : collParams.docFile,
            docOwner  : collParams.docOwner,
        } ) ? true : false;

        // Update: check if another record with the same information/name exists
        const docNotUnique = ProductDocuments.findOne( {
            _id       : {
                $ne: currentDocId
            },
            docProduct: collParams.docProduct,
            docFile   : collParams.docFile,
            docOwner  : collParams.docOwner,
        } ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'ProductReviews', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },
    removeProductReview( currentDocId, token = '' ) {
        // Check the attributes formats, using the try catch to track any errors
        try {
            check( currentDocId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Perform the remove action, calling shared / refactored method
        return removeRecord( 'ProductReviews', currentDocId, token );
    },
    saveWishToCart( collParams, tradeCartId, token = '' ) {
        // Check the attributes formats
        try {
            check( collParams, {
                tradeProduct     : String,
                tradeWishQuantity: Number,
                tradeOwner       : String,
            } );
            check( tradeCartId, String );
            check( token, String );
        } catch( error ) {
            return checkError( error );
        }

        // Check mandatory data items , checked also on the client side
        const errors = validateWish( collParams );
        if( errors.wishProduct || errors.wishProductName || errors.wishFolder || errors.wishPriority || errors.wishUrl || errors.wishQuantity || errors.wishDesc ) {
            return validateError( errors );
        }

        // Save method check, for new document/record:
        // Check if a duplicate document with the same todoName, todoType, todoLang and todoService exists, for save
        // method, to ensure uniqueness
        const duplicateDoc = Wishes.findOne(
            {
                wishProduct: collParams.wishProduct,
                wishFolder : collParams.wishFolder,
                wishOwner  : collParams.wishOwner,
            }
        ) ? true : false;

        // TODO: wish-item-to-cart updates
        // check if tradeProduct in the cart(cart-folder)
        // scenario 1: new item - insert item to cart, include tradeWishQuantity)
        // scenario 2: existing item - update item/qty+ to cart, include tradeWishQuantity)


        // check the existing wishId for a wishProduct/wishFolder/wishOwner

        let currentDocId = tradeCartId;

        const currentWish = Wishes.findOne(
            {
                wishProduct: collParams.wishProduct,
                wishFolder : collParams.wishFolder,
                wishOwner  : collParams.wishOwner,
            }
        );
        if( currentWish ) {
            currentDocId             = currentWish._id;
            // collParams.wishQuantity = collParams.wishQuantity + currentWish.wishQuantity;
            collParams.wishPurchased = collParams.wishPurchased || currentWish.wishPurchased;
            collParams.wishPriority  = collParams.wishPriority || currentWish.wishPriority;
            collParams.wishUrl       = collParams.wishUrl || currentWish.wishUrl;
            collParams.wishDesc      = collParams.wishDesc || currentWish.wishDesc;
        }

        // Update method check, for existing record:
        // Check if other document with the same / changed name exist, to avoid duplicate name
        const docNotUnique = Wishes.findOne(
            {
                _id        : { $ne: currentDocId },
                wishProduct: collParams.wishProduct,
                wishFolder : collParams.wishFolder,
                wishOwner  : collParams.wishOwner,
            }
        ) ? true : false;

        // Call saveRecord method to create new or update existing record
        return saveRecord( 'Wishes', collParams, currentDocId, duplicateDoc, docNotUnique, token );
    },

} );
