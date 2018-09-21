/**
 * Created by abbeymart on 2017-01-31.
 */
/**
 * Created by abbeymart on 2017-01-31.
 */
import { mcInfo } from '/imports/lib/locales/getInfo';

export default function( Vue ) {
    Vue.info = mcInfo;
    Object.defineProperties( Vue.prototype, {
        $info: {
            get: function() {
                return Vue.info;
            }
        }
    } );
}