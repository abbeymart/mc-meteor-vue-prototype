/**
 * Created by abbeymart on 2016-02-14.
 * Constants for mcConnect function/tasks' responses: in multiple languages
 */
// Import utility function(s)
import { getLanguage } from "../utils/Language";

// Import data sources || can be json files
import { enUSConstants } from "./constants/enUSConstants";
import { enCAConstants } from "./constants/enCAConstants";
import { frCAConstants } from "./constants/frCAConstants";
import { frFRConstants } from "./constants/frFRConstants";

// Get current user default language setting
const currentLang = getLanguage.currentLang();

let mcConst = {};

if( currentLang === 'en-US' ) {
    mcConst = enUSConstants;
}

if( currentLang === 'en-CA' ) {
    mcConst = enCAConstants;
}

if( currentLang === 'fr-CA' ) {
    mcConst = frCAConstants;
}

if( currentLang === 'fr-FR' ) {
    mcConst = frFRConstants;
}

// Making the global settings private (ensure constant values set in the configuration files)
export const mcConstant = {
    getShortDesc() {
        "use strict";
        return mcConst.SHORT_DESC;
    },
    getDefaultLanguage() {
        "use strict";
        return mcConst.DEFAULT_LANG;
    },
    getDefaultCurrency() {
        "use strict";
        return mcConst.DEFAULT_CURRENCY;
    },
    getDDPLimit() {
        "use strict";
        return mcConst.DDP_LIMIT;
    },
    getCreateLogType() {
        "use strict";
        return mcConst.CREATE_LOG_TYPE;
    },
    getUpdateLogType() {
        "use strict";
        return mcConst.UPDATE_LOG_TYPE;
    },
    getRemoveLogType() {
        "use strict";
        return mcConst.REMOVE_LOG_TYPE;
    },
    getSearchLogType() {
        "use strict";
        return mcConst.SEARCH_LOG_TYPE;
    },
    getLoginType() {
        "use strict";
        return mcConst.LOGIN_LOG_TYPE;
    },
    getLogoutType() {
        "use strict";
        return mcConst.LOGOUT_LOG_TYPE;
    },
    getLoginTimeout(){
        "use strict";
        return mcConst.LOGIN_TIMEOUT;
    },
    getRememberMeTimeout(){
        "use strict";
        return mcConst.REMEMBER_TIMEOUT;
    },
    getLogCreate(){
        "use strict";
        return mcConst.LOG_CREATE;
    },
    getLogRead(){
        "use strict";
        return mcConst.LOG_READ;
    },
    getLogUpdate(){
        "use strict";
        return mcConst.LOG_UPDATE;
    },
    getLogDelete(){
        "use strict";
        return mcConst.LOG_DELETE;
    },
    getLogLogin(){
        "use strict";
        return mcConst.LOG_LOGIN;
    },
    getLogLogout(){
        "use strict";
        return mcConst.LOG_LOGOUT;
    },
    getMaxFileCount(){
        "use strict";
        return mcConst.MAX_FILE_COUNT;
    },
    getMaxFileSize(){
        "use strict";
        return mcConst.MAX_FILE_SIZE;
    },
    getMaxProductQuantity(){
        "use strict";
        return mcConst.MAX_PRODUCT_QTY;
    },
    getQueryLimit(){
        "use strict";
        return mcConst.QUERY_REC_LIMIT;
    },
    getDefaultCart(){
        "use strict";
        return mcConst.DEFAULT_CART;
    },
    getDefaultWish(){
        "use strict";
        return mcConst.DEFAULT_WISH;
    },
};
