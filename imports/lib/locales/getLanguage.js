/**
 * Created by abbeymart on 2017-07-31
 */

// Import utility function(s)
import { getLanguage } from "../utils/Language";

// Import data sources || can be json files
import { enUSLanguages } from "./languages/enUSLanguages";
import { enCALanguages } from "./languages/enCALanguages";
import { frCALanguages } from "./languages/frCALanguages";
import { frFRLanguages } from "./languages/frFRLanguages";

// Get current user default language setting
const currentLang = getLanguage.currentLang();

let mcLanguages = {};

if( currentLang === 'en-US' ) {
    mcLanguages = enUSLanguages;
}

if( currentLang === 'en-CA' ) {
    mcLanguages = enCALanguages;
}

if( currentLang === 'fr-CA' ) {
    mcLanguages = frCALanguages;
}

if( currentLang === 'fr-FR' ) {
    mcLanguages = frFRLanguages;
}

// Export the codes
export const mcLanguage = mcLanguages;
