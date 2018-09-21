/**
 * Created by abbeymart on 2016-12-04. | Updated: Apr-04-2017
 */
import MarketplaceExplorer from '../apps/mpe/MarketplaceExplorer.vue';
// import Register from '../apps/central/user/Register';
// import Login from '../apps/central/user/Login';
// import Logout from '../apps/central/user/Logout';
// import UserAccount from '../apps/central/user/UserAccount';

import { productRoutes } from './mpe/productRoutes';
import { advertRoutes } from './mpe/advertRoutes';
import { intelRoutes } from './mpe/intelRoutes';
import { tradeRoutes } from './mpe/tradeRoutes';

export const mpeHomeRoutes = [
    {
        path      : '/mpe',
        name      : 'mpe',
        components: {
            default: MarketplaceExplorer,
        },
        // children: [
        //     {
        //         path      : 'register',
        //         name      : 'mpeRegister',
        //         components: {
        //             default: Register,
        //         }
        //     },
        //     {
        //         path      : 'login',
        //         name      : 'mpeLogin',
        //         components: {
        //             default: Login,
        //         }
        //     },
        //     {
        //         path      : 'logout',
        //         name      : 'mpeLogout',
        //         components: {
        //             default: Logout,
        //         }
        //     },
        //     {
        //         path      : 'account',
        //         name      : 'mpeAccount',
        //         components: {
        //             default: UserAccount,
        //         }
        //     },
        // ]
    },
];

export const mpeRoutes = mpeHomeRoutes.concat(
    productRoutes,
    intelRoutes,
    advertRoutes,
    tradeRoutes,
);
