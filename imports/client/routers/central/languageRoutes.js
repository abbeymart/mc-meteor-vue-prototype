/**
 * Created by abbeymart on 2016-12-21.
 * Localization/Internationalization: languages, labels, contents/pages, messages etc.
 */
import Language from '../../apps/central/language/Language.vue';
import LanguageList from '../../apps/central/language/LanguageList.vue';
import LanguageDetail from '../../apps/central/language/LanguageDetail.vue';
import LanguageNew from '../../apps/central/language/LanguageNew.vue';
import Label from '../../apps/central/label/Label.vue';
import LabelList from '../../apps/central/label/LabelList.vue';
import LabelDetail from '../../apps/central/label/LabelDetail.vue';
import LabelNew from '../../apps/central/label/LabelNew.vue';
import Content from '../../apps/central/content/Content.vue';
import ContentList from '../../apps/central/content/ContentList.vue';
import ContentDetail from '../../apps/central/content/ContentDetail.vue'
import ContentNew from '../../apps/central/content/ContentNew.vue';

export const languageRoutes = [
    {
        path      : '/language',
        name      : 'language',
        redirect  : '/language/list',
        components: {
            default: Language,
        },
        children  : [
            {
                path      : 'list',
                name      : 'languageList',
                components: {
                    default: LanguageList,
                }
            },
            {
                path      : 'detail',
                name      : 'languageDetail',
                components: {
                    default: LanguageDetail,
                }
            },
            {
                path      : 'new',
                name      : 'languageNew',
                components: {
                    default: LanguageNew,
                }
            },
            {
                path      : 'label',
                name      : 'label',
                redirect  : 'label/list',
                components: {
                    default: Label,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'labelList',
                        components: {
                            default: LabelList,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'labelDetail',
                        components: {
                            default: LabelDetail,
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'labelNew',
                        components: {
                            default: LabelNew,
                        }
                    },
                ]
            },
            {
                path      : 'content',
                name      : 'content',
                redirect  : 'content/list',
                components: {
                    default: Content,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'contentList',
                        components: {
                            default: ContentList,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'contentDetail',
                        components: {
                            default: ContentDetail,
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'contentNew',
                        components: {
                            default: ContentNew,
                        }
                    },
                ]
            },
        ]
    },
];
