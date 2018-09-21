/**
 * Created by abbeymart on 2016-12-15.
 */
import BusinessIntelligence from '../apps/bi/BusinessIntelligence.vue';

export const biRoutes = [
    {
        path      : '/bi',
        name      : 'bi',
        components: {
            default: BusinessIntelligence,
        },
    },
];