/**
 * Created by abbeymart on 2016-02-14.
 * Current / Default language for a user
 * Order > UI-selected-Lang, userLang (user-profile) or mConnect-default (en-US)
 */
export default function getCurrentLanguage( userLang = '' ) {
    // Define/set default language variable
    let defaultLang = 'en-US';

    // Set defaultLang to current userLang, set from the UI
    if( userLang ) {
        defaultLang = userLang;
    }

    return defaultLang;
}

export const getLanguage = {
    currentLang( userLang = '' ) {
        // Define/set default language variable
        let defaultLang = 'en-US';

        // Set defaultLang to current userLang, set from the UI
        if( userLang ) {
            defaultLang = userLang;
        }
        return defaultLang;
    }
};
