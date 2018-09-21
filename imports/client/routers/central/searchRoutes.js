/**
 * Created by abbeymart on 2016-12-21.
 * Localization/Internationalization: languages, labels, contents/pages, messages etc.
 */
import Search from '../../apps/central/search/Search.vue';
import SearchView from '../../apps/central/search/SearchView.vue';
import SearchNew from '../../apps/central/search/SearchNew.vue';
import SearchAdvance from '../../apps/central/search/SearchAdvanced.vue';

import ServiceSearch from '../../apps/central/search/service/ServiceSearch.vue'
import LocationSearch from '../../apps/central/search/location/LocationSearch.vue';
import OrgSearch from '../../apps/central/search/organization/OrgSearch.vue';
import PeopleSearch from '../../apps/central/search/people/PeopleSearch.vue';
import ProductSearch from '../../apps/central/search/product/ProductSearch.vue';
import ProductEmail from '../../apps/central/search/product/ProductEmail.vue';

import ServiceView from '../../apps/central/search/service/ServiceView.vue';
import ProductView from '../../apps/central/search/product/ProductView.vue';
import PeopleView from '../../apps/central/search/people/PersonView.vue';
import OrgView from '../../apps/central/search/organization/OrgView.vue';
import LocationView from '../../apps/central/search/location/LocationView.vue';

export const searchRoutes = [
    {
        path      : '/search',
        name      : 'search',
        redirect  : '/search/service/list',
        components: {
            default: Search,
        },
        children  : [
            {
                path      : 'new',
                name      : 'searchNew',
                components: {
                    default: SearchNew,
                }
            },
            {
                path      : 'list',
                name      : 'searchList',
                components: {
                    default: SearchNew,
                }
            },
            {
                path      : 'advance',
                name      : 'searchAdvance',
                components: {
                    default: SearchAdvance,
                }
            },
            {
                path      : 'service',
                name      : 'serviceSearch',
                redirect  : '/search/service/list',
                components: {
                    default: SearchView,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'searchSearchList',
                        components: {
                            default: ServiceSearch,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'searchServiceDetail',
                        components: {
                            default: ServiceView,
                        }
                    },
                ]
            },
            {
                path      : 'product',
                name      : 'productSearch',
                redirect  : '/search/product/list',
                components: {
                    default: SearchView,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'searchProductList',
                        components: {
                            default: ProductSearch,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'searchProductDetail',
                        components: {
                            default: ProductView,
                        },
                        children  : [
                            {
                                path      : ':id',
                                name      : 'searchProductDetailId',
                                components: {
                                    default: ProductView,
                                }
                            },
                        ]
                    },
                    {
                        path      : 'email',
                        name      : 'searchProductEmail',
                        components: {
                            default: ProductEmail,
                        }
                    },
                ]
            },
            {
                path      : 'org',
                name      : 'orgSearch',
                redirect  : '/search/org/list',
                components: {
                    default: SearchView,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'searchOrgList',
                        components: {
                            default: OrgSearch,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'searchOrgDetail',
                        components: {
                            default: OrgView,
                        }
                    },
                ]
            },
            {
                path      : 'location',
                name      : 'locationSearch',
                redirect  : '/search/location/list',
                components: {
                    default: SearchView,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'locationSearchList',
                        components: {
                            default: LocationSearch,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'searchLocationDetail',
                        components: {
                            default: LocationView,
                        }
                    },
                ]
            },
            {
                path      : 'people',
                name      : 'peopleSearch',
                redirect  : '/search/people/list',
                components: {
                    default: SearchView,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'searchPeopleList',
                        components: {
                            default: PeopleSearch,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'searchPeopleDetail',
                        components: {
                            default: PeopleView,
                        }
                    },
                ]
            },
        ]
    },
];
