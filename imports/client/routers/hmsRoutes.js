/**
 * Created by abbeymart on 2016-12-15.
 */
import Hospital from '../apps/hms/Hospital.vue';

export const hmsRoutes = [
    {
        path      : '/hms',
        name      : 'hms',
        components: {
            default: Hospital,
        },
    },
];