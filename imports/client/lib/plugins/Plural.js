/**
 * Created by abbeymart on 2017-01-31.
 */
/**
 * Created by abbeymart on 2017-01-31.
 */
import { mcPlural } from '/imports/lib/locales/getPlural';

export default function( Vue ) {
    Vue.plural = mcPlural;
    Object.defineProperties( Vue.prototype, {
        $plural: {
            get: function() {
                return Vue.plural;
            }
        }
    } );
}
