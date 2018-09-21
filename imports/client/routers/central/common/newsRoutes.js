/**
 * Created by abbeymart on 2016-12-26.
 */
import News from '../../../apps/central/common/News.vue';

export const newsRoutes = [
    {
        path      : '/news',
        name      : 'news',
        components: {
            default: News,
        },
    },
];
