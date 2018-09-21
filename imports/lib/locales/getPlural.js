/**
 * Created by abbeymart on 2016-01-03.
 * Localization: plurals mapping for mConnect solutions - centrally accessible
 * Check language setting, order: current UI language > user profile > default (en-US)
 */

// Namespace for the global UI labels / texts
let mcPlurals = {};

// Import utility function(s)
import {getLanguage} from "../utils/Language";

// Import data sources
import {enUSPlurals} from "./plurals/enUSPlurals";
import {enCAPlurals} from "./plurals/enCAPlurals";
import {frCAPlurals} from "./plurals/frCAPlurals";
import {frFRPlurals} from "./plurals/frFRPlurals";

// Get current user default language setting
const currentLang = getLanguage.currentLang();

if ( currentLang === 'en-US' ) {
    mcPlurals = enUSPlurals;
}

if ( currentLang === 'en-CA' ) {
    mcPlurals = enCAPlurals;
}

if ( currentLang === 'fr-CA' ) {
    mcPlurals = frCAPlurals;
}

if ( currentLang === 'fr-FR' ) {
    mcPlurals = frFRPlurals;
}

export const mcPlural = mcPlurals;
