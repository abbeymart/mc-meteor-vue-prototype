/**
 * Created by abbeymart on 2017-01-31.
 */
import { utils } from '/imports/lib/utils/Utility';
import { validate } from '/imports/lib/utils/ValidateData';
import axios from 'axios';
import jq from 'jquery';
import _ from 'lodash';
// import moment from 'moment';
// import numeral from 'numeral';

const moment  = require( 'moment' ),
      numeral = require( 'numeral' );

export default function( Vue ) {
    Vue.utils    = utils;
    Vue.validate = validate;
    Vue.jq       = jq;
    Vue.lo       = _;
    Vue.mo       = moment;
    Vue.num      = numeral;
    Vue.ax       = axios;
    Object.defineProperties( Vue.prototype, {
        $utils   : {
            get: function() {
                return Vue.utils;
            }
        },
        $validate: {
            get: function() {
                return Vue.validate;
            }
        },
        $jq      : {
            get: function() {
                return Vue.jq;
            }
        },
        $lo      : {
            get: function() {
                return Vue.lo;
            }
        },
        $mo      : {
            get: function() {
                return Vue.mo;
            }
        },
        $num     : {
            get: function() {
                return Vue.num;
            }
        },
        $ax     : {
            get: function() {
                return Vue.ax;
            }
        },
    } );
}
