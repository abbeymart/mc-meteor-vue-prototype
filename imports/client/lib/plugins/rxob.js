/**
 * Created by abbeymart on 2017-11-13
 */

import Rx from 'rxjs-es';

export default function( Vue ) {
    Vue.Rx = Rx;
    Object.defineProperties( Vue.prototype, {
        $Rx: {
            get: function() {
                return Vue.Rx;
            }
        }
    } );
}