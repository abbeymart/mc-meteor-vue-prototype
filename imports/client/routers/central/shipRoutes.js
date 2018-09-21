/**
 * Created by abbeymart on 2017-03-06.
 */
import Ship from '../../apps/central/shipping/Ship.vue';
import ShipList from '../../apps/central/shipping/ShipList.vue';
import ShipDetail from '../../apps/central/shipping/ShipDetail.vue';
import ShipNew from '../../apps/central/shipping/ShipNew.vue';
import ShipProvider from '../../apps/central/shipping/provider/ShipProvider.vue';
import ShipProviderList from '../../apps/central/shipping/provider/ShipProviderList.vue';
import ShipProviderDetail from '../../apps/central/shipping/provider/ShipProviderDetail.vue';
import ShipProviderNew from '../../apps/central/shipping/provider/ShipProviderNew.vue';
import ShipCost from '../../apps/central/shipping/cost/ShipCost.vue';
import ShipCostList from '../../apps/central/shipping/cost/ShipCostList.vue';
import ShipCostDetail from '../../apps/central/shipping/cost/ShipCostDetail.vue';
import ShipCostNew from '../../apps/central/shipping/cost/ShipCostNew.vue';
import ShipOrder from '../../apps/central/shipping/order/ShipOrder.vue';
import ShipOrderList from '../../apps/central/shipping/order/ShipOrderList.vue';
import ShipOrderDetail from '../../apps/central/shipping/order/ShipOrderDetail.vue';
import ShipOrderNew from '../../apps/central/shipping/order/ShipOrderNew.vue';

export const shipRoutes = [
    {
        path      : '/ship',
        name      : 'ship',
        redirect  : '/ship/list',
        components: {
            default: Ship,
        },
        children  : [
            {
                path      : 'list',
                name      : 'shipList',
                components: {
                    default: ShipList,
                }
            },
            {
                path      : 'detail',
                name      : 'shipDetail',
                components: {
                    default: ShipDetail,
                }
            },
            {
                path      : 'new',
                name      : 'shipNew',
                components: {
                    default: ShipNew,
                }
            },
            {
                path      : '/shipProvider',
                name      : 'shipProvider',
                redirect  : '/shipProvider/list',
                components: {
                    default: ShipProvider,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'shipProviderList',
                        components: {
                            default: ShipProviderList,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'shipProviderDetail',
                        components: {
                            default: ShipProviderDetail,
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'shipProviderNew',
                        components: {
                            default: ShipProviderNew,
                        }
                    },
                ]
            },
            {
                path      : '/shipCost',
                name      : 'shipCost',
                redirect  : '/shipCost/list',
                components: {
                    default: ShipCost,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'shipCostList',
                        components: {
                            default: ShipCostList,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'shipCostDetail',
                        components: {
                            default: ShipCostDetail,
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'shipCostNew',
                        components: {
                            default: ShipCostNew,
                        }
                    },
                ]
            },
            {
                path      : '/shipOrder',
                name      : 'shipOrder',
                redirect  : '/shipOrder/list',
                components: {
                    default: ShipOrder,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'shipOrderList',
                        components: {
                            default: ShipOrderList,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'shipOrderDetail',
                        components: {
                            default: ShipOrderDetail,
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'shipOrderNew',
                        components: {
                            default: ShipOrderNew,
                        }
                    },
                ]
            },
        ]
    },
];
