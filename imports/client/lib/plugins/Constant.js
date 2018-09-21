/**
 * Created by abbeymart on 2017-01-31.
 */
/**
 * Created by abbeymart on 2017-01-31.
 */
import { mcConstant} from '/imports/lib/locales/getConstant';

export default function( Vue ) {
    Vue.constant = mcConstant;
    Object.defineProperties( Vue.prototype, {
        $constant: {
            get: function() {
                return Vue.constant;
            }
        }
    } );
}
