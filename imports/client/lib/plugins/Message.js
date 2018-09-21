/**
 * Created by abbeymart on 2017-01-31.
 */
import { mcMessage } from '/imports/lib/locales/getMessage';

export default function( Vue ) {
    Vue.message = mcMessage;
    Object.defineProperties( Vue.prototype, {
        $message: {
            get: function() {
                return Vue.message;
            }
        }
    } );
}
