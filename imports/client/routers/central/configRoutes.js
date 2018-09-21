/**
 * Created by abbeymart on 2017-02-09.
 * mConnect configuration routes: settings, labels, messages, information etc.
 * label: key/value >>
 */

import Setting from '../../apps/central/setting/Setting.vue';
import SettingList from '../../apps/central/setting/SettingList.vue';
import SettingDetail from '../../apps/central/setting/SettingDetail.vue';
import SettingNew from '../../apps/central/setting/SettingNew.vue';

import Eman from '../../apps/central/eman/Eman.vue';
import EmanList from '../../apps/central/eman/EmanList.vue';
import EmanDetail from '../../apps/central/eman/EmanDetail.vue';
import EmanNew from '../../apps/central/eman/EmanNew.vue';

export const configRoutes = [
    {
        path      : '/setting',
        name      : 'setting',
        redirect  : '/setting/list',
        components: {
            default: Setting,
        },
        children  : [
            {
                path      : 'list',
                name      : 'settingList',
                components: {
                    default: SettingList,
                }
            },
            {
                path      : 'detail',
                name      : 'settingDetail',
                components: {
                    default: SettingDetail,
                }
            },
            {
                path      : 'new',
                name      : 'settingNew',
                components: {
                    default: SettingNew,
                }
            },
        ]
    },
    {
        path      : '/eman',
        name      : 'eman',
        redirect  : '/eman/list',
        components: {
            default: Eman,
        },
        children  : [
            {
                path      : 'list',
                name      : 'emanList',
                components: {
                    default: EmanList,
                }
            },
            {
                path      : 'detail',
                name      : 'emanDetail',
                components: {
                    default: EmanDetail,
                }
            },
            {
                path      : 'new',
                name      : 'emanNew',
                components: {
                    default: EmanNew,
                }
            },
        ]
    },
];
