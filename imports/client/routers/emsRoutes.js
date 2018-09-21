/**
 * Created by abbeymart on 2016-12-15.
 */
import Education from '../apps/ems/Education.vue';

export const emsRoutes = [
    {
        path      : '/ems',
        name      : 'ems',
        components: {
            default: Education,
        },
    },
];