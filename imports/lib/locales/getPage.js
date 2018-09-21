/**
 * Created by abbeymart on 2016-12-12.
 */
// Namespace for the main mc pages
let mcPages = {};

// Import utility function(s)
import { getLanguage } from '../utils/Language';
import { enUSPages } from './pages/enUSPages';
import { enCAPages } from './pages/enCAPages';
import { frCAPages } from './pages/frCAPages';
import { frFRPages } from './pages/frFRPages';

// Get current user default language setting
const currentLang = getLanguage.currentLang();

if( currentLang === 'en-US' ) {
    mcPages = enUSPages;
}

if( currentLang === 'en-CA' ) {
    mcPages = enCAPages;
}

if( currentLang === 'fr-CA' ) {
    mcPages = frCAPages;
}

if( currentLang === 'fr-FR' ) {
    mcPages = frFRPages;
}

const mcPage = mcPages;

export { mcPage };
