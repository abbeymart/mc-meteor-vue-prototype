/**
 * Created by abbeymart on 2017-01-31.
 */
import { mcPage } from '/imports/lib/locales/getPage';

export default function( Vue ) {
    Vue.page = mcPage;
    Object.defineProperties( Vue.prototype, {
        $page: {
            get: function() {
                return Vue.page;
            }
        }
    } );
}