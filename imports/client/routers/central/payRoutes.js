/**
 * Created by abbeymart on 2017-03-06.
 */
import Pay from '../../apps/central/payment/Pay.vue';
import PayList from '../../apps/central/payment/PayList.vue';
import PayDetail from '../../apps/central/payment/PayDetail.vue';
import PayView from '../../apps/central/payment/PayView.vue';
import PayNew from '../../apps/central/payment/PaymentNew.vue';
import PayProvider from '../../apps/central/payment/provider/PayProvider.vue';
import PayProviderList from '../../apps/central/payment/provider/PayProviderList.vue';
import PayProviderDetail from '../../apps/central/payment/provider/PayProviderDetail.vue';
import PayProviderNew from '../../apps/central/payment/provider/PayProviderNew.vue';
import StripePay from '../../apps/central/payment/test/StripePay.vue';

import OrderPayment from '../../apps/central/om/payment/Payment.vue';
import OrderPaymentList from '../../apps/central/om/payment/PaymentList.vue';
import OrderPaymentDetail from '../../apps/central/om/payment/PaymentDetail.vue';
import OrderPaymentNew from '../../apps/central/om/payment/PaymentNew.vue';

import Refund from '../../apps/central/om/refund/Refund.vue';
import RefundList from '../../apps/central/om/refund/RefundList.vue';
import RefundDetail from '../../apps/central/om/refund/RefundDetail.vue';
import RefundView from '../../apps/central/om/refund/RefundView.vue';
import RefundNew from '../../apps/central/om/refund/RefundNew.vue';

export const payRoutes = [
    {
        path      : '/pay',
        name      : 'pay',
        redirect  : '/pay/list',
        components: {
            default: Pay,
        },
        children  : [
            {
                path      : 'list',
                name      : 'payList',
                components: {
                    default: PayList,
                }
            },
            {
                path      : 'detail',
                name      : 'payDetail',
                components: {
                    default: PayDetail,
                }
            },
            {
                path      : 'view',
                name      : 'payView',
                components: {
                    default: PayView,
                }
            },
            {
                path      : 'new',
                name      : 'payNew',
                components: {
                    default: PayNew,
                }
            },
            {
                path      : '/payProvider',
                name      : 'payProvider',
                redirect  : '/payProvider/list',
                components: {
                    default: PayProvider,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'payProviderList',
                        components: {
                            default: PayProviderList,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'payProviderDetail',
                        components: {
                            default: PayProviderDetail,
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'payProviderNew',
                        components: {
                            default: PayProviderNew,
                        }
                    },
                ]
            },
            {
                path      : '/orderPayment',
                name      : 'orderPayment',
                redirect  : '/orderPayment/list',
                components: {
                    default: OrderPayment,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'orderPaymentList',
                        components: {
                            default: OrderPaymentList,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'orderPaymentDetail',
                        components: {
                            default: OrderPaymentDetail,
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'orderPaymentNew',
                        components: {
                            default: OrderPaymentNew,
                        }
                    },
                ]
            },
            {
                path      : '/refund',
                name      : 'refund',
                redirect  : '/refund/list',
                components: {
                    default: Refund,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'refundList',
                        components: {
                            default: RefundList,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'refundDetail',
                        components: {
                            default: RefundDetail,
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'refundNew',
                        components: {
                            default: RefundNew,
                        }
                    },
                    {
                        path      : 'view',
                        name      : 'refundView',
                        components: {
                            default: RefundView,
                        }
                    },
                ]
            },
            {
                path      : 'testPay',
                name      : 'testPay',
                components: {
                    default: StripePay,
                }
            },
        ]
    },
];
