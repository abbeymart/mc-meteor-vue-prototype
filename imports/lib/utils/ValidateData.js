/**
 * Created by abbeymart on 2016-03-30.
 * Updates: Nov-26-2016
 * Input types: number-digit, number-float, string, object, array, date, code, phone-number,
 * password, email etc.
 * Validation types: format, required, length
 * Patterns matching for parameters / inputs - specifics / consolidate common ones into utils functions:
 */
import _ from 'lodash';

export const validate = {
    isRequired( param = '' ) {
        // Validate that the item is not empty (string/object) / null / undefined
        return !(param === '' || param === null || param === undefined || _.isEmpty( param ));
    },
    isEmpty( infoItem ) {
        "use strict";
        return infoItem === '' || _.isEmpty( infoItem );
    },
    isNull( infoItem ) {
        "use strict";
        return infoItem === null;
    },
    isNumberDigit( param ) {
        "use strict";
        // Validate that param is a number (digit): 100 | 99 | 33 | 44 | 200
        const numberPattern = /^[0-9]+$/;
        return numberPattern.test( param );
    },
    isNumberFloat( param ) {
        "use strict";
        // Validate that param is a number (float): 0.90 | 99.9 | 33.3 | 44.40
        const numberPattern = /^([0-9])+([.])?([0-9])*$/;
        return numberPattern.test( param );
    },
    isStringChar( param ) {
        "use strict";
        // Validate that param is a string (characters only) -- use regEx
        const charRegEx = /^[a-zA-Z&\s\-]+$/;
        return charRegEx.test( param );
    },
    isStringAlpha( param ) {
        "use strict";
        // Validate that param is a string (alphanumeric, chars/numbers only)
        const alphaNumericPattern = /^[a-zA-Z0-9\-_]+$/;
        return alphaNumericPattern.test( param );
    },
    isObjectType( param ) {
        "use strict";
        // Validate param is an object, {}
        return isObject( param );

    },
    isArrayType( param ) {
        "use strict";
        // Validate param is an object, []
        return isArray( param );
    },
    isDateTypeYMDNumber( date ) {
        "use strict";
        // Validate param is date, YYYY-MM-DD (2016-03-20)

    },
    isDateTypeDMYNumber( param ) {
        "use strict";
        // Validate param is date, MM-DD-YYYY (03-20-2016)

    },
    isDateTypeMDYNumber( param ) {
        "use strict";
        // Validate param is date, MM-DD-YYYY (03-20-2016)

    },
    isDateTypeYMDString() {
        "use strict";
        // Validate param is date, YYYY-Month-Day (2016-March-20)

    },
    isDateTypeDMYString() {
        "use strict";
        // Validate param is date, Day-Month-YYYY (20-March-2016)

    },
    isDateTypeMDYString() {
        "use strict";
        // Validate param is date, Day-Month-YYYY (20-March-2016)

    },
    isPrime( num ) {
        "use strict";
        // create array from the num
        let nums = [];
        for( let i = 2; i < num; i++ ) {
            nums.push(i);
        }
        // check is num is divisible by all values from 2 up to num-1
        return nums.every(item => {
            return num % item === 0;
        });
    },
    isEven( num ) {
        "use strict";
        return num % 2 === 0;
    },
    isOdd( num ) {
        "use strict";
        return num % 2 !== 0;
    },
    isPassword( param ) {
        "use strict";
        const testPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9\S]{6,15}$/;
        return testPattern.test( param );
    },
    isEmail( param ) {
        "use strict";
        const testPattern = /^[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,6}$/;
        // const testPattern = /^[0-9a-zA-Z]+([\-._][0-9a-zA-Z]+)*@[0-9a-zA-Z]+([\-.][0-9a-zA-Z]+)*([.])[a-zA-Z]{2,6}$/;
        return testPattern.test( param );
    },
    isPhone( param ) {
        "use strict";
        const phonePattern = /^([1-9]{1,3})?[\-. ]?(\(\d{3}\)?[\-. ]?|\d{3}?[\-. ]?)?\d{3}?[\-. ]?\d{4}$/;
        return phonePattern.test( param );

    },
    isPostalCode( param ) {
        "use strict";
        const postCodePattern = /^[a-zA-Z0-9]+(\s)?[a-zA-Z0-9]*/;
        return postCodePattern.test( param );
    },
    isUsername() {
        "use strict";
        // John10Paul20
        const usernamePattern = /[a-zA-Z]+([a-zA-Z0-9])*/;
        return usernamePattern.test( param );
    },
    isName( param ) {
        "use strict";
        // Abi Charles Africa America
        const namePattern = /^[a-zA-Z'\-]+(\s[a-zA-Z'\-])*[a-zA-Z'\-]*/;
        return namePattern.test( param );

    },
    isURL( param ) {
        "use strict";
        // Abi Charles Africa America
        const namePattern = /^[a-zA-Z0-9\-\\_.:]+$/;
        return namePattern.test( param );

    },
    isBusinessNumber( param ) {
        "use strict";
        // business number format
        const bnPattern = /^[0-9\-]+$/;
        return bnPattern.test( param );
    },
    isStandardCode( param ) {
        "use strict";
        // Product Group | Body & Soul10
        const standardCodePattern = /^[a-zA-Z0-9]+[&\s\-_]*[a-zA-Z0-9$#]*$/;
        return standardCodePattern.test( param );
    },
    isCountryCode( param ) {
        "use strict";
        // langCode must be string of format en-US
        const countryCodePattern = /^[a-z]{2}-[A-Z]{2}$/;
        return countryCodePattern.test( param );

    },
    isLanguageCode( param ) {
        "use strict";
        // langCode must be string of format en-US
        const langCodePattern = /^[a-z]{2}-[A-Z]{2}$/;
        return langCodePattern.test( param );
    },
    isWordSpace( param ) {
        "use strict";
        // words with spaces and hyphens, no numbers
        const wordSpacePattern = /^[a-zA-Z0-9,()'._&]+[\s\-a-zA-Z0-9,()'._&]*[a-zA-Z0-9,()'._?]*$/;
        return wordSpacePattern.test( param );
    },
    isLabelCode( param ) {
        "use strict";
        // firstName_middleName_lastName
        const labelCodePattern = /^[a-zA-Z]+[_\-a-zA-Z]*[_a-z0-9]*$/;
        return labelCodePattern.test( param );
    },
    isErrorCode( param ) {
        "use strict";
        // error code format (AB10-100, AB900)
        const errorCodePattern = /^[a-zA-Z0-9]+[-]*[0-9]*$/;
        return errorCodePattern.test( param );
    },
    isPathName( param ) {
        "use strict";
        // mysite.new_base.nicelook
        const pathNamePattern = /^[a-zA-Z0-9/]+[_a-zA-Z0-9./]*[a-zA-Z0-9/]*$/;
        return pathNamePattern.test( param );
    },
    isNameNoSpace( param ) {
        "use strict";
        // JohnPaul
        const nameNoSpacePattern = /[a-zA-Z]+/;
        return nameNoSpacePattern.test( param );
    },
    isDescription( param ) {
        "use strict";
        // Alphanumeric string with spaces, and (.,:/()*_-|!@)
        const descPattern = /^[a-zA-Z0-9\s\\.,:/()*_|\-!@#$%"&'\[\];?]+$/;
        return descPattern.test( param );
    },
    isCurrency( param ) {
        "use strict";
        const currencyPattern = /^[a-zA-Z#$]+$/;
        return currencyPattern.test( param );
    }
};
