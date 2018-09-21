/**
 * Created by abbeymart on 2016-12-15.
 */
import Finance from '../apps/fin/Finance.vue';

export const finRoutes = [
    {
        path      : '/fin',
        name      : 'fin',
        components: {
            default: Finance,
        },
    },
];