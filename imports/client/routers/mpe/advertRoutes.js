/**
 * Created by abbeymart on 2017-04-19
 * Marketplace Products' routes
 */
import Advert from '../../apps/mpe/advert/Advert.vue';
import AdvertList from '../../apps/mpe/advert/AdvertList.vue'
import AdvertView from '../../apps/mpe/advert/AdvertView.vue';
import AdvertNew from '../../apps/mpe/advert/AdvertNew.vue';
import AdvertDetail from '../../apps/mpe/advert/AdvertDetail.vue';

export const advertHomeRoutes = [
    {
        path      : '/mpe/advert',
        name      : 'marketAdvert',
        redirect  : '/mpe/advert/list',
        components: {
            default: Advert,
        },
        children  : [
            {
                path      : 'list',
                name      : 'marketAdvertList',
                components: {
                    default: AdvertList,
                }
            },
            {
                path      : 'view',
                name      : 'marketAdvertView',
                components: {
                    default: AdvertView,
                }
            },
            {
                path      : 'new',
                name      : 'marketAdvertNew',
                components: {
                    default: AdvertNew,
                }
            },
            {
                path      : 'detail',
                name      : 'marketAdvertDetail',
                components: {
                    default: AdvertDetail,
                }
            },
            {
                path      : 'campaign',
                name      : 'adCampaign',
                redirect  : '/mpe/advert/campaign/list',
                components: {
                    default: AdvertList,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'adCampaignList',
                        components: {
                            default: AdvertList,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'adCampaignDetail',
                        components: {
                            default: AdvertList,
                        }
                    },
                ],
            },
            {
                path      : 'track',
                name      : 'adTrack',
                redirect  : '/advert/track/list',
                components: {
                    default: AdvertList,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'adTrackList',
                        components: {
                            default: AdvertList,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'adTrackDetail',
                        components: {
                            default: AdvertList,
                        }
                    },
                ],
            },
            {
                path      : 'report',
                name      : 'adReport',
                redirect  : '/mpe/advert/report/list',
                components: {
                    default: AdvertList,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'adReportList',
                        components: {
                            default: AdvertList,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'adReportDetail',
                        components: {
                            default: AdvertList,
                        }
                    },
                ],
            },
        ]
    },
];

export const advertRoutes = advertHomeRoutes.concat();
