/**
 * Created by abbeymart on 2017-01-27.
 */
import { validate } from '/imports/lib/utils/ValidateData';

export default function( Vue ) {
    Vue.validate = validate;
    Object.defineProperties( Vue.prototype, {
        $validate: {
            get: function() {
                return Vue.validate;
            }
        }
    } );
}
