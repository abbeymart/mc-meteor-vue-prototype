/**
 * Created by abbeymart on 2016-12-04.
 */
import Home from '../apps/Home.vue';
import Central from '../apps/central/Central.vue';

import { commonRoutes } from './central/commonRoutes';
import { userAccountRoutes } from './central/userAccountRoutes';
import { languageRoutes } from './central/languageRoutes';
import { serviceRoutes } from './central/serviceRoutes';
import { standardRoutes } from './central/standardRoutes';
import { configRoutes } from './central/configRoutes';
import { locationRoutes } from './central/locationRoutes';
import { orgRoutes } from './central/orgRoutes';
import { utilRoutes } from './central/utilRoutes';
import { todoRoutes } from './central/todoRoutes';
import { actRoutes } from './central/actRoutes';
import { docRoutes } from './central/docRoutes';
import { msgRoutes } from './central/msgRoutes';
import { taxRoutes } from './central/taxRoutes';
import { payRoutes } from './central/payRoutes';
import { shipRoutes } from './central/shipRoutes';
import { auditRoutes } from './central/auditRoutes';
import { orderRoutes } from './central/orderRoutes';
import { searchRoutes } from './central/searchRoutes';
import { testRoutes } from "./central/testRoutes";

const centralHomeRoutes = [
    {
        path      : '/',
        name      : 'home',
        components: {
            default: Home,
        },
    },
    {
        path      : '/central',
        name      : 'central',
        components: {
            default: Central,
        },
    },
];

export const centralRoutes = centralHomeRoutes.concat(
    commonRoutes,
    userAccountRoutes,
    languageRoutes,
    standardRoutes,
    serviceRoutes,
    locationRoutes,
    orgRoutes,
    todoRoutes,
    actRoutes,
    docRoutes,
    msgRoutes,
    taxRoutes,
    payRoutes,
    shipRoutes,
    orderRoutes,
    auditRoutes,
    configRoutes,
    utilRoutes,
    searchRoutes,
    testRoutes,
);
