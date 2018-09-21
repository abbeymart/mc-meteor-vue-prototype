/**
 * Created by abbeymart on 2016-12-04.
 * mConnect solutions' routes index
 */
// import all mConnect solutions routes
import { centralRoutes } from './centralRoutes';
import { assetRoutes } from './assetRoutes';
import { biRoutes } from './biRoutes';
import { dmRoutes } from './dmRoutes';
import  { emsRoutes } from './emsRoutes';
import { finRoutes } from './finRoutes';
import { hcmRoutes } from './hcmRoutes';
import { hmsRoutes } from './hmsRoutes';
import { mpeRoutes } from './mpeRoutes';
import { pamRoutes } from './pamRoutes';
import { mConnectRoutes } from './mcRoutes';
import { sdmRoutes } from './sdmRoutes';
import { otherRoutes } from './otherRoutes';

// Concatenate all mConnect solutions routes
export const mcRoutes = centralRoutes.concat(
    assetRoutes,
    biRoutes,
    dmRoutes,
    emsRoutes,
    finRoutes,
    hcmRoutes,
    hmsRoutes,
    mpeRoutes,
    pamRoutes,
    mConnectRoutes,
    sdmRoutes,
    otherRoutes,
);
