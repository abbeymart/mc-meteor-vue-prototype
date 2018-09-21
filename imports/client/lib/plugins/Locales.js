/**
 * Created by abbeymart on 2017-06-28.
 */
import { mcConstant} from '/imports/lib/locales/getConstant';
import { mcInfo } from '/imports/lib/locales/getInfo';
import { mcLabel } from '/imports/lib/locales/getLabel';
import { mcMessage } from '/imports/lib/locales/getMessage';
import { mcPlural } from '/imports/lib/locales/getPlural';
import { mcCode } from '/imports/lib/locales/getCode';
import { mcLanguage } from '/imports/lib/locales/getLanguage';

export default function( Vue ) {
    Vue.constant = mcConstant;
    Vue.info = mcInfo;
    Vue.label = mcLabel;
    Vue.message = mcMessage;
    Vue.plural = mcPlural;
    Vue.mcCode   = mcCode;
    Vue.mcLang   = mcLanguage;
    Object.defineProperties( Vue.prototype, {
        $constant: {
            get: function() {
                return Vue.constant;
            }
        },
        $info: {
            get: function() {
                return Vue.info;
            }
        },
        $label: {
            get: function() {
                return Vue.label;
            }
        },
        $message: {
            get: function() {
                return Vue.message;
            }
        },
        $plural: {
            get: function() {
                return Vue.plural;
            }
        },
        $mcCode  : {
            get: function() {
                return Vue.mcCode;
            }
        },
        $mcLang  : {
            get: function() {
                return Vue.mcLang;
            }
        },
    } );
}
