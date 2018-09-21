/**
 * Created by abbeymart on 2017-04-19
 * Marketplace Products' routes
 */
import Intel from '../../apps/mpe/intel/Intel.vue';
import ProductList from '../../apps/mpe/info/product/ProductList.vue'
import ProductView from '../../apps/mpe/info/product/ProductView.vue';
import ProductNew from '../../apps/mpe/info/product/ProductNew.vue';
import ProductDetail from '../../apps/mpe/info/product/ProductDetail.vue';

export const intelHomeRoutes = [
    {
        path      : '/mpe/intel',
        name      : 'marketIntel',
        redirect  : '/mpe/intel/list',
        components: {
            default: Intel,
        },
        children  : [
            {
                path      : 'list',
                name      : 'marketIntelList',
                components: {
                    default: ProductList,
                }
            },
            {
                path      : 'view',
                name      : 'marketIntelView',
                components: {
                    default: ProductView,
                }
            },
            {
                path      : 'new',
                name      : 'marketIntelNew',
                components: {
                    default: ProductNew,
                }
            },
            {
                path      : 'detail',
                name      : 'marketIntelDetail',
                components: {
                    default: ProductDetail,
                }
            },
        ]
    },
];

export const intelRoutes = intelHomeRoutes.concat();
