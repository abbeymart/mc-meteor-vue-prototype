/**
 * Created by abbeymart on 2016-12-21.
 * Other routes: access-denied, not-found etc.
 */
import NotFound from '../include/NotFound.vue';
import AccessDenied from '../include/AccessDenied.vue';

export const otherRoutes = [
    {
        path      : '/access-denied',
        name      : 'accessDenied',
        components: {
            default: AccessDenied
        }

    },
    {
        path      : '*',
        name      : 'notFound',
        components: {
            default: NotFound
        }
    },
];