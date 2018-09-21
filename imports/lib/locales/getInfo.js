/**
 * Created by abbeymart on 2016-02-14.
 * MConnect Information (by language)
 */
// Import utility function(s)
import { getLanguage } from "../utils/Language";

// Import data sources
import { enUSInfo, enUSSolutions, enUSDocuments, enUSFastLinks } from "./info/enUSInfo";
import { enCAInfo, enCASolutions, enCADocuments, enCAFastLinks } from "./info/enCAInfo";
import { frCAInfo, frCASolutions, frCADocuments, frCAFastLinks } from "./info/frCAInfo";
import { frFRInfo, frFRSolutions, frFRDocuments, frFRFastLinks } from "./info/frFRInfo";

// Get current user default language setting
const currentLang = getLanguage.currentLang();

let mci    = {},
    mcs    = {},
    mcdoc  = {},
    mcfast = {};

if( currentLang === 'en-US' ) {
    mci    = enUSInfo;
    mcs    = enUSSolutions;
    mcdoc  = enUSDocuments;
    mcfast = enUSFastLinks;
}

if( currentLang === 'en-CA' ) {
    mci    = enCAInfo;
    mcs    = enCASolutions;
    mcdoc  = enCADocuments;
    mcfast = enCAFastLinks;
}

if( currentLang === 'fr-CA' ) {
    mci    = frCAInfo;
    mcs    = frCASolutions;
    mcdoc  = frCADocuments;
    mcfast = frCAFastLinks;
}

if( currentLang === 'fr-FR' ) {
    mci    = frFRInfo;
    mcs    = frFRSolutions;
    mcdoc  = frFRDocuments;
    mcfast = frFRFastLinks;
}

// Export mConnect information items

export const mcInfo      = {
    getName() {
        "use strict";
        return mci.name;
    },
    getVersion() {
        "use strict";
        return mci.version;
    },
    getProductName() {
        "use strict";
        return mci.product;
    },
    getSlogan() {
        "use strict";
        return mci.slogan;
    },
    getMCSlogan() {
        "use strict";
        return mci.mcSlogan;
    },
    getCompanyName() {
        "use strict";
        return mci.company;
    },
    getCompanyCode() {
        "use strict";
        return mci.companyCode;
    },
    getClientName() {
        "use strict";
        return mci.client;
    },
    getMCTitle() {
        "use strict";
        return mci.mc;
    },
    getCentralTitle() {
        "use strict";
        return mci.central;
    },
    getMPETitle() {
        "use strict";
        return mci.mpe;
    },
    getPAMTitle() {
        "use strict";
        return mci.pam;
    },
    getAssetTitle() {
        "use strict";
        return mci.asset;
    },
    getSDMTitle() {
        "use strict";
        return mci.sdm;
    },
    getHCMTitle() {
        "use strict";
        return mci.hcm;
    },
    getFINTitle() {
        "use strict";
        return mci.fin;
    },
    getHMSTitle() {
        "use strict";
        return mci.hms;
    },
    getEMSTitle() {
        "use strict";
        return mci.ems;
    },
    getEGOVTitle() {
        "use strict";
        return mci.egov;
    },
    getDABITitle() {
        "use strict";
        return mci.dabi;
    },
    getDMTitle() {
        "use strict";
        return mci.dm;
    },
    getBITitle() {
        "use strict";
        return mci.bi;
    },
    getMCTitle() {
        "use strict";
        return mci.mc;
    },
    getFooterMessage() {
        "use strict";
        return mci.footerMessage;
    }
};
export const mcSolutions = mcs;
export const mcDocuments = mcdoc;
export const mcFastLinks = mcfast;
