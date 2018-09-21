/**
 * Created by abbeymart on 2017-02-18.
 */
import Doc from '../../apps/central/doc/Doc.vue';
import DocList from '../../apps/central/doc/DocList.vue';
import DocDetail from '../../apps/central/doc/DocDetail.vue';
import DocNew from '../../apps/central/doc/DocNew.vue';
import Folder from '../../apps/central/doc/folder/Folder.vue';
import FolderList from '../../apps/central/doc/folder/FolderList.vue';
import FolderDetail from '../../apps/central/doc/folder/FolderDetail.vue';
import FolderNew from '../../apps/central/doc/folder/FolderNew.vue';
import DocSetting from '../../apps/central/doc/setting/DocSetting.vue';
import DocSettingList from '../../apps/central/doc/setting/DocSettingList.vue';
import DocSettingDetail from '../../apps/central/doc/setting/DocSettingDetail.vue';
import DocSettingNew from '../../apps/central/doc/setting/DocSettingNew.vue';

export const docRoutes = [
    {
        path      : '/doc',
        name      : 'doc',
        redirect  : '/doc/list',
        components: {
            default: Doc,
        },
        children  : [
            {
                path      : 'list',
                name      : 'docList',
                components: {
                    default: DocList,
                }
            },
            {
                path      : 'detail',
                name      : 'docDetail',
                components: {
                    default: DocDetail,
                }
            },
            {
                path      : 'new',
                name      : 'docNew',
                components: {
                    default: DocNew,
                }
            },
            {
                path      : 'folder',
                name      : 'folder',
                redirect  : 'folder/list',
                components: {
                    default: Folder
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'folderList',
                        components: {
                            default: FolderList
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'folderDetail',
                        components: {
                            default: FolderDetail
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'folderNew',
                        components: {
                            default: FolderNew
                        }
                    },
                ]
            },
            {
                path      : 'docSetting',
                name      : 'docSetting',
                redirect  : 'docSetting/list',
                components: {
                    default: DocSetting
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'docSettingList',
                        components: {
                            default: DocSettingList
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'docSettingDetail',
                        components: {
                            default: DocSettingDetail
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'docSettingNew',
                        components: {
                            default: DocSettingNew
                        }
                    },
                ]
            },
        ]
    },
];
