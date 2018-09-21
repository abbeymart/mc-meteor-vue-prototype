/**
 * Created by abbeymart on 2016-12-15.
 */
import Planning from '../apps/pam/Planning.vue';

export const pamRoutes = [
    {
        path      : '/pam',
        name      : 'pam',
        components: {
            default: Planning,
        },
    },
];