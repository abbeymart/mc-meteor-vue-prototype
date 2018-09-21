/**
 * Created by abbeymart on 2016-12-15.
 */
import MC from '../apps/mc/MC.vue';

export const mConnectRoutes = [
    {
        path      : '/mc',
        name      : 'mc',
        components: {
            default: MC,
        },
    },
];