/**
 * Created by abbeymart on 2016-02-14.
 * <b>Central/Shared packages validation function - for central collections </b>
 * Explicitly validate fields/parameters : check the mandatory fields, then the format
 * This is a backend data entry and format validation to ensure complete/correct data inputs
 */
"use strict";

// Import required module(s)
import { utils } from '/imports/lib/utils/Utility';
import { mcMessage } from '/imports/lib/locales/getMessage';
import { validate } from './ValidateData';
import _ from 'lodash';

// Records validation

export function validateAct( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( !collItems.actCat ) {
        errors.actCat = mcMessage.catRequired || "required-error";
    }

    if( collItems.actTitle ) {
        const test = validate.isWordSpace( collItems.actTitle );
        if( !test ) {
            errors.actTitle = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.actTitle = mcMessage.nameRequired || "required-error";
    }

    if( !collItems.actMin ) {
        errors.actMin = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.actMax ) {
        errors.actMax = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.actLevel ) {
        errors.actLevel = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.actLang ) {
        errors.actLang = mcMessage.langRequired || "required-error";
    }

    if( collItems.actDesc ) {
        // Check input formats/patterns
        const testDesc = validate.isDescription( collItems.actDesc );
        if( !testDesc ) {
            errors.actDesc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateActLevel( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( !collItems.act ) {
        errors.actCat = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.level ) {
        errors.level = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.group ) {
        errors.group = mcMessage.infoRequired || "required-error";
    }

    if( collItems.desc ) {
        // Check input formats/patterns
        const testDesc = validate.isDescription( collItems.desc );
        if( !testDesc ) {
            errors.desc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateAddress( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( collItems.contactName ) {
        // Check input formats/patterns
        const testName = validate.isStringChar( collItems.contactName );
        if( !testName ) {
            errors.contactName = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.contactName = mcMessage.nameRequired || "required-error";
    }

    if( collItems.contactPhone ) {
        // Check input formats/patterns
        const testPhone = validate.isPhone( collItems.contactPhone );
        if( !testPhone ) {
            errors.contactPhone = mcMessage.descFormat || "format-error";
        }
    }

    if( collItems.streetNumber ) {
        // Check input formats/patterns
        const testNumber = validate.isNumberDigit( collItems.streetNumber );
        if( !testNumber ) {
            errors.streetNumber = mcMessage.numberFormat || "format-error";
        }
    } else {
        errors.streetNumber = mcMessage.numberRequired || "required-error";
    }

    if( collItems.streetName ) {
        // Check input formats/patterns
        const testName = validate.isWordSpace( collItems.streetName );
        if( !testName ) {
            errors.streetName = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.streetName = mcMessage.nameRequired || "required-error";
    }

    if( collItems.postalCode ) {
        // Check input formats/patterns
        const testCode = validate.isPostalCode( collItems.streetName );
        if( !testCode ) {
            errors.postalCode = mcMessage.postalCodeFormat || "format-error";
        }
    } else {
        errors.postalCode = mcMessage.infoRequired || "required-error";
    }

    if( collItems.addressCity ) {
        // Check input formats/patterns
        const testName = validate.isWordSpace( collItems.addressCity );
        if( !testName ) {
            errors.addressCity = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.addressCity = mcMessage.infoRequired || "required-error";
    }

    if( collItems.addressDesc ) {
        // Check input formats/patterns
        const testDesc = validate.isWordSpace( collItems.addressDesc );
        if( !testDesc ) {
            errors.addressDesc = mcMessage.descFormat || "format-error";
        }
    }

    if( !collItems.addressType ) {
        errors.addressType = mcMessage.typeRequired || "required-error";
    }

    if( !collItems.addressCountry ) {
        errors.addressCountry = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.addressState ) {
        errors.addressState = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.addressLang ) {
        errors.addressLang = mcMessage.langRequired || "required-error";
    }

    return errors;
}

export function validateAssign( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( !collItems.assignTodo ) {
        errors.assignTodo = mcMessage.nameRequired || "required-error";
    }
    if( !collItems.assignUser ) {
        errors.assignUser = mcMessage.nameRequired || "required-error";
    }

    return errors;
}

export function validateAudit( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};


    return errors;
}

export function validateContact( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( collItems.contactFirstName ) {
        // Check input formats/patterns
        const testName = validate.isNameNoSpace( collItems.contactFirstName );
        if( !testName ) {
            errors.contactFirstName = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.contactFirstName = mcMessage.nameRequired || "required-error";
    }

    if( collItems.contactLastName ) {
        // Check input formats/patterns
        const testName = validate.isNameNoSpace( collItems.contactLastName );
        if( !testName ) {
            errors.contactLastName = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.contactLastName = mcMessage.nameRequired || "required-error";
    }

    if( collItems.contactMiddleName ) {
        // Check input formats/patterns
        const testName = validate.isNameNoSpace( collItems.contactMiddleName );
        if( !testName ) {
            errors.contactMiddleName = mcMessage.nameFormat || "format-error";
        }
    }

    if( collItems.contactAddress ) {
        // Check input formats/patterns
        const testName = validate.isWordSpace( collItems.contactAddress );
        if( !testName ) {
            errors.contactAddress = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.contactAddress = mcMessage.itemRequired || "required-error";
    }

    if( collItems.contactPhone ) {
        // Check input formats/patterns
        const testNumber = validate.isPhone( collItems.contactPhone );
        if( !testNumber ) {
            errors.contactPhone = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.contactPhone = mcMessage.phoneRequired || "required-error";
    }

    if( collItems.contactEmail ) {
        // Check input formats/patterns
        const testEmail = validate.isEmail( collItems.contactEmail );
        if( !testEmail ) {
            errors.contactEmail = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.contactEmail = mcMessage.itemRequired || "required-error";
    }

    if( collItems.contactDesc ) {
        // Check input formats/patterns
        const testName = validate.isDescription( collItems.contactDesc );
        if( !testName ) {
            errors.contactDesc = mcMessage.nameFormat || "format-error";
        }
    }

    if( !collItems.contactLang ) {
        errors.contactLang = mcMessage.langRequired || "required-error";
    }

    return errors;
}

export function validateContent( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( collItems.contentTitle ) {
        // Check input formats/patterns
        const testContentTitle = validate.isWordSpace( collItems.contentTitle );
        if( !testContentTitle ) {
            errors.contentTitle = mcMessage.titleFormat || "format-error";
        }
    } else {
        errors.contentTitle = mcMessage.titleRequired || "required-error";
    }
    if( collItems.contentSubTitle ) {
        // Check input formats/patterns
        const testContentSubTitle = validate.isWordSpace( collItems.contentSubTitle );
        if( !testContentSubTitle ) {
            errors.contentSubTitle = mcMessage.titleFormat || "format-error";
        }
    }
    if( collItems.contentTag ) {
        // Check input formats/patterns
        const testContentTag = validate.isPathName( collItems.contentTag );
        if( !testContentTag ) {
            errors.contentTag = mcMessage.pathFormat || "format-error";
        }
    }
    //if ( collItems.contentDesc) {
    //    // Check for permissible formats, to avoid XSS injections
    //    errors.contentDesc = mcMessage.descFormat || "format-error";
    //}
    if( !collItems.contentType ) {
        errors.contentType = mcMessage.typeRequired || "required-error";
    }
    if( !collItems.contentCat ) {
        errors.contentCat = mcMessage.catRequired || "required-error";
    }
    if( !collItems.contentLang ) {
        errors.contentLang = mcMessage.langRequired || "required-error";
    }

    if( collItems.contentDesc ) {
        // Check input formats/patterns
        const testDesc = validate.isDescription( collItems.contentDesc );
        if( !testDesc ) {
            errors.contentDesc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateConvert( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( collItems.convertValue ) {
        // Check input formats/patterns
        const testNumberFloat = validate.isNumberFloat( collItems.convertValue ),
              testNumberDigit = validate.isNumberDigit( collItems.convertValue );
        if( !testNumberFloat || !testNumberDigit ) {
            errors.convertValue = mcMessage.numberFormat || "format-error";
        }
    } else {
        errors.convertValue = mcMessage.numberRequired || "required-error";
    }

    if( !collItems.convertCat ) {
        errors.convertCat = mcMessage.catRequired || "required-error";
    }
    if( !collItems.convertFrom ) {
        errors.convertFrom = mcMessage.nameRequired || "required-error";
    }
    if( !collItems.convertTo ) {
        errors.convertTo = mcMessage.nameRequired || "required-error";
    }
    if( !collItems.convertLang ) {
        errors.ceonvertLang = mcMessage.langRequired || "required-error";
    }
    if( collItems.convertDesc ) {
        // Check input formats/patterns
        const testDesc = validate.isDescription( collItems.convertDesc );
        if( !testDesc ) {
            errors.convertDesc = mcMessage.descFormat || "format-error";
        }
    }
    return errors;
}

export function validateCurrency( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    return errors;
}

export function validateDelegation( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};


    return errors;
}

export function validateDocument( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( !collItems.docCat ) {
        errors.docCat = mcMessage.catRequired || "required-error";
    }
    if( !collItems.docType ) {
        errors.docType = mcMessage.typeRequired || "required-error";
    }
    if( !collItems.docName ) {
        errors.docName = mcMessage.nameRequired || "required-error";
    }
    if( !collItems.docLang ) {
        errors.docLang = mcMessage.langRequired || "required-error";
    }
    return errors;
}

export function validateProductDocument( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( !collItems.docProduct ) {
        errors.docProduct = mcMessage.infoRequired || "required-error";
    }
    if( !collItems.docType ) {
        errors.docType = mcMessage.typeRequired || "required-error";
    }
    if( !collItems.docName ) {
        errors.docName = mcMessage.nameRequired || "required-error";
    }
    if( !collItems.docLang ) {
        errors.docLang = mcMessage.langRequired || "required-error";
    }
    return errors;
}


export function validateEman( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( collItems.emanCode ) {
        // Check input formats/patterns
        const testCode = validate.isErrorCode( collItems.emanCode );
        if( !testCode ) {
            errors.emanCode = mcMessage.codeFormat || "format-error";
        }
    } else {
        errors.emanCode = mcMessage.codeRequired || "required-error";
    }
    if( collItems.emanMessage ) {
        // Check input formats/patterns
        const testMessage = validate.isWordSpace( collItems.emanMessage );
        if( !testMessage ) {
            errors.emanMessage = mcMessage.codeFormat || "format-error";
        }
    } else {
        errors.emanMessage = mcMessage.codeRequired || "required-error";
    }
    if( !collItems.emanLang ) {
        errors.emanLang = mcMessage.langRequired || "required-error";
    }
    if( !collItems.emanType ) {
        errors.emanType = mcMessage.typeRequired || "required-error";
    }
    if( collItems.emanDesc ) {
        // Check input formats/patterns
        const testDesc = validate.isWordSpace( collItems.emanDesc );
        if( !testDesc ) {
            errors.emanDesc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateElog( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    return errors;
}

export function validateFolder( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( !collItems.folderName ) {
        errors.folderName = mcMessage.nameRequired || "required-error";
    }
    if( !collItems.folderOwner ) {
        errors.folderOwner = mcMessage.infoRequired || "required-error";
    }
    if( !collItems.folderLang ) {
        errors.folderLang = mcMessage.langRequired || "required-error";
    }
    if( collItems.folderDesc ) {
        const testDesc = validate.isWordSpace( collItems.folderDesc );
        if( !testDesc ) {
            errors.folderDesc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateGrant( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( !collItems.grantRole ) {
        errors.grantRole = mcMessage.nameRequired || "format-error";
    }

    if( !collItems.grantUser ) {
        errors.grantUser = mcMessage.nameRequired || "format-error";
    }

    if( collItems.grantDesc ) {
        // Check input formats/patterns
        const testDesc = validate.isWordSpace( collItems.grantDesc );
        if( !testDesc ) {
            errors.grantDesc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateInOut( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( !collItems.ioName ) {
        errors.ioName = "Component item name is required";
    }
    if( !collItems.ioCat ) {
        errors.ioCat = "Component item category description is required";
    }
    if( !collItems.ioType ) {
        errors.ioType = "Component item type is required";
    }
    if( !collItems.ioLang ) {
        errors.ioLang = mcMessage.langRequired || "required-error";
    }
    return errors;
}

export function validateIssue( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    return errors;
}

export function validateLabel( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    // test/validate Language setup input parameters (langCode and langName formats)
    const testLabelCode = validate.isLabelCode( collItems.labelCode ),
          testLabelName = validate.isWordSpace( collItems.labelName ),
          testLabelDesc = validate.isDescription( collItems.labelDesc );

    if( collItems.labelCode ) {
        if( !testLabelCode ) {
            errors.labelCode = mcMessage.codeFormat || "format-error";
        }
    } else {
        errors.labelCode = mcMessage.codeRequired || "required-error";
    }
    if( collItems.labelName ) {
        if( !testLabelName ) {
            errors.labelName = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.labelName = mcMessage.nameRequired || "required-error";
    }
    if( !collItems.labelLang ) {
        errors.labelLang = mcMessage.langRequired || "required-error";
    }
    if( collItems.labelDesc ) {
        if( !testLabelDesc ) {
            errors.labelDesc = mcMessage.descFormat || "format-error";
        }
    }


    return errors;
}

export function validateLanguage( collItems ) {
    // Initialise error object and patterns matching:
    let errors         = {};
    // test/validate Language setup input parameters (langCode and langName formats)
    const testLangCode = validate.isLanguageCode( collItems.langCode ),
        testLangName   = validate.isWordSpace( collItems.langName ),
        testLangDesc   = validate.isDescription( collItems.langDesc );

    if( collItems.langCode ) {
        if( !testLangCode ) {
            errors.langCode = mcMessage.langCodeFormat || "format-error";
        }
    } else {
        errors.langCode = mcMessage.codeRequired || "required-error";
    }
    if( collItems.langName ) {
        if( !testLangName ) {
            errors.langName = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.langName = mcMessage.nameRequired || "required-error";
    }

    if( collItems.langDesc ) {
        if( !testLangDesc ) {
            errors.langDesc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateLocation( collItems ) {
    // Initialise error object and patterns matching:
    let errors        = {};
    // Check/test inputs format: code,
    const testCode    = validate.isNameNoSpace( collItems.locationCode ),
        testName      = validate.isWordSpace( collItems.locationName ),
        testPhoneCode = validate.isNumberDigit( collItems.locationPhoneCode ),
        testDesc      = validate.isDescription( collItems.locationDesc );

    if( collItems.locationCode ) {
        if( !testCode ) {
            errors.locationCode = mcMessage.langCodeFormat || "format-error";
        }
    } else {
        errors.locationCode = mcMessage.codeRequired || "required-error";
    }

    if( collItems.locationName ) {
        if( !testName ) {
            errors.locationName = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.locationName = mcMessage.nameRequired || "required-error";
    }

    if( collItems.locationPhoneCode ) {
        if( !testPhoneCode ) {
            errors.locationPhoneCode = "Phone code should be numbers (0 - 9) only";
        }
    }

    if( collItems.locationDesc ) {
        if( !testDesc ) {
            errors.locationDesc = "Description should contains alphanumeric only";
        }
    }

    if( !collItems.locationType ) {
        errors.locationType = mcMessage.typeRequired || "required-error";
    }

    if( !collItems.locationLang ) {
        errors.locationLang = mcMessage.langRequired || "required-error";
    }

    return errors;
}

export function validateLogin( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};
    // test and validate username and password

    // const testLoginName = langCodePattern.test( collItems.langCode ),
    //       testPassword  = wordSpacePattern.test( collItems.langName );

    if( collItems.userEmailName ) {
        const { result, message } = utils.validateEmail( collItems.userEmail );
        if( !result ) {
            errors.userEmailName = message || "format-error";
        }
    } else {
        errors.userEmailName = mcMessage.loginRequired || "required-error";
    }

    if( collItems.userPassword ) {
        const { result, message } = utils.validatePassword( collItems.userPassword );
        if( !result ) {
            errors.userPassword = message || "format-error";
        }
    } else {
        errors.userPassword = mcMessage.passwordRequired || "required-error";
    }

    return errors;
}

export function validateMessage( collItems ) {
    // Initialise error object and patterns matching
    let errors = {};

    if( !collItems.msgLang ) {
        errors.msgLang = mcMessage.langRequired || "required-error";
    }
    if( !collItems.msgCat ) {
        errors.msgCat = mcMessage.catRequired || "required-error";
    }
    if( !collItems.msgTitle ) {
        errors.msgTitle = mcMessage.titleRequired || "required-error";
    }
    if( !collItems.msgBody ) {
        errors.msgBody = mcMessage.infoRequired || "required-error";
    }
    if( !collItems.msgStatus ) {
        errors.msgStatus = mcMessage.infoRequired || "required-error";
    }
    if( !collItems.msgSender ) {
        errors.msgSender = mcMessage.infoRequired || "required-error";
    }

    return errors;
}

export function validateItemMessage( collItems ) {
    // Initialise error object and patterns matching
    let errors = {};

    if( collItems.msgTo ) {
        const { result, message } = utils.validateEmail( collItems.msgTo );
        if( !result ) {
            errors.msgTo = message || "format-error";
        }
    } else {
        errors.msgTo = mcMessage.emailRequired || "required-error";
    }

    if( collItems.msgSubject ) {
        const testInfo = validate.isWordSpace( collItems.msgSubject );
        if( !testInfo ) {
            errors.msgSubject = mcMessage.titleRequired || "required-error";
        }
    }

    return errors;
}

export function validateOrganization( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( collItems.orgNumber ) {
        // Check input formats/patterns
        const testNumber = validate.isBusinessNumber( collItems.orgNumber );
        if( !testNumber ) {
            errors.orgNumber = mcMessage.phoneFormat || "format-error";
        }
    } else {
        errors.orgNumber = mcMessage.numberRequired || "required-error";
    }

    if( collItems.orgName ) {
        // Check input formats/patterns
        const testName = validate.isWordSpace( collItems.orgName );
        if( !testName ) {
            errors.orgName = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.orgName = mcMessage.numberRequired || "required-error";
    }

    if( collItems.orgCity ) {
        // Check input formats/patterns
        const testName = validate.isWordSpace( collItems.orgCity );
        if( !testName ) {
            errors.orgCity = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.orgCity = mcMessage.numberRequired || "required-error";
    }

    if( !collItems.orgType ) {
        errors.orgType = mcMessage.typeRequired | "required-error";
    }
    if( !collItems.orgCountry ) {
        errors.orgCountry = mcMessage.infoRequired || "required-error";
    }
    if( !collItems.orgState ) {
        errors.orgState = mcMessage.infoRequired || "required-error";
    }
    if( !collItems.orgLang ) {
        errors.orgLang = mcMessage.langRequired || "required-error";
    }
    if( collItems.orgAddress ) {
        // Check input formats/patterns
        const testValue = validate.isWordSpace( collItems.orgAddress );
        if( !testValue ) {
            errors.orgAddress = mcMessage.descFormat || "format-error";
        }
    } else {
        errors.orgAddress = mcMessage.infoRequired || "required-error";
    }
    if( collItems.orgDesc ) {
        // Check input formats/patterns
        const testDesc = validate.isWordSpace( collItems.orgDesc );
        if( !testDesc ) {
            errors.orgDesc = mcMessage.descFormat || "format-error";
        }
    }
    return errors;
}

export function validatePayment( collItems ) {
    // Initialise error object and patterns matching:

    let errors = {};

    if( !collItems.order ) {
        errors.order = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.customer ) {
        errors.customer = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.billAddress ) {
        errors.billAddress = "Billing Address is Required";
    }

    if( collItems.payName ) {
        // Check input formats/patterns
        const testName = validate.isName( collItems.payName );
        if( !testName ) {
            errors.payName = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.payName = mcMessage.nameRequired || "required-error";
    }

    if( collItems.payDesc ) {
        // Check input formats/patterns
        const testName = validate.isDescription( collItems.payDesc );
        if( !testName ) {
            errors.payDesc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateTradePayment( collItems ) {
    // Initialise error object and patterns matching:

    let errors = {};

    if( !collItems.orderNumber ) {
        errors.orderNumber = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.payMethod ) {
        errors.payMethod = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.payStatus ) {
        errors.payStatus = mcMessage.infoRequired || "required-error";
    }

    if( collItems.payAmount ) {
        // Check input formats/patterns
        const testName = validate.isNumberFloat( collItems.payAmount);
        if( !testName ) {
            errors.payAmount = mcMessage.numberFormat || "format-error";
        }
    } else {
        errors.payAmount= mcMessage.nameRequired || "required-error";
    }

    if( collItems.payDesc ) {
        // Check input formats/patterns
        const testName = validate.isDescription( collItems.payDesc );
        if( !testName ) {
            errors.payDesc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validatePayProvider( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( collItems.payProvider ) {
        // Check input formats/patterns
        const testName = validate.isName( collItems.payProvider );
        if( !testName ) {
            errors.payProvider = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.payProvider = mcMessage.numberRequired || "required-error";
    }

    if( !collItems.payType ) {
        errors.payType = mcMessage.typeRequired || "required-error";
    }

    if( !collItems.payEnv ) {
        errors.payEnv = mcMessage.infoRequired || "required-error";
    }

    if( collItems.payAccess ) {
        // Check input formats/patterns
        const testName = validate.isStringAlpha( collItems.payAccess );
        if( !testName ) {
            errors.payAccess = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.payAccess = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.payOwner ) {
        errors.payOwner = mcMessage.infoRequired || "required-error";
    }

    if( collItems.payLocale ) {
        // Check input formats/patterns
        const testName = validate.isStringAlpha( collItems.payLocale );
        if( !testName ) {
            errors.payLocale = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.payLocale = mcMessage.infoRequired || "required-error";
    }

    if( collItems.payEndPoint ) {
        // Check input formats/patterns
        const testName = validate.isURL( collItems.payEndPoint );
        if( !testName ) {
            errors.payEndPoint = mcMessage.nameFormat || "format-error";
        }
    }

    if( collItems.payDesc ) {
        // Check input formats/patterns
        const testName = validate.isDescription( collItems.payDesc );
        if( !testName ) {
            errors.payDesc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validatePhone( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( collItems.contactName ) {
        // Check input formats/patterns
        const testName = validate.isStringChar( collItems.contactName );
        if( !testName ) {
            errors.contactName = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.contactName = mcMessage.nameRequired || "required-error";
    }

    if( collItems.phoneNumber ) {
        // Check input formats/patterns
        const testNumber = validate.isPhone( collItems.phoneNumber );
        if( !testNumber ) {
            errors.phoneNumber = mcMessage.phoneFormat || "format-error";
        }
    } else {
        errors.phoneNumber = mcMessage.numberRequired || "required-error";
    }

    if( !collItems.phoneType ) {
        errors.phoneType = mcMessage.typeRequired || "required-error";
    }

    if( !collItems.phoneLang ) {
        errors.phoneLang = mcMessage.langRequired || "required-error";
    }

    if( collItems.phoneDesc ) {
        const testDesc = validate.isDescription( collItems.phoneDesc );
        if( !testDesc ) {
            errors.phoneDesc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validatePolicy( collItems ) {
    // Initialise error object and patterns matching:
    // @TODO: Check item value based on item operator
    let errors = {};

    if( !collItems.policyCat ) {
        errors.policyCat = "Policy Category is required";
    }
    if( !collItems.policyGroup ) {
        errors.policyGroup = "Policy Category is required";
    }
    if( !collItems.policyItem ) {
        errors.policyItem = "Policy Item is required";
    }
    if( !collItems.policyRelation ) {
        errors.policyRelation = "Policy Category is required";
    }
    if( !collItems.policyItemOperator ) {
        errors.policyItemOperator = "Policy Item Operator is required";
    }
    if( !collItems.policyItemType ) {
        errors.policyItemType = "Policy Item Type is required";
    }
    if( !collItems.policyItemValue ) {
        errors.policyItemValue = "Policy Item Value is required";
    }
    if( !collItems.policyLang ) {
        errors.policyLang = "Language is required";
    }
    return errors;
}

export function validatePService( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( !collItems.pserviceService ) {
        errors.pserviceService = "Service is required";
    }
    if( !collItems.pserviceCat ) {
        errors.pserviceCat = "Policy Category is required";
    }
    if( !collItems.pserviceGroup ) {
        errors.pserviceGroup = "Policy Group is required";
    }
    if( !collItems.pserviceLang ) {
        errors.pserviceLang = "Language is required";
    }
    return errors;
}

export function validateRaaci( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( !collItems.raaciCat ) {
        errors.raaciCat = mcMessage.catRequired || "required-error";
    }

    if( !collItems.raaciGroup ) {
        errors.raaciGroup = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.raaciService ) {
        errors.raaciService = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.raaciRole ) {
        errors.raaciRole = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.raaciLevel ) {
        errors.raaciLevel = mcMessage.infoRequired || "required-error";
    }

    if( collItems.raaciDesc ) {
        // Check input formats/patterns
        const testDesc = validate.isWordSpace( collItems.raaciDesc );
        if( !testDesc ) {
            errors.raaciDesc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateRole( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( !collItems.roleGroup ) {
        errors.roleGroup = mcMessage.nameRequired || "format-error";
    }

    if( !collItems.roleService ) {
        errors.roleService = mcMessage.nameRequired || "format-error";
    }

    if( collItems.roleDesc ) {
        // Check input formats/patterns
        const testDesc = validate.isWordSpace( collItems.roleDesc );
        if( !testDesc ) {
            errors.roleDesc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateService( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( collItems.serviceName ) {
        // Check input formats/patterns
        const testServiceName = validate.isWordSpace( collItems.serviceName );
        if( !testServiceName ) {
            errors.serviceName = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.serviceName = mcMessage.nameRequired || "required-error";
    }
    if( collItems.serviceDesc ) {
        const testDesc = validate.isDescription( collItems.serviceDesc );
        if( !testDesc ) {
            errors.serviceDesc = mcMessage.descFormat || "format-error";
        }
    } else {
        errors.serviceDesc = mcMessage.descRequired || "required-error";
    }
    if( !collItems.serviceType ) {
        errors.serviceType = mcMessage.typeRequired || "required-error";
    }
    if( collItems.servicePath ) {
        const testServicePath = validate.isPathName( collItems.servicePath );
        if( !testServicePath ) {
            errors.servicePath = mcMessage.pathFormat || "format-error";
        }
    } else {
        errors.servicePath = mcMessage.infoRequired || "required-error";
    }
    if( !collItems.serviceLang ) {
        errors.serviceLang = mcMessage.langRequired || "required-error";
    }
    return errors;
}

export function validateSetting( collItems ) {
    // Initialise error object and patterns matching:

    // @TODO: check for setting value (text, number, boolean etc.) depending on the setting relation (equals,
    // less/greater etc.) use case construct to determine the procedure

    let errors = {};

    if( !collItems.settingCat ) {
        errors.settingCat = mcMessage.catRequired || "format-error";
    }
    if( !collItems.settingRelation ) {
        errors.settingRelation = "Setting Relationship is required";
    }
    if( !collItems.settingName ) {
        errors.settingName = mcMessage.nameRequired || "format-error";
    }
    if( !collItems.settingLang ) {
        errors.settingLang = mcMessage.langRequired || "format-error";
    }
    if( collItems.settingDesc ) {
        const testDesc = validate.isDescription( collItems.settingDesc );
        if( !testDesc ) {
            errors.settingDesc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateShipping( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( !collItems.shipOrder ) {
        errors.shipOrder = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.shipType ) {
        errors.shipOrder = mcMessage.infoRequired || "required-error";
    }

    // validate shipItems for order-items
    if( _.isEmpty( collItems.shipItems ) ) {
        errors.shipItems = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.shipMethod ) {
        errors.shipMethod = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.shipAmount ) {
        errors.shipAmount = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.shipFor ) {
        errors.shipFor = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.shipTo ) {
        errors.shipTo = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.shipDate ) {
        errors.shipDate = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.shipBy ) {
        errors.shipBy = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.shipTrack ) {
        errors.shipTrack = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.shipStatus ) {
        errors.shipStatus = mcMessage.infoRequired || "required-error";
    }

    if( collItems.shipDesc ) {
        // Check input formats/patterns
        const testName = validate.isDescription( collItems.shipDesc );
        if( !testName ) {
            errors.shipDesc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateShipCost( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( collItems.shipName ) {
        // Check input formats/patterns
        const testName = validate.isName( collItems.shipName );
        if( !testName ) {
            errors.shipName = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.shipName = mcMessage.numberRequired || "required-error";
    }

    if( !collItems.shipCat ) {
        errors.shipCat = mcMessage.catRequired || "required-error";
    }

    if( !collItems.shipType ) {
        errors.shipType = mcMessage.typeRequired || "required-error";
    }

    if( collItems.shipDuration ) {
        // Check input formats/patterns
        const testName = validate.isNumberDigit( collItems.shipDuration );
        if( !testName ) {
            errors.shipDuration = mcMessage.numberFormat || "format-error";
        }
    } else {
        errors.shipDuration = mcMessage.infoRequired || "format-error";
    }

    if( collItems.shipFixedCost ) {
        // Check input formats/patterns
        const testName = validate.isNumberFloat( collItems.shipFixedCost );
        if( !testName ) {
            errors.shipFixedCost = mcMessage.floatFormat || "format-error";
        }
    }

    if( collItems.shipCost ) {
        // Check input formats/patterns
        const testName = validate.isNumberFloat( collItems.shipCost );
        if( !testName ) {
            errors.shipCost = mcMessage.floatFormat || "format-error";
        }
    } else {
        errors.shipCost = mcMessage.numberRequired || "required-error";
    }

    if( collItems.shipCurrency ) {
        // Check input formats/patterns
        const testName = validate.isCurrency( collItems.shipCurrency );
        if( !testName ) {
            errors.shipCurrency = mcMessage.currencyFormat || "format-error";
        }
    } else {
        errors.shipCurrency = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.shipCostType ) {
        errors.shipCostType = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.shipFrom ) {
        errors.shipFrom = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.shipToCountry ) {
        errors.shipTo = mcMessage.infoRequired || "required-error";
    }

    if( collItems.shipDesc ) {
        // Check input formats/patterns
        const testName = validate.isDescription( collItems.shipDesc );
        if( !testName ) {
            errors.shipDesc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateShipProvider( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( collItems.shipProvider ) {
        // Check input formats/patterns
        const testName = validate.isName( collItems.shipProvider );
        if( !testName ) {
            errors.shipProvider = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.shipProvider = mcMessage.numberRequired || "required-error";
    }

    if( !collItems.shipType ) {
        errors.shipType = mcMessage.typeRequired || "required-error";
    }

    if( !collItems.shipEnv ) {
        errors.shipEnv = mcMessage.infoRequired || "required-error";
    }

    if( collItems.shipAccess ) {
        // Check input formats/patterns
        const testName = validate.isStringAlpha( collItems.shipAccess );
        if( !testName ) {
            errors.shipAccess = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.shipAccess = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.shipOwner ) {
        errors.shipOwner = mcMessage.infoRequired || "required-error";
    }

    if( collItems.shipLocale ) {
        // Check input formats/patterns
        const testName = validate.isStringAlpha( collItems.shipLocale );
        if( !testName ) {
            errors.shipLocale = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.shipLocale = mcMessage.infoRequired || "required-error";
    }

    if( collItems.shipEndPoint ) {
        // Check input formats/patterns
        const testName = validate.isURL( collItems.shipEndPoint );
        if( !testName ) {
            errors.shipEndPoint = mcMessage.nameFormat || "format-error";
        }
    }

    if( collItems.shipDesc ) {
        // Check input formats/patterns
        const testName = validate.isDescription( collItems.shipDesc );
        if( !testName ) {
            errors.shipDesc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateStandardCategory( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    // test/validate input format
    const testCatName = validate.isWordSpace( collItems.catName ),
          testCatDesc = validate.isDescription( collItems.catDesc );

    if( collItems.catName ) {
        if( !testCatName ) {
            errors.catName = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.catName = mcMessage.nameRequired || "required-error";
    }
    if( collItems.catDesc ) {
        if( !testCatDesc ) {
            errors.catName = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.catDesc = mcMessage.descRequired || "required-error";
    }
    if( !collItems.catLang ) {
        errors.catLang = mcMessage.langRequired || "required-error";
    }
    return errors;
}

export function validateStandardCode( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( collItems.codeName ) {
        // test/validate input format
        const testCodeName = validate.isStandardCode( collItems.codeName );
        if( !testCodeName ) {
            errors.codeName = mcMessage.codeFormat || "format-error";
        }
    } else {
        errors.codeName = mcMessage.codeRequired || "required-error";
    }
    if( !collItems.codeCat ) {
        errors.codeCat = mcMessage.catRequired || "required-error";
    }
    if( !collItems.codeLang ) {
        errors.codeLang = mcMessage.langRequired || "required-error";
    }
    if( collItems.codeDesc ) {
        const testDesc = validate.isDescription( collItems.codeDesc );
        if( !testDesc ) {
            errors.codeDesc = mcMessage.descFormat || "format-error";
        }
    }
    return errors;
}

export function validateTax( collItems ) {
    // Initialise error object and patterns matching:
    // if( errors.taxName || errors.taxCat || errors.taxJuri || errors.taxLocation || errors.taxAmount ||
    // errors.taxUnit || errors.taxRangeFrom || errors.taxRangeTo || errors.taxDesc || errors.taxLang )
    let errors = {};

    if( collItems.taxName ) {
        if( !validate.isName( collItems.taxName ) ) {
            errors.taxName = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.taxName = mcMessage.nameRequired || "required-error";
    }

    if( !collItems.taxCat ) {
        errors.taxCat = mcMessage.catRequired || "required-error";
    }

    if( collItems.taxAmount ) {
        if( !validate.isNumberDigit( collItems.taxAmount ) || !validate.isNumberFloat( collItems.taxAmount ) ) {
            errors.taxAmount = "Tax amount should be a number";
        }
    } else {
        errors.taxAmount = mcMessage.infoRequired || "required-error";
    }

    if( !(collItems.taxUnit === '%' || collItems.taxUnit === '#') ) {
        errors.taxUnit = "Tax Unit should be % or #";
    }

    if( !collItems.taxJuri ) {
        errors.taxJuri = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.taxLocation ) {
        errors.taxLocation = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.taxLang ) {
        errors.taxLang = mcMessage.langRequired || "required-error";
    }


    if( collItems.taxDesc ) {
        const testDesc = validate.isDescription( collItems.taxDesc );
        if( !testDesc ) {
            errors.taxDesc = mcMessage.descFormat || "format-error";
        }
    }

    // validate taxRangeFrom/To
    if( collItems.taxRangeTo && collItems.taxRangeFrom ) {
        if( collItems.taxRangeTo < collItems.taxRangeFrom ) {
            return errors.taxRangeFrom = "Tax-range-from should be less than tax-range-to"
        }
    }

    return errors;
}

export function validateTodo( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( !collItems.todoName ) {
        errors.todoName = "Item Name/Title is required";
    }
    if( !collItems.todoType ) {
        errors.todoType = "Type is required";
    }
    if( collItems.todoDesc ) {
        const testDesc = validate.isDescription( collItems.todoDesc );
        if( !testDesc ) {
            errors.todoDesc = mcMessage.descFormat || "format-error";
        }
    } else {
        errors.todoDesc = mcMessage.descRequired || "required-error";
    }
    if( !collItems.todoLang ) {
        errors.todoLang = mcMessage.langRequired || "required-error";
    }
    if( collItems.todoUpdate ) {
        const testDesc = validate.isDescription( collItems.todoUpdate );
        if( !testDesc ) {
            errors.todoUpdate = mcMessage.descFormat || "format-error";
        }
    }
    // @TODO: Validate todoStart and todoEnd dates

    return errors;
}

export function validateUser( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( collItems.username ) {
        const testUsername = validate.isName( collItems.username );
        if( !testUsername ) {
            errors.username = mcMessage.usernameFormat;
        }
    } else {
        errors.username = mcMessage.nameRequired || "Username is required";
    }

    if( collItems.password ) {
        const response = validate.isPassword( collItems.password );
        if( !response ) {
            errors.password = response.message;
        }
    } else {
        errors.password = mcMessage.passwordRequired || "Password is required";
    }

    if( collItems.userEmail ) {
        const response = validate.isEmail( collItems.userEmail );
        if( !response ) {
            errors.userEmail = response.message;
        }
    } else {
        errors.userEmail = mcMessage.emailRequired || "Email is required";
    }

    if( collItems.confirmPassword ) {
        if( !(collItems.confirmPassword === collItems.password) ) {
            errors.confirmPassword = mcMessage.passwordConfirm || "Confirmed password is not the same as the user password";
        }
    } else {
        errors.confirmPassword = mcMessage.confirmPassRequired || "Confirmed password is required";
    }

    if( collItems.recoveryEmail ) {
        const response = validate.isEmail( collItems.recoveryEmail );
        if( !response ) {
            errors.recoveryEmail = response.message;
        }
        if( collItems.recoveryEmail === collItems.userEmail ) {
            errors.recoveryEmail = "Recovery email must be different from the main user email";
        }
    } else {
        errors.userEmail = mcMessage.emailRequired || "Recovery email is required";
    }

    if( collItems.firstName ) {
        const testFirstname = validate.isNameNoSpace( collItems.firstName );
        if( !testFirstname ) {
            errors.firstName = mcMessage.nameFormat || "Name should contain characters only";
        }
    } else {
        errors.firstName = mcMessage.nameRequired || "Name is required";
    }

    if( collItems.lastName ) {
        const testLastname = validate.isNameNoSpace( collItems.lastName );
        if( !testLastname ) {
            errors.lastName = mcMessage.nameFormat || "Name should contain characters only";
        }
    } else {
        errors.lastName = mcMessage.nameRequired || "Name is required";
    }

    if( !collItems.userLang ) {
        errors.userLang = mcMessage.langRequired || "Language is required";
    }

    if( collItems.userAcceptTerm === false ) {
        errors.userAcceptTerm = "Term acceptance is required";
    }

    return errors;
}

export function validatePrice( collItems ) {
    // Initialise error object and patterns matching:
    // ( errors.priceGroup )

    let errors = {};

    if( !collItems.product ) {
        errors.product = mcMessage.nameRequired || "required-error";
    }

    if( !collItems.group ) {
        errors.group = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.currency ) {
        errors.currency = mcMessage.infoRequired || "required-error";
    }


    if( collItems.cost ) {
        const testInfo = validate.isNumberFloat( collItems.cost );
        if( !testInfo ) {
            errors.cost = mcMessage.floatFormat || "format-error";
        }
        if( !collItems.unit ) {
            errors.unit = mcMessage.infoRequired || "required-error";
        }
    } else {
        errors.cost = mcMessage.infoRequired || "required-error";
    }

    if( collItems.minQuantity ) {
        // Check input formats/patterns
        const testInfo = validate.isNumberDigit( collItems.minQuantity );
        if( !testInfo ) {
            errors.inQuantity = mcMessage.numberFormat || "format-error";
        }
    }

    if( collItems.maxQuantity ) {
        // Check input formats/patterns
        const testInfo = validate.isNumberDigit( collItems.maxQuantity );
        if( !testInfo ) {
            errors.maxQuantity = mcMessage.numberFormat || "format-error";
        }
        if( collItems.maxQuantity < collItems.minQuantity ) {
            return errors.minQuantity = "Min-Quantity should be less than Max-Quantity "
        }
    }

    // validate priceDiscountStart/End
    if( collItems.startDate && collItems.endDate ) {
        if( collItems.endDate < collItems.startDate ) {
            return errors.startDate = "Start-date should be less than End-Date"
        }
    }

    if( collItems.desc ) {
        // Check input formats/patterns
        const testName = validate.isDescription( collItems.desc );
        if( !testName ) {
            errors.desc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateDiscount( collItems ) {
    // Initialise error object and patterns matching:
    // ( errors.priceGroup )

    let errors = {};

    if( !collItems.code ) {
        errors.code = mcMessage.nameRequired || "required-error";
    }

    if( !collItems.group ) {
        errors.group = mcMessage.infoRequired || "required-error";
    }

    if( collItems.amount ) {
        const testInfo = validate.isNumberFloat( collItems.amount );
        if( !testInfo ) {
            errors.amount = mcMessage.floatFormat || "format-error";
        }
        if( !collItems.unit ) {
            errors.unit = mcMessage.infoRequired || "required-error";
        }
    } else {
        errors.amount = mcMessage.infoRequired || "required-error";
    }

    if( collItems.minQuantity ) {
        // Check input formats/patterns
        const testInfo = validate.isNumberDigit( collItems.minQuantity );
        if( !testInfo ) {
            errors.inQuantity = mcMessage.numberFormat || "format-error";
        }
    }

    if( collItems.maxQuantity ) {
        // Check input formats/patterns
        const testInfo = validate.isNumberDigit( collItems.maxQuantity );
        if( !testInfo ) {
            errors.maxQuantity = mcMessage.numberFormat || "format-error";
        }
        if( collItems.maxQuantity < collItems.minQuantity ) {
            return errors.minQuantity = "Min-Quantity should be less than Max-Quantity "
        }
    }

    // validate priceDiscountStart/End
    if( collItems.startDate && collItems.endDate ) {
        if( collItems.endDate < collItems.startDate ) {
            return errors.startDate = "Start-date should be less than End-Date"
        }
    }

    if( collItems.desc ) {
        // Check input formats/patterns
        const testName = validate.isDescription( collItems.desc );
        if( !testName ) {
            errors.desc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateInventory( collItems ) {
    // Initialise error object and patterns matching:
    // ( errors.priceGroup )

    let errors = {};

    if( !collItems.invProduct ) {
        errors.invProduct = mcMessage.nameRequired || "required-error";
    }

    if( collItems.invQuantity ) {
        // Check input formats/patterns
        const testInfo = validate.isNumberDigit( collItems.invQuantity );
        if( !testInfo ) {
            errors.invQuantity = mcMessage.numberFormat || "format-error";
        }
    }

    if( !collItems.invCountry ) {
        errors.invCountry = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.invState ) {
        errors.invState = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.invCity ) {
        errors.invCity = mcMessage.infoRequired || "required-error";
    }

    if( collItems.invPostalCode ) {
        // Check input formats/patterns
        const testCode = validate.isPostalCode( collItems.invPostalCode );
        if( !testCode ) {
            errors.invPostalCode = mcMessage.descFormat || "format-error";
        }
    }

    if( !collItems.invOwner ) {
        errors.invOwner = mcMessage.infoRequired || "required-error";
    }

    if( collItems.invDesc ) {
        // Check input formats/patterns
        const testName = validate.isDescription( collItems.invDesc );
        if( !testName ) {
            errors.invDesc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateProduct( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( collItems.productName ) {
        // Check input formats/patterns
        const testName = validate.isName( collItems.productName );
        if( !testName ) {
            errors.productName = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.productName = mcMessage.nameRequired || "required-error";
    }

    if( collItems.productKeyword ) {
        // Check input formats/patterns
        const testName = validate.isWordSpace( collItems.productKeyword );
        if( !testName ) {
            errors.productKeyword = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.productKeyword = mcMessage.numberRequired || "required-error";
    }

    if( !collItems.productCat ) {
        errors.productCat = mcMessage.catRequired || "required-error";
    }

    if( !collItems.productGroup ) {
        errors.productGroup = mcMessage.typeRequired || "required-error";
    }

    if( !collItems.productOwner ) {
        errors.productOwner = mcMessage.infoRequired || "required-error";
    }

    if( collItems.productCost ) {
        const testInfo = validate.isNumberFloat( collItems.productCost );
        if( !testInfo ) {
            errors.productCost = mcMessage.floatFormat || "format-error";
        }
        if( !collItems.productCostUnit ) {
            errors.productCostUnit = mcMessage.infoRequired || "required-error";
        }
    } else {
        errors.productCost = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.productTax ) {
        errors.productTax = mcMessage.infoRequired || "required-error";
    }

    if( collItems.productQuantity ) {
        // Check input formats/patterns
        const testInfo = validate.isNumberDigit( collItems.productQuantity );
        if( !testInfo ) {
            errors.productQuantity = mcMessage.numberFormat || "format-error";
        }
    }

    if( collItems.productDiscount ) {
        // Check input formats/patterns
        const testName = validate.isNumberFloat( collItems.productDiscount );
        if( !testName ) {
            errors.productDiscount = mcMessage.floatFormat || "format-error";
        }
        if( !(collItems.productDiscountUnit === '%' || collItems.productDiscountUnit === '#') ) {
            errors.productDiscountUnit = "Discount Unit should be % or #";
        }
    }

    // validate productDiscountStart/End
    if( collItems.productDiscountStart && collItems.productDiscountEnd ) {
        if( collItems.productDiscountEnd < collItems.productDiscountStart ) {
            return errors.productDiscountStart = "Start-date should be less than End-Date"
        }
    }

    if( !collItems.productShip ) {
        errors.productShip = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.productCountry ) {
        errors.productCountry = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.productState ) {
        errors.productState = mcMessage.infoRequired || "required-error";
    }

    if( collItems.productCity ) {
        // Check input formats/patterns
        const testName = validate.isName( collItems.productCity );
        if( !testName ) {
            errors.productCity = mcMessage.descFormat || "format-error";
        }
    }

    if( collItems.productPostalCode ) {
        // Check input formats/patterns
        const testCode = validate.isPostalCode( collItems.productPostalCode );
        if( !testCode ) {
            errors.productPostalCode = mcMessage.descFormat || "format-error";
        }
    }

    if( collItems.productDesc ) {
        // Check input formats/patterns
        const testName = validate.isDescription( collItems.productDesc );
        if( !testName ) {
            errors.productDesc = mcMessage.descFormat || "format-error";
        }
    }

    if( collItems.productUrl ) {
        // Check input formats/patterns
        const testInfo = validate.isURL( collItems.productUrl );
        if( !testInfo ) {
            errors.productUrl = mcMessage.urlFormat || "format-error";
        }
    }

    return errors;
}

export function validateProductFeature( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( !collItems.featureProduct ) {
        errors.featureProduct = mcMessage.infoRequired || "required-error";
    }

    if( collItems.featureKey ) {
        // Check input formats/patterns
        const testInfo = validate.isLabelCode( collItems.featureKey );
        if( !testInfo ) {
            errors.featureKey = mcMessage.labelFormat || "format-error";
        }
    } else {
        errors.featureKey = mcMessage.infoRequired || "required-error";
    }

    if( collItems.featureValue ) {
        const testInfo = validate.isWordSpace( collItems.featureValue );
        if( !testInfo ) {
            errors.featureValue = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.featureKey = mcMessage.infoRequired || "required-error";
    }

    if( collItems.featureCost ) {
        const testInfo = validate.isNumberFloat( collItems.featureCost );
        if( !testInfo ) {
            errors.featureCost = mcMessage.floatFormat || "format-error";
        }
        // costUnit is required
        if( !collItems.featureCostUnit ) {
            errors.featureCostUnit = mcMessage.infoRequired || "required-error";
        }
    }

    if( collItems.featureDiscount ) {
        // Check input formats/patterns
        const testName = validate.isNumberFloat( collItems.featureDiscount );
        if( !testName ) {
            errors.featureDiscount = mcMessage.floatFormat || "format-error";
        }
    }

    if( !(collItems.featureDiscountUnit === '%' || collItems.featureDiscountUnit === '#') ) {
        errors.featureDiscountUnit = "Discount Unit should be % or #";
    }

    // validate featureDiscountStart/End
    if( collItems.featureDiscountStart && collItems.featureDiscountEnd ) {
        if( collItems.featureDiscountStart < collItems.featureDiscountEnd ) {
            return errors.featureDiscountStart = "Start-date should be less than End-Date"
        }
    }

    if( collItems.featureQuantity ) {
        // Check input formats/patterns
        const testInfo = validate.isNumberDigit( collItems.featureQuantity );
        if( !testInfo ) {
            errors.featureQuantity = mcMessage.numberFormat || "format-error";
        }
    }

    if( collItems.featureDesc ) {
        // Check input formats/patterns
        const testInfo = validate.isDescription( collItems.featureDesc );
        if( !testInfo ) {
            errors.featureDesc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateProductReview( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( !collItems.reviewProduct ) {
        errors.reviewProduct = mcMessage.infoRequired || "required-error";
    }

    if( collItems.reviewProductScore ) {
        const testInfo = validate.isNumberDigit( collItems.reviewProductScore );
        if( !testInfo ) {
            errors.reviewProductScore = mcMessage.numberFormat || "format-error";
        }
    } else {
        errors.reviewProductScore = mcMessage.infoRequired || "required-error";
    }

    if( collItems.reviewPriceScore ) {
        const testInfo = validate.isNumberDigit( collItems.reviewPriceScore );
        if( !testInfo ) {
            errors.reviewPriceScore = mcMessage.numberFormat || "format-error";
        }
    }

    if( collItems.reviewShipScore ) {
        const testInfo = validate.isNumberDigit( collItems.reviewShipScore );
        if( !testInfo ) {
            errors.reviewShipScore = mcMessage.numberFormat || "format-error";
        }
    }

    if( collItems.reviewSellerScore || collItems.reviewSellerScore ) {
        const testInfo = validate.isNumberDigit( collItems.reviewSellerScore );
        if( !testInfo ) {
            errors.reviewSellerScore = mcMessage.numberFormat || "format-error";
        }
    }

    if( collItems.reviewValueScore || collItems.reviewValueScore ) {
        const testInfo = validate.isNumberDigit( collItems.reviewValueScore );
        if( !testInfo ) {
            errors.reviewValueScore = mcMessage.numberFormat || "format-error";
        }
    }

    if( !collItems.reviewLang ) {
        errors.reviewLang = mcMessage.infoRequired || "required-error";
    }

    if( collItems.reviewDesc ) {
        // Check input formats/patterns
        const testInfo = validate.isDescription( collItems.reviewDesc );
        if( !testInfo ) {
            errors.reviewDesc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateTrade( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( collItems.tradeProduct ) {
        // Check input formats/patterns
        const testName = validate.isStringAlpha( collItems.tradeProduct );
        if( !testName ) {
            errors.tradeProduct = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.tradeProduct = mcMessage.numberRequired || "required-error";
    }

    if( !collItems.tradeGroup ) {
        errors.tradeGroup = mcMessage.groupRequired || "required-error";
    }

    if( !collItems.tradeFolder ) {
        errors.tradeFolder = mcMessage.groupRequired || "required-error";
    }

    if( !collItems.tradeStatus ) {
        errors.tradeStatus = mcMessage.groupRequired || "required-error";
    }

    if( !collItems.tradeOwner ) {
        errors.tradeOwner = mcMessage.infoRequired || "required-error";
    }

    if( collItems.tradeQuantity ) {
        // Check input formats/patterns
        const testInfo = validate.isNumberDigit( collItems.tradeQuantity );
        if( !testInfo ) {
            errors.tradeQuantity = mcMessage.numberFormat || "format-error";
        }
    } else {
        errors.tradeQuantity = mcMessage.numberRequired || "required-error";
    }

    if( collItems.tradeDesc ) {
        // Check input formats/patterns
        const testInfo = validate.isDescription( collItems.tradeDesc );
        if( !testInfo ) {
            errors.tradeDesc = mcMessage.descFormat || "format-error";
        }
    }

    if( collItems.tradeShipping ) {
        // Check input formats/patterns
        const testInfo = validate.isDescription( collItems.tradeShipping );
        if( !testInfo ) {
            errors.tradeShipping = mcMessage.descFormat || "format-error";
        }
    }

    if( collItems.tradePayment ) {
        // Check input formats/patterns
        const testInfo = validate.isDescription( collItems.tradePayment );
        if( !testInfo ) {
            errors.tradePayment = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateTradeOrder( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( !collItems.tradeFolder ) {
        errors.tradeFolder = "trade/order-folder required-error";
    }

    if( !collItems.tradeStatus ) {
        errors.tradeStatus = "trade/order-status required-error";
    }

    if( !collItems.tradeOrderNumber ) {
        errors.tradeOrderNumber = "trade/order-number required-error";
    }

    if( !collItems.tradeOwner ) {
        errors.tradeOwner = "trade/order-owner required-error";
    }


    if( _.isEmpty( collItems.tradePayment ) ) {
        errors.tradePayment = "trade/order-payment information required-error";
    }

    if( _.isEmpty( collItems.tradeItems ) || collItems.tradeItems.length < 1 ) {
        errors.tradeItems = "trade/order-items information required-error";
    }

    return errors;
}

export function validateCancelOrder( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( !collItems.orderNumber ) {
        errors.orderNumber = "trade/order-number required-error";
    }

    if( collItems.isCancel !== true ) {
        // Check input formats/patterns
        errors.isCancel = "Order cancellation authorization (true) required to proceed";
    }

    return errors;
}

export function validateCancelOrderItem( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( !collItems.orderNumber ) {
        errors.orderNumber = "trade/order-number required-error";
    }

    if( _.isEmpty( collItems.orderItems ) || collItems.orderItems.length <= 0 ) {
        errors.orderItems = "trade/order-items information required-error";
    }

    return errors;
}

export function validateRefund( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( !collItems.orderNumber ) {
        errors.orderNumber = "trade/order-number required-error";
    }

    if( collItems.amount ) {
        // Check input formats/patterns
        const testInfo = validate.isNumberFloat( collItems.amount );
        if( !testInfo ) {
            errors.amount = mcMessage.numberFormat || "format-error";
        }
    } else {
        errors.amount = mcMessage.numberRequired || "required-error";
    }

    if( !collItems.currency ) {
        errors.currency = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.method ) {
        errors.method = mcMessage.infoRequired || "required-error";
    }

    if( collItems.desc ) {
        // Check input formats/patterns
        const testInfo = validate.isDescription( collItems.desc );
        if( !testInfo ) {
            errors.desc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateWish( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( !collItems.wishProduct ) {
        errors.wishProduct = mcMessage.infoRequired || "required-error";
    }

    if( collItems.wishProductName ) {
        // Check input formats/patterns
        const testInfo = validate.isWordSpace( collItems.wishProductName );
        if( !testInfo ) {
            errors.wishProductName = mcMessage.nameFormat || "format-error";
        }
    } else {
        errors.wishProductName = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.wishFolder ) {
        errors.wishFolder = mcMessage.infoRequired || "required-error";
    }

    if( !collItems.wishPriority ) {
        errors.wishPriority = mcMessage.infoRequired || "required-error";
    }

    if( collItems.wishUrl ) {
        const testInfo = validate.isURL( collItems.wishUrl );
        if( !testInfo ) {
            errors.wishUrl = mcMessage.urlFormat || "format-error";
        }
    }

    if( collItems.wishQuantity ) {
        // Check input formats/patterns
        const testInfo = validate.isNumberDigit( collItems.wishQuantity );
        if( !testInfo ) {
            errors.wishQuantity = mcMessage.numberFormat || "format-error";
        }
    }

    if( collItems.wishDesc ) {
        // Check input formats/patterns
        const testInfo = validate.isDescription( collItems.wishDesc );
        if( !testInfo ) {
            errors.wishDesc = mcMessage.descFormat || "format-error";
        }
    }

    // console.log(errors);
    return errors;
}

export function validateCart( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( collItems.username ) {
        const testUsername = validate.isName( collItems.username );
        if( !testUsername ) {
            errors.username = mcMessage.usernameFormat;
        }
    } else {
        errors.username = mcMessage.nameRequired || "Username is required";
    }

    if( collItems.userEmail ) {
        const response = validate.isEmail( collItems.userEmail );
        if( !response ) {
            errors.userEmail = response.message;
        }
    } else {
        errors.userEmail = mcMessage.emailRequired || "Email is required";
    }

    if( collItems.recoveryEmail ) {
        const response = validate.isEmail( collItems.recoveryEmail );
        if( !response ) {
            errors.recoveryEmail = response.message;
        }
        if( collItems.recoveryEmail === collItems.userEmail ) {
            errors.recoveryEmail = "Recovery email must be different from the main user email";
        }
    } else {
        errors.userEmail = mcMessage.emailRequired || "Recovery email is required";
    }

    if( collItems.firstName ) {
        const testFirstname = validate.isNameNoSpace( collItems.firstName );
        if( !testFirstname ) {
            errors.firstName = mcMessage.nameFormat || "Name should contain characters only";
        }
    } else {
        errors.firstName = mcMessage.nameRequired || "Name is required";
    }

    if( collItems.lastName ) {
        const testLastname = validate.isNameNoSpace( collItems.lastName );
        if( !testLastname ) {
            errors.lastName = mcMessage.nameFormat || "Name should contain characters only";
        }
    } else {
        errors.lastName = mcMessage.nameRequired || "Name is required";
    }

    if( !collItems.userLang ) {
        errors.userLang = mcMessage.langRequired || "Language is required";
    }

    return errors;
}

export function validateOrder( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( collItems.catName ) {
        const testUsername = validate.isName( collItems.catName );
        if( !testUsername ) {
            errors.catName = mcMessage.usernameFormat;
        }
    } else {
        errors.catName = mcMessage.nameRequired || "category name is required";
    }

    if( !collItems.catGroup ) {
        errors.catGroup = mcMessage.groupRequired || "category group is required";
    }

    if( !collItems.catOwner ) {
        errors.catOwner = mcMessage.infoRequired || "Owner information is required";
    }

    if( !collItems.catLang ) {
        errors.catLang = mcMessage.langRequired || "Language is required";
    }

    if( collItems.catDesc ) {
        const testName = validate.isDescription( collItems.catDesc );
        if( !testName ) {
            errors.catDesc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateOrderCategory( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( collItems.catName ) {
        const testUsername = validate.isWordSpace( collItems.catName );
        if( !testUsername ) {
            errors.catName = mcMessage.usernameFormat;
        }
    } else {
        errors.catName = mcMessage.nameRequired || "category name is required";
    }

    if( !collItems.catGroup ) {
        errors.catGroup = mcMessage.groupRequired || "category group is required";
    }

    if( !collItems.catOwner ) {
        errors.catOwner = mcMessage.infoRequired || "Owner information is required";
    }

    if( !collItems.catLang ) {
        errors.catLang = mcMessage.langRequired || "Language is required";
    }

    if( collItems.catDesc ) {
        const testName = validate.isDescription( collItems.catDesc );
        if( !testName ) {
            errors.catDesc = mcMessage.descFormat || "format-error";
        }
    }

    return errors;
}

export function validateInvoice( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( collItems.username ) {
        const testUsername = validate.isName( collItems.username );
        if( !testUsername ) {
            errors.username = mcMessage.usernameFormat;
        }
    } else {
        errors.username = mcMessage.nameRequired || "Username is required";
    }

    if( collItems.userEmail ) {
        const response = validate.isEmail( collItems.userEmail );
        if( !response ) {
            errors.userEmail = response.message;
        }
    } else {
        errors.userEmail = mcMessage.emailRequired || "Email is required";
    }

    if( collItems.recoveryEmail ) {
        const response = validate.isEmail( collItems.recoveryEmail );
        if( !response ) {
            errors.recoveryEmail = response.message;
        }
        if( collItems.recoveryEmail === collItems.userEmail ) {
            errors.recoveryEmail = "Recovery email must be different from the main user email";
        }
    } else {
        errors.userEmail = mcMessage.emailRequired || "Recovery email is required";
    }

    if( collItems.firstName ) {
        const testFirstname = validate.isNameNoSpace( collItems.firstName );
        if( !testFirstname ) {
            errors.firstName = mcMessage.nameFormat || "Name should contain characters only";
        }
    } else {
        errors.firstName = mcMessage.nameRequired || "Name is required";
    }

    if( collItems.lastName ) {
        const testLastname = validate.isNameNoSpace( collItems.lastName );
        if( !testLastname ) {
            errors.lastName = mcMessage.nameFormat || "Name should contain characters only";
        }
    } else {
        errors.lastName = mcMessage.nameRequired || "Name is required";
    }

    if( !collItems.userLang ) {
        errors.userLang = mcMessage.langRequired || "Language is required";
    }

    return errors;
}

export function validateReceipt( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( collItems.username ) {
        const testUsername = validate.isName( collItems.username );
        if( !testUsername ) {
            errors.username = mcMessage.usernameFormat;
        }
    } else {
        errors.username = mcMessage.nameRequired || "Username is required";
    }

    if( collItems.userEmail ) {
        const response = validate.isEmail( collItems.userEmail );
        if( !response ) {
            errors.userEmail = response.message;
        }
    } else {
        errors.userEmail = mcMessage.emailRequired || "Email is required";
    }

    if( collItems.recoveryEmail ) {
        const response = validate.isEmail( collItems.recoveryEmail );
        if( !response ) {
            errors.recoveryEmail = response.message;
        }
        if( collItems.recoveryEmail === collItems.userEmail ) {
            errors.recoveryEmail = "Recovery email must be different from the main user email";
        }
    } else {
        errors.userEmail = mcMessage.emailRequired || "Recovery email is required";
    }

    if( collItems.firstName ) {
        const testFirstname = validate.isNameNoSpace( collItems.firstName );
        if( !testFirstname ) {
            errors.firstName = mcMessage.nameFormat || "Name should contain characters only";
        }
    } else {
        errors.firstName = mcMessage.nameRequired || "Name is required";
    }

    if( collItems.lastName ) {
        const testLastname = validate.isNameNoSpace( collItems.lastName );
        if( !testLastname ) {
            errors.lastName = mcMessage.nameFormat || "Name should contain characters only";
        }
    } else {
        errors.lastName = mcMessage.nameRequired || "Name is required";
    }

    if( !collItems.userLang ) {
        errors.userLang = mcMessage.langRequired || "Language is required";
    }

    return errors;
}

export function validateProfile( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    if( collItems.username ) {
        const testUsername = validate.isName( collItems.username );
        if( !testUsername ) {
            errors.username = mcMessage.usernameFormat;
        }
    } else {
        errors.username = mcMessage.nameRequired || "Username is required";
    }

    if( collItems.userEmail ) {
        const response = validate.isEmail( collItems.userEmail );
        if( !response ) {
            errors.userEmail = response.message;
        }
    } else {
        errors.userEmail = mcMessage.emailRequired || "Email is required";
    }

    if( collItems.recoveryEmail ) {
        const response = validate.isEmail( collItems.recoveryEmail );
        if( !response ) {
            errors.recoveryEmail = response.message;
        }
        if( collItems.recoveryEmail === collItems.userEmail ) {
            errors.recoveryEmail = "Recovery email must be different from the main user email";
        }
    } else {
        errors.userEmail = mcMessage.emailRequired || "Recovery email is required";
    }

    if( collItems.firstName ) {
        const testFirstname = validate.isNameNoSpace( collItems.firstName );
        if( !testFirstname ) {
            errors.firstName = mcMessage.nameFormat || "Name should contain characters only";
        }
    } else {
        errors.firstName = mcMessage.nameRequired || "Name is required";
    }

    if( collItems.lastName ) {
        const testLastname = validate.isNameNoSpace( collItems.lastName );
        if( !testLastname ) {
            errors.lastName = mcMessage.nameFormat || "Name should contain characters only";
        }
    } else {
        errors.lastName = mcMessage.nameRequired || "Name is required";
    }

    if( !collItems.userLang ) {
        errors.userLang = mcMessage.langRequired || "Language is required";
    }

    return errors;
}

export function validatePerson( collItems ) {
    // Initialise error object and patterns matching:
    let errors = {};

    return errors;
}
