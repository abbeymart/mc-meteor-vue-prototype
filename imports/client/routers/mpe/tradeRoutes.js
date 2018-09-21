/**
 * Created by abbeymart on 2017-04-19
 * Marketplace Products' routes
 */
import Trade from '../../apps/mpe/trade/Trade.vue';
import ProductList from '../../apps/mpe/info/product/ProductList.vue'
import ProductView from '../../apps/mpe/info/product/ProductView.vue';
import ProductNew from '../../apps/mpe/info/product/ProductNew.vue';
import ProductDetail from '../../apps/mpe/info/product/ProductDetail.vue';

export const tradeHomeRoutes = [
    {
        path      : '/trade',
        name      : 'trade',
        components: {
            default: Trade,
        },
        children  : [
            {
                path      : 'list',
                name      : 'marketTradeList',
                components: {
                    default: ProductList,
                }
            },
            {
                path      : 'view',
                name      : 'marketTradeView',
                components: {
                    default: ProductView,
                }
            },
            {
                path      : 'new',
                name      : 'marketTradeNew',
                components: {
                    default: ProductNew,
                }
            },
            {
                path      : 'detail',
                name      : 'marketTradeDetail',
                components: {
                    default: ProductDetail,
                }
            },
        ]
    },
];

export const tradeRoutes = tradeHomeRoutes.concat(

);
