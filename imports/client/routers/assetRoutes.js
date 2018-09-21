/**
 * Created by abbeymart on 2016-12-15.
 */
import AssetManagement from '../apps/asset/AssetManagement.vue';
// import Home from '../apps/Home.vue';

export const assetRoutes = [
    {
        path      : '/asset',
        name      : 'asset',
        components: {
            default: AssetManagement,
        },
    },
];
