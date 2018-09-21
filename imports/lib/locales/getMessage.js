/**
 * Created by abbeymart on 2016-02-12.
 * Messages for mcConnect function/tasks' responses
 * Check language setting, order: current UI language > user profile > default (en-US)
 */
// Set namespace
let msg = {};

// Import utility function(s)
import {getLanguage} from "../utils/Language";

// Import data sources
import {enUSMessages} from "./messages/enUSMessages";
import {enCAMessages} from "./messages/enCAMessages";
import {frCAMessages} from "./messages/frCAMessages";
import {frFRMessages} from "./messages/frFRMessages";

// Get current user default language setting
const currentLang = getLanguage.currentLang();

if ( currentLang === 'en-US' ) {
    msg = enUSMessages;
}

if ( currentLang === 'en-CA' ) {
    msg = enCAMessages;
}

if ( currentLang === 'fr-CA' ) {
    msg = frCAMessages;
}

if ( currentLang === 'fr-FR' ) {
    msg = frFRMessages;
}

export const mcMessage = msg;