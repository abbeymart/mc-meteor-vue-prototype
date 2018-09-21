/**
 * Created by abbeymart on 2017-01-31.
 * Locales: labels plugin
 */
import { mcLabel } from '/imports/lib/locales/getLabel';

export default function( Vue ) {
    Vue.label = mcLabel;
    Object.defineProperties( Vue.prototype, {
        $label: {
            get: function() {
                return Vue.label;
            }
        }
    } );
}
