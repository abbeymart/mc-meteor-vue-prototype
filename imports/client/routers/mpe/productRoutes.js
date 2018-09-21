/**
 * Created by abbeymart on 2017-04-19
 * Marketplace Products' routes
 */
import Product from '../../apps/mpe/info/product/Product.vue';
import ProductList from '../../apps/mpe/info/product/ProductList.vue'
import ProductView from '../../apps/mpe/info/product/ProductView.vue';
import ProductNew from '../../apps/mpe/info/product/ProductNew.vue';
import ProductDetail from '../../apps/mpe/info/product/ProductDetail.vue';

export const productRoutes = [
    {
        path      : '/mpe/product',
        name      : 'marketProduct',
        redirect  : '/mpe/product/list',
        components: {
            default: Product,
        },
        children  : [
            {
                path      : 'list',
                name      : 'marketProductList',
                components: {
                    default: ProductList,
                }
            },
            {
                path      : 'view',
                name      : 'marketProductView',
                components: {
                    default: ProductView,
                }
            },
            {
                path      : 'new',
                name      : 'marketProductNew',
                components: {
                    default: ProductNew,
                }
            },
            {
                path      : 'detail',
                name      : 'marketProductDetail',
                components: {
                    default: ProductDetail,
                }
            },
        ]
    },
];


