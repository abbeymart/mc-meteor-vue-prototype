/**
 * Created by abbeymart on 2017-03-03.
 */
import Tax from '../../apps/central/tax/Tax.vue';
import TaxList from '../../apps/central/tax/TaxList.vue';
import TaxDetail from '../../apps/central/tax/TaxDetail.vue';
import TaxNew from '../../apps/central/tax/TaxNew.vue';

export const taxRoutes = [
    {
        path      : '/tax',
        name      : 'tax',
        redirect  : '/tax/list',
        components: {
            default: Tax,
        },
        children  : [
            {
                path      : 'list',
                name      : 'taxList',
                components: {
                    default: TaxList,
                }
            },
            {
                path      : 'detail',
                name      : 'taxDetail',
                components: {
                    default: TaxDetail,
                }
            },
            {
                path      : 'new',
                name      : 'taxNew',
                components: {
                    default: TaxNew,
                }
            },
        ]
    },
];
