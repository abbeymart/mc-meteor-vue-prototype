/**
 * Created by abbeymart on 2016-01-03.
 * Localization: common Labels for mConnect solutions - centrally accessible
 * Check language setting, order: current UI language > user profile > default (en-US)
 * TODO: convert to a plugin (for vuejs)
 */
import { Labels } from '/imports/collections/Central';

// Namespace for the global UI labels / texts
let mcLabels = {};

// Import utility function(s)
import { getLanguage } from "../utils/Language";

// Import data sources
import { enUSLabels } from "./labels/enUSLabels";
import { enCALabels } from "./labels/enCALabels";
import { frCALabels } from "./labels/frCALabels";
import { frFRLabels } from "./labels/frFRLabels";

// Get current user default language setting
const currentLang = getLanguage.currentLang();

if( currentLang === 'en-US' ) {
    mcLabels = enUSLabels;
}

if( currentLang === 'en-CA' ) {
    mcLabels = enCALabels;
}

if( currentLang === 'fr-CA' ) {
    mcLabels = frCALabels;
}

if( currentLang === 'fr-FR' ) {
    mcLabels = frFRLabels;
}

export const mcLabel = mcLabels;
