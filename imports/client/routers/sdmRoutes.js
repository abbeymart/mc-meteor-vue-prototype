/**
 * Created by abbeymart on 2016-12-15.
 */
import ServiceDelivery from '../apps/sdm/ServicesDelivery.vue';

export const sdmRoutes = [
    {
        path      : '/sdm',
        name      : 'sdm',
        components: {
            default: ServiceDelivery,
        },
    },
];