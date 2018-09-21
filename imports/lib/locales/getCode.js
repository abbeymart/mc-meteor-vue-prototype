/**
 * Created by abbeymart on 2017-07-31
 */

// Import utility function(s)
import { getLanguage } from "../utils/Language";

// Import data sources || can be json files
import { enUSCodes } from "./codes/enUSCodes";
import { enCACodes } from "./codes/enCACodes";
import { frCACodes } from "./codes/frCACodes";
import { frFRCodes } from "./codes/frFRCodes";

// Get current user default language setting
const currentLang = getLanguage.currentLang();

let mcCodes = {};

if( currentLang === 'en-US' ) {
    mcCodes = enUSCodes;
}

if( currentLang === 'en-CA' ) {
    mcCodes = enCACodes;
}

if( currentLang === 'fr-CA' ) {
    mcCodes = frCACodes;
}

if( currentLang === 'fr-FR' ) {
    mcCodes = frFRCodes;
}

// Export the codes
export const mcCode = mcCodes;
