/**
 * Created by abbeymart on 2016-12-21.
 */
import Service from '../../apps/central/services/Service.vue';
import ServiceList from '../../apps/central/services/ServiceList.vue';
import ServiceDetail from '../../apps/central/services/ServiceDetail.vue';
import ServiceNew from '../../apps/central/services/ServiceNew.vue';
import Raaci from '../../apps/central/raaci/Raaci.vue';
import RaaciList from '../../apps/central/raaci/RaaciList.vue';
import RaaciDetail from '../../apps/central/raaci/RaaciDetail.vue';
import RaaciNew from '../../apps/central/raaci/RaaciNew.vue';

export const serviceRoutes = [
    {
        path      : '/service',
        name      : 'service',
        redirect  : '/service/list',
        components: {
            default: Service,
        },
        children  : [
            {
                path      : 'list',
                name      : 'serviceList',
                components: {
                    default: ServiceList,
                }
            },
            {
                path      : 'detail',
                name      : 'serviceDetail',
                components: {
                    default: ServiceDetail,
                }
            },
            {
                path      : 'new',
                name      : 'serviceNew',
                components: {
                    default: ServiceNew,
                }
            },
        ]
    },
    {
        path      : '/raaci',
        name      : 'raaci',
        redirect  : '/raaci/list',
        components: {
            default: Raaci,
        },
        children  : [
            {
                path      : 'list',
                name      : 'raaciList',
                components: {
                    default: RaaciList,
                }
            },
            {
                path      : 'detail',
                name      : 'raaciDetail',
                components: {
                    default: RaaciDetail,
                }
            },
            {
                path      : 'new',
                name      : 'raaciNew',
                components: {
                    default: RaaciNew,
                }
            },
        ],
    },
];
