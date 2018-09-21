/**
 * Created by abbeymart on 2017-02-18.
 */
import Act from '../../apps/central/act/Act.vue';
import ActList from '../../apps/central/act/ActList.vue';
import ActDetail from '../../apps/central/act/ActDetail.vue';
import ActNew from '../../apps/central/act/ActNew.vue';
import ActLevel from '../../apps/central/act/actLevel/ActLevel.vue';
import ActLevelList from '../../apps/central/act/actLevel/ActLevelList.vue';
import ActLevelDetail from '../../apps/central/act/actLevel/ActLevelDetail.vue';
import ActLevelNew from '../../apps/central/act/actLevel/ActLevelNew.vue';
import GroupLevel from '../../apps/central/act/groupLevel/GroupLevel.vue';
import GroupLevelList from '../../apps/central/act/groupLevel/GroupLevelList.vue';
import GroupLevelDetail from '../../apps/central/act/groupLevel/GroupLevelDetail.vue';
import GroupLevelNew from '../../apps/central/act/groupLevel/GroupLevelNew.vue';
import GroupUser from '../../apps/central/act/groupUser/GroupUser.vue';
import GroupUserList from '../../apps/central/act/groupUser/GroupUserList.vue';
import GroupUserDetail from '../../apps/central/act/groupUser/GroupUserDetail.vue';
import GroupUserNew from '../../apps/central/act/groupUser/GroupUserNew.vue';
import ActTask from '../../apps/central/act/actTask/ActTask.vue';
import ActTaskList from '../../apps/central/act/actTask/ActTaskList.vue';
import ActTaskDetail from '../../apps/central/act/actTask/ActTaskDetail.vue';
import ActTaskNew from '../../apps/central/act/actTask/ActTaskNew.vue';

export const actRoutes = [
    {
        path      : '/act',
        name      : 'act',
        redirect  : '/act/list',
        components: {
            default: Act,
        },
        children  : [
            {
                path      : 'list',
                name      : 'actList',
                components: {
                    default: ActList,
                }
            },
            {
                path      : 'detail',
                name      : 'actDetail',
                components: {
                    default: ActDetail,
                }
            },
            {
                path      : 'new',
                name      : 'actNew',
                components: {
                    default: ActNew,
                }
            },
            {
                path      : 'actLevel',
                name      : 'actLevel',
                redirect  : 'actLevel/list',
                components: {
                    default: ActLevel
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'actLevelList',
                        components: {
                            default: ActLevelList
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'actLevelDetail',
                        components: {
                            default: ActLevelDetail
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'actLevelNew',
                        components: {
                            default: ActLevelNew
                        }
                    },
                ]
            },
            {
                path      : 'groupLevel',
                name      : 'groupLevel',
                redirect  : 'groupLevel/list',
                components: {
                    default: GroupLevel
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'groupLevelList',
                        components: {
                            default: GroupLevelList
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'groupLevelDetail',
                        components: {
                            default: GroupLevelDetail
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'groupLevelNew',
                        components: {
                            default: GroupLevelNew
                        }
                    },
                ]
            },
            {
                path      : 'groupUser',
                name      : 'groupUser',
                redirect  : 'groupUser/list',
                components: {
                    default: GroupUser
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'groupUserList',
                        components: {
                            default: GroupUserList
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'groupUserDetail',
                        components: {
                            default: GroupUserDetail
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'groupUserNew',
                        components: {
                            default: GroupUserNew
                        }
                    },
                ]
            },
            {
                path      : 'actTask',
                name      : 'actTask',
                redirect  : 'actTask/list',
                components: {
                    default: ActTask
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'actTaskList',
                        components: {
                            default: ActTaskList
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'actTaskDetail',
                        components: {
                            default: ActTaskDetail
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'actTaskNew',
                        components: {
                            default: ActTaskNew
                        }
                    },
                ]
            },
        ]
    },
];
