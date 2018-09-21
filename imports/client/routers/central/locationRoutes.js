/**
 * Created by abbeymart on 2017-02-18.
 */

import Location from '../../apps/central/location/Location.vue';
import LocationList from '../../apps/central/location/LocationList.vue';
import LocationDetail from '../../apps/central/location/LocationDetail.vue';
import LocationNew from '../../apps/central/location/LocationNew.vue';

export const locationRoutes = [
    {
        path      : '/location',
        name      : 'location',
        redirect  : '/location/list',
        components: {
            default: Location,
        },
        children  : [
            {
                path      : 'list',
                name      : 'locationList',
                components: {
                    default: LocationList,
                }
            },
            {
                path      : 'detail',
                name      : 'locationDetail',
                components: {
                    default: LocationDetail,
                }
            },
            {
                path      : 'new',
                name      : 'locationNew',
                components: {
                    default: LocationNew,
                }
            },
        ]
    },
];
