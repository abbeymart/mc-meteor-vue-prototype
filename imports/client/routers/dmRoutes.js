/**
 * Created by abbeymart on 2016-12-15.
 */
import DataManagement from '../apps/dm/DataManagement.vue';

export const dmRoutes = [
    {
        path      : '/dm',
        name      : 'dm',
        components: {
            default: DataManagement,
        },
    },
];