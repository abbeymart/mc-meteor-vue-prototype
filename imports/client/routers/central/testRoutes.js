/**
 * Created by abbeymart on 2017-09-23.
 * mConnect Testing routes
 */
import Test from '../../apps/test/Test.vue';
import TestOrderMessage from '../../apps/test/TestOrderMessage.vue';
import TestOrderCancelMessage from '../../apps/test/TestOrderCancelMessage.vue';
import TestOrderReturnMessage from '../../apps/test/TestOrderReturnMessage.vue';
import TestOrderPayMessage from '../../apps/test/TestOrderPayMessage.vue';
import TestOrderRefundMessage from '../../apps/test/TestOrderRefundMessage.vue';
import TestOrderShipMessage from '../../apps/test/TestOrderShipMessage.vue';

export const testRoutes = [
    {
        path      : '/test',
        name      : 'test',
        components: {
            default: Test,
        },
        children  : [
            {
                path      : 'orderMessage',
                name      : 'testOrderMessage',
                components: {
                    default: TestOrderMessage,
                }
            },
            {
                path      : 'orderCancelMessage',
                name      : 'testOrderCancelMessage',
                components: {
                    default: TestOrderCancelMessage,
                }
            },
            {
                path      : 'orderReturnMessage',
                name      : 'testOrderReturnMessage',
                components: {
                    default: TestOrderReturnMessage,
                }
            },
            {
                path      : 'orderPayMessage',
                name      : 'testOrderPayMessage',
                components: {
                    default: TestOrderPayMessage,
                }
            },
            {
                path      : 'orderRefundMessage',
                name      : 'testOrderRefundMessage',
                components: {
                    default: TestOrderRefundMessage,
                }
            },
            {
                path      : 'orderShipMessage',
                name      : 'testOrderShipMessage',
                components: {
                    default: TestOrderShipMessage,
                }
            },
        ]
    },
];
