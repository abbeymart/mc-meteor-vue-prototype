/**
 * Created by abbeymart on 2017-02-07.
 */
import StandardCategory from '../../apps/central/standard/StandardCategory.vue';
import StandardCategoryList from '../../apps/central/standard/StandardCategoryList.vue';
import StandardCategoryDetail from '../../apps/central/standard/StandardCategoryDetail.vue';
import StandardCategoryNew from '../../apps/central/standard/StandardCategoryNew.vue';
import StandardCode from '../../apps/central/standard/StandardCode.vue';
import StandardCodeList from '../../apps/central/standard/StandardCodeList.vue';
import StandardCodeDetail from '../../apps/central/standard/StandardCodeDetail.vue';
import StandardCodeNew from '../../apps/central/standard/StandardCodeNew.vue';

export const standardRoutes = [
    {
        path      : '/standardCategory',
        name      : 'standardCategory',
        redirect  : '/standardCategory/list',
        components: {
            default: StandardCategory,
        },
        children  : [
            {
                path      : 'list',
                name      : 'standardCategoryList',
                components: {
                    default: StandardCategoryList,
                }
            },
            {
                path      : 'detail',
                name      : 'standardCategoryDetail',
                components: {
                    default: StandardCategoryDetail,
                }
            },
            {
                path      : 'new',
                name      : 'standardCategoryNew',
                components: {
                    default: StandardCategoryNew,
                }
            },
            {
                path      : 'code',
                name      : 'standardCategoryCode',
                redirect  : '/standardCode/list',
                components: {
                    default: StandardCode,
                }
            },
            {
                path      : '/standardCode',
                name      : 'standardCode',
                redirect  : '/standardCode/list',
                components: {
                    default: StandardCode,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'standardCodeList',
                        components: {
                            default: StandardCodeList,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'standardCodeDetail',
                        components: {
                            default: StandardCodeDetail,
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'standardCodeNew',
                        components: {
                            default: StandardCodeNew,
                        }
                    },
                ]
            },
        ]
    }
];
