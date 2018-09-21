/**
 * Created by abbeymart on 2017-03-06.
 */
import Order from '../../apps/central/om/Order.vue';
import OrderList from '../../apps/central/om/OrderList.vue';
import OrderDetail from '../../apps/central/om/OrderDetail.vue';
import OrderView from '../../apps/central/om/OrderView.vue';
import OrderNew from '../../apps/central/om/OrderNew.vue';
import OrderCat from '../../apps/central/om/category/OrderCategory.vue';
import OrderCatList from '../../apps/central/om/category/OrderCategoryList.vue';
import OrderCatDetail from '../../apps/central/om/category/OrderCategoryDetail.vue';
import OrderCatNew from '../../apps/central/om/category/OrderCategoryNew.vue';
import OrderProduct from '../../apps/central/om/product/Product.vue';
import OrderProductList from '../../apps/central/om/product/ProductList.vue';
import OrderProductDetail from '../../apps/central/om/product/ProductDetail.vue';
import OrderProductNew from '../../apps/central/om/product/ProductNew.vue';
import OrderProductFeature from '../../apps/central/om/product/feature/Feature.vue';
import OrderProductFeatureList from '../../apps/central/om/product/feature/FeatureList.vue';
import OrderProductFeatureDetail from '../../apps/central/om/product/feature/FeatureDetail.vue';
import OrderProductFeatureNew from '../../apps/central/om/product/feature/FeatureNew.vue';
import OrderProductDoc from '../../apps/central/om/product/doc/Doc.vue';
import OrderProductDocList from '../../apps/central/om/product/doc/DocList.vue';
import OrderProductDocDetail from '../../apps/central/om/product/doc/DocDetail.vue';
import OrderProductDocNew from '../../apps/central/om/product/doc/DocNew.vue';
import OrderProductReview from '../../apps/central/om/product/review/Review.vue';
import OrderProductReviewList from '../../apps/central/om/product/review/ReviewList.vue';
import OrderProductReviewDetail from '../../apps/central/om/product/review/ReviewDetail.vue';
import OrderProductReviewNew from '../../apps/central/om/product/review/ReviewNew.vue';
import OrderPrice from '../../apps/central/om/product/price/Price.vue';
import OrderPriceList from '../../apps/central/om/product/price/PriceList.vue';
import OrderPriceDetail from '../../apps/central/om/product/price/PriceDetail.vue';
import OrderPriceNew from '../../apps/central/om/product/price/PriceNew.vue';
import OrderDiscount from '../../apps/central/om/product/discount/Discount.vue';
import OrderDiscountList from '../../apps/central/om/product/discount/DiscountList.vue';
import OrderDiscountDetail from '../../apps/central/om/product/discount/DiscountDetail.vue';
import OrderDiscountNew from '../../apps/central/om/product/discount/DiscountNew.vue';
import OrderInventory from '../../apps/central/om/inventory/Inventory.vue';
import OrderInventoryList from '../../apps/central/om/inventory/InventoryList.vue';
import OrderInventoryDetail from '../../apps/central/om/inventory/InventoryDetail.vue';
import OrderInventoryNew from '../../apps/central/om/inventory/InventoryNew.vue';
import OrderWish from '../../apps/central/om/wish/Wish.vue';
import OrderWishList from '../../apps/central/om/wish/WishList.vue';
import OrderWishDetail from '../../apps/central/om/wish/WishDetail.vue';
import OrderWishNew from '../../apps/central/om/wish/WishNew.vue';
import OrderWishFolder from '../../apps/central/om/wish/WishFolder.vue';
import OrderCart from '../../apps/central/om/cart/Cart.vue';
import OrderCartList from '../../apps/central/om/cart/CartList.vue';
import OrderCartDetail from '../../apps/central/om/cart/CartDetail.vue';
import OrderCartNew from '../../apps/central/om/cart/CartNew.vue';
import OrderCartView from '../../apps/central/om/cart/CartView.vue';
import OrderCartUpdate from '../../apps/central/om/cart/CartUpdate.vue';
import OrderCartCheckoutCredit from '../../apps/central/om/checkout/CheckoutCredit.vue';
import OrderCartCheckoutCash from '../../apps/central/om/checkout/CheckoutCash.vue';
import OrderCartCheckoutInvoice from '../../apps/central/om/checkout/CheckoutInvoice.vue';
import OrderCartCheckoutMultiple from '../../apps/central/om/checkout/CheckoutMultiple.vue';

import OrderTradeInvoiceDetail from '../../apps/central/om/invoice/InvoiceDetail.vue';
import OrderTradeReceiptDetail from '../../apps/central/om/receipt/ReceiptDetail.vue';
import OrderInvoice from '../../apps/central/om/invoice/Invoice.vue';
import OrderInvoiceList from '../../apps/central/om/invoice/InvoiceList.vue';
import OrderInvoiceDetail from '../../apps/central/om/invoice/InvoiceDetail.vue';
import OrderInvoiceNew from '../../apps/central/om/invoice/InvoiceNew.vue';
import OrderReceipt from '../../apps/central/om/receipt/Receipt.vue';
import OrderReceiptList from '../../apps/central/om/receipt/ReceiptList.vue';
import OrderReceiptDetail from '../../apps/central/om/receipt/ReceiptDetail.vue';
import OrderReceiptNew from '../../apps/central/om/receipt/ReceiptNew.vue';

import OrderCancel from '../../apps/central/om/cancel/Cancel.vue';
import OrderCancelList from '../../apps/central/om/cancel/CancelList.vue';
import OrderCancelDetail from '../../apps/central/om/cancel/CancelDetail.vue';
import OrderCancelNew from '../../apps/central/om/cancel/CancelNew.vue';
import CancelOrder from '../../apps/central/om/cancel/CancelOrder.vue';
import CancelOrderItem from '../../apps/central/om/cancel/CancelOrderItem.vue';

import OrderReturn from '../../apps/central/om/return/Return.vue';
import OrderReturnList from '../../apps/central/om/return/ReturnList.vue';
import OrderReturnDetail from '../../apps/central/om/return/ReturnDetail.vue';
import OrderReturnNew from '../../apps/central/om/return/ReturnNew.vue';


import OrderPay from '../../apps/central/om/OrderPay.vue';
import OrderComplete from '../../apps/central/om/OrderComplete.vue';

export const orderRoutes = [
    {
        path      : '/order',
        name      : 'order',
        redirect  : '/order/list',
        components: {
            default: Order,
        },
        children  : [
            {
                path      : 'list',
                name      : 'orderList',
                components: {
                    default: OrderList,
                }
            },
            {
                path      : 'detail',
                name      : 'orderDetail',
                components: {
                    default: OrderDetail,
                }
            },
            {
                path      : 'view',
                name      : 'orderView',
                components: {
                    default: OrderView,
                }
            },
            {
                path      : 'new',
                name      : 'orderNew',
                components: {
                    default: OrderNew,
                }
            },
            {
                path      : 'orderPay',
                name      : 'orderPay',
                components: {
                    default: OrderPay,
                }
            },
            {
                path      : 'orderComplete',
                name      : 'orderComplete',
                components: {
                    default: OrderComplete,
                }
            },
            {
                path      : 'category',
                name      : 'orderCat',
                redirect  : '/order/category/list',
                components: {
                    default: OrderCat,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'orderCatList',
                        components: {
                            default: OrderCatList,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'orderCatDetail',
                        components: {
                            default: OrderCatDetail,
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'orderCatNew',
                        components: {
                            default: OrderCatNew,
                        }
                    },
                ]
            },
            {
                path      : 'product',
                name      : 'orderProduct',
                redirect  : '/order/product/list',
                components: {
                    default: OrderProduct,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'orderProductList',
                        components: {
                            default: OrderProductList,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'orderProductDetail',
                        components: {
                            default: OrderProductDetail,
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'orderProductNew',
                        components: {
                            default: OrderProductNew,
                        }
                    },
                    {
                        path      : 'feature',
                        name      : 'orderProductFeature',
                        redirect  : '/order/product/feature/list',
                        components: {
                            default: OrderProductFeature,
                        },
                        children  : [
                            {
                                path      : 'list',
                                name      : 'orderProductFeatureList',
                                components: {
                                    default: OrderProductFeatureList,
                                }
                            },
                            {
                                path      : 'detail',
                                name      : 'orderProductFeatureDetail',
                                components: {
                                    default: OrderProductFeatureDetail,
                                }
                            },
                            {
                                path      : 'new',
                                name      : 'orderProductFeatureNew',
                                components: {
                                    default: OrderProductFeatureNew,
                                }
                            },
                        ]
                    },
                    {
                        path      : 'doc',
                        name      : 'orderProductDoc',
                        redirect  : '/order/product/doc/list',
                        components: {
                            default: OrderProductDoc,
                        },
                        children  : [
                            {
                                path      : 'list',
                                name      : 'orderProductDocList',
                                components: {
                                    default: OrderProductDocList,
                                }
                            },
                            {
                                path      : 'detail',
                                name      : 'orderProductDocDetail',
                                components: {
                                    default: OrderProductDocDetail,
                                }
                            },
                            {
                                path      : 'new',
                                name      : 'orderProductDocNew',
                                components: {
                                    default: OrderProductDocNew,
                                }
                            },
                        ]
                    },
                    {
                        path      : 'review',
                        name      : 'orderProductReview',
                        redirect  : '/order/product/review/list',
                        components: {
                            default: OrderProductReview,
                        },
                        children  : [
                            {
                                path      : 'list',
                                name      : 'orderProductReviewList',
                                components: {
                                    default: OrderProductReviewList,
                                }
                            },
                            {
                                path      : 'detail',
                                name      : 'orderProductReviewDetail',
                                components: {
                                    default: OrderProductReviewDetail,
                                }
                            },
                            {
                                path      : 'new',
                                name      : 'orderProductReviewNew',
                                components: {
                                    default: OrderProductReviewNew,
                                }
                            },
                        ]
                    },
                    {
                        path      : 'price',
                        name      : 'orderProductPrice',
                        redirect  : '/order/product/price/list',
                        components: {
                            default: OrderPrice,
                        },
                        children  : [
                            {
                                path      : 'list',
                                name      : 'orderProductPriceList',
                                components: {
                                    default: OrderPriceList,
                                }
                            },
                            {
                                path      : 'detail',
                                name      : 'orderProductPriceDetail',
                                components: {
                                    default: OrderPriceDetail,
                                }
                            },
                            {
                                path      : 'new',
                                name      : 'orderProductPriceNew',
                                components: {
                                    default: OrderPriceNew,
                                }
                            },
                        ]
                    },
                    {
                        path      : 'discount',
                        name      : 'orderProductDiscount',
                        redirect  : '/order/product/discount/list',
                        components: {
                            default: OrderDiscount,
                        },
                        children  : [
                            {
                                path      : 'list',
                                name      : 'orderProductDiscountList',
                                components: {
                                    default: OrderDiscountList,
                                }
                            },
                            {
                                path      : 'detail',
                                name      : 'orderProductDiscountDetail',
                                components: {
                                    default: OrderDiscountDetail,
                                }
                            },
                            {
                                path      : 'new',
                                name      : 'orderProductDiscountNew',
                                components: {
                                    default: OrderDiscountNew,
                                }
                            },
                        ]
                    },
                    {
                        path      : 'inventory',
                        name      : 'orderProductInventory',
                        redirect  : '/order/product/inventory/list',
                        components: {
                            default: OrderInventory,
                        },
                        children  : [
                            {
                                path      : 'list',
                                name      : 'orderProductInventoryList',
                                components: {
                                    default: OrderInventoryList,
                                }
                            },
                            {
                                path      : 'detail',
                                name      : 'orderProductInventoryDetail',
                                components: {
                                    default: OrderInventoryDetail,
                                }
                            },
                            {
                                path      : 'new',
                                name      : 'orderProductInventoryNew',
                                components: {
                                    default: OrderInventoryNew,
                                }
                            },
                        ]
                    },
                ]
            },
            {
                path      : 'wish',
                name      : 'orderWish',
                redirect  : '/order/wish/list',
                components: {
                    default: OrderWish,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'orderWishList',
                        components: {
                            default: OrderWishList,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'orderWishDetail',
                        components: {
                            default: OrderWishDetail,
                        }
                    },
                    {
                        path      : 'folder',
                        name      : 'orderWishFolder',
                        components: {
                            default: OrderWishFolder,
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'orderWishNew',
                        components: {
                            default: OrderWishNew,
                        }
                    },
                ]
            },
            {
                path      : 'cart',
                name      : 'orderCart',
                redirect  : '/order/cart/list',
                components: {
                    default: OrderCart,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'orderCartList',
                        components: {
                            default: OrderCartList,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'orderCartDetail',
                        components: {
                            default: OrderCartDetail,
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'orderCartNew',
                        components: {
                            default: OrderCartNew,
                        }
                    },
                    {
                        path      : 'view',
                        name      : 'orderCartView',
                        components: {
                            default: OrderCartView,
                        }
                    },
                    {
                        path      : 'update',
                        name      : 'orderCartUpdate',
                        components: {
                            default: OrderCartUpdate,
                        }
                    },
                    {
                        path      : 'checkout',
                        name      : 'orderCartCheckoutCredit',
                        components: {
                            default: OrderCartCheckoutCredit,
                        }
                    },
                    {
                        path      : 'checkoutCash',
                        name      : 'orderCartCheckoutCash',
                        components: {
                            default: OrderCartCheckoutCash,
                        }
                    },
                    {
                        path      : 'checkoutInvoice',
                        name      : 'orderCartCheckoutInvoice',
                        components: {
                            default: OrderCartCheckoutInvoice,
                        }
                    },
                    {
                        path      : 'checkoutMultiple',
                        name      : 'orderCartCheckoutMultiple',
                        components: {
                            default: OrderCartCheckoutMultiple,
                        }
                    },
                    {
                        path      : 'invoice',
                        name      : 'orderTradeInvoiceDetail',
                        components: {
                            default: OrderTradeInvoiceDetail,
                        }
                    },
                    {
                        path      : 'receipt',
                        name      : 'orderTradeReceiptDetail',
                        components: {
                            default: OrderTradeReceiptDetail,
                        }
                    },
                ]
            },
            {
                path      : 'cancel',
                name      : 'orderCancel',
                redirect  : '/order/cancel/list',
                components: {
                    default: OrderCancel,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'orderCancelList',
                        components: {
                            default: OrderCancelList,
                        }
                    },
                    {
                        path      : 'cancelOrder',
                        name      : 'cancelOrder',
                        components: {
                            default: CancelOrder,
                        }
                    },
                    {
                        path      : 'cancelOrderItem',
                        name      : 'cancelOrderItem',
                        components: {
                            default: CancelOrderItem,
                        }
                    },
                ]
            },
            {
                path      : 'return',
                name      : 'orderReturn',
                redirect  : '/order/return/list',
                components: {
                    default: OrderReturn,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'orderReturnList',
                        components: {
                            default: OrderReturnList,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'orderReturnDetail',
                        components: {
                            default: OrderReturnDetail,
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'orderReturnNew',
                        components: {
                            default: OrderReturnNew,
                        }
                    },
                ]
            },
            {
                path      : 'invoice',
                name      : 'orderInvoice',
                redirect  : '/order/invoice/list',
                components: {
                    default: OrderInvoice,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'orderInvoiceList',
                        components: {
                            default: OrderInvoiceList,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'orderInvoiceDetail',
                        components: {
                            default: OrderInvoiceDetail,
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'orderInvoiceNew',
                        components: {
                            default: OrderInvoiceNew,
                        }
                    },
                ]
            },
            {
                path      : 'receipt',
                name      : 'orderReceipt',
                redirect  : '/order/receipt/list',
                components: {
                    default: OrderReceipt,
                },
                children  : [
                    {
                        path      : 'list',
                        name      : 'orderReceiptList',
                        components: {
                            default: OrderReceiptList,
                        }
                    },
                    {
                        path      : 'detail',
                        name      : 'orderReceiptDetail',
                        components: {
                            default: OrderReceiptDetail,
                        }
                    },
                    {
                        path      : 'new',
                        name      : 'orderReceiptNew',
                        components: {
                            default: OrderReceiptNew,
                        }
                    },
                ]
            },
        ]
    },
];