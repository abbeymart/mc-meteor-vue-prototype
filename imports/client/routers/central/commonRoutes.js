/**
 * Created by abbeymart on 2016-12-26.
 */
import { getStartRoutes } from './common/getStartRoutes';
import { techGuideRoutes } from './common/techGuideRoutes';
import { userGuideRoutes } from './common/userGuideRoutes';
import { kBaseRoutes } from './common/kBaseRoutes';
import { newsRoutes } from './common/newsRoutes';
import { supportRoutes } from './common/supportRoutes';
import { favouriteRoutes } from './common/favouriteRoutes';

export const commonRoutes = getStartRoutes.concat(
    techGuideRoutes,
    userGuideRoutes,
    kBaseRoutes,
    newsRoutes,
    supportRoutes,
    favouriteRoutes,
);
