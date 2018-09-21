/**
 * Created by abbeymart on 2017-09-04.
 * Order Management states
 */
export default {
    state() {
        return {
            orderItem           : {},
            orderPayItem        : {},
            orderViewItem       : {},
            catItem             : {},
            productItem         : {},
            productDocItem      : {},
            productFeatureItem  : {},
            productReviewItem   : {},
            productPriceItem    : {},
            productDiscountItem : {},
            productInventoryItem: {},
            priceItem           : {},
            wishItem            : {},
            cartItem            : {},
            tradeItem           : {},
            tradeItems          : [],
            tradeParams         : {},
            tradeFolder         : '',
            productUrl          : '',
            checkoutItem        : {},
            cancelItem          : {},
            returnItem          : {},
            invoiceItem         : {},
            receiptItem         : {},
        }
    },
    getters  : {
        getOrderItem( state ) {
            return state.orderItem;
        },
        getOrderViewItem( state ) {
            return state.orderViewItem;
        },
        getOrderPayItem( state ) {
            return state.orderPayItem;
        },
        getCatItem( state ) {
            return state.catItem;
        },
        getProductItem( state ) {
            return state.productItem;
        },
        getProductDocItem( state ) {
            return state.productDocItem;
        },
        getProductFeatureItem( state ) {
            return state.productFeatureItem;
        },
        getProductReviewItem( state ) {
            return state.productReviewItem;
        },
        getProductPriceItem( state ) {
            return state.productPriceItem;
        },
        getProductDiscountItem( state ) {
            return state.productDiscountItem;
        },
        getProductInventoryItem( state ) {
            return state.productInventoryItem;
        },
        getPriceItem( state ) {
            return state.priceItem;
        },
        getWishItem( state ) {
            return state.wishItem;
        },
        getCartItem( state ) {
            return state.cartItem;
        },
        getTradeItem( state ) {
            return state.tradeItem;
        },
        getTradeItems( state ) {
            return state.tradeItems;
        },
        getTradeParams( state ) {
            return state.tradeParams;
        },
        getTradeFolder( state ) {
            return state.tradeFolder;
        },
        getProductUrl( state ) {
            return state.productUrl;
        },
        getCheckoutItem( state ) {
            return state.checkoutItem;
        },
        getCancelItem( state ) {
            return state.cancelItem;
        },
        getReturnItem( state ) {
            return state.returnItem;
        },
        getInvoiceItem( state ) {
            return state.invoiceItem;
        },
        getReceiptItem( state ) {
            return state.receiptItem;
        },
    },
    mutations: {
        changeOrderItem( state, payload ) {
            state.orderItem = payload;
        },
        changeOrderViewItem( state, payload ) {
            state.orderViewItem = payload;
        },
        changeOrderPayItem( state, payload ) {
            state.orderPayItem = payload;
        },
        changeCatItem( state, payload ) {
            state.catItem = payload;
        },
        changeProductItem( state, payload ) {
            state.productItem = payload;
        },
        changeProductDocItem( state, payload ) {
            state.productDocItem = payload;
        },
        changeProductFeatureItem( state, payload ) {
            state.productItem = payload;
        },
        changeProductReviewItem( state, payload ) {
            state.productReviewItem = payload;
        },
        changeProductPriceItem( state, payload ) {
            state.productPriceItem = payload;
        },
        changeProductDiscountItem( state, payload ) {
            state.productDiscountItem = payload;
        },
        changePriceItem( state, payload ) {
            state.priceItem = payload;
        },
        changeProductInventoryItem( state, payload ) {
            state.productInventoryItem = payload;
        },
        changeWishItem( state, payload ) {
            state.wishItem = payload;
        },
        changeCartItem( state, payload ) {
            state.cartItem = payload;
        },
        changeTradeItem( state, payload ) {
            state.tradeItem = payload;
        },
        changeTradeItems( state, payload ) {
            state.tradeItems = payload;
        },
        changeTradeParams( state, payload ) {
            state.tradeParams = payload;
        },
        changeTradeFolder( state, payload ) {
            state.tradeFolder = payload.folder;
        },
        changeProductUrl( state, payload ) {
            state.productUrl = payload.url;
        },
        changeCheckoutItem( state, payload ) {
            state.checkoutItem = payload;
        },
        changeCancelItem( state, payload ) {
            state.cancelItem = payload;
        },
        changeReturnItem( state, payload ) {
            state.returnItem = payload;
        },
        changeInvoiceItem( state, payload ) {
            state.invoiceItem = payload;
        },
        changeReceiptItem( state, payload ) {
            state.receiptItem = payload;
        },
    },
    actions  : {
        setOrderItem( { commit }, payload ) {
            commit( 'changeOrderItem', payload );
        },
        setOrderViewItem( { commit }, payload ) {
            commit( 'changeOrderViewItem', payload );
        },
        setOrderPayItem( { commit }, payload ) {
            commit( 'changeOrderPayItem', payload );
        },
        setCatItem( { commit }, payload ) {
            commit( 'changeCatItem', payload );
        },
        setProductItem( { commit }, payload ) {
            commit( 'changeProductItem', payload );
        },
        setProductDocItem( { commit }, payload ) {
            commit( 'changeProductDocItem', payload );
        },
        setProductFeatureItem( { commit }, payload ) {
            commit( 'changeProductFeatureItem', payload );
        },
        setProductReviewItem( { commit }, payload ) {
            commit( 'changeProductReviewItem', payload );
        },
        setProductPriceItem( { commit }, payload ) {
            commit( 'changeProductPriceItem', payload );
        },
        setProductDiscountItem( { commit }, payload ) {
            commit( 'changeProductDiscountItem', payload );
        },
        setPriceItem( { commit }, payload ) {
            commit( 'changePriceItem', payload );
        },
        setProductInventoryItem( { commit }, payload ) {
            commit( 'changeProductInventoryItem', payload );
        },
        setWishItem( { commit }, payload ) {
            commit( 'changeWishItem', payload );
        },
        setCartItem( { commit }, payload ) {
            commit( 'changeCartItem', payload );
        },
        setTradeItem( { commit }, payload ) {
            commit( 'changeTradeItem', payload );
        },
        setTradeItems( { commit }, payload ) {
            commit( 'changeTradeItems', payload );
        },
        setTradeParams( { commit }, payload ) {
            commit( 'changeTradeParams', payload );
        },
        setTradeFolder( { commit }, payload ) {
            commit( 'changeTradeFolder', payload );
        },
        setProductUrl( { commit }, payload ) {
            commit( 'changeProductUrl', payload );
        },
        setCheckoutItem( { commit }, payload ) {
            commit( 'changeCheckoutItem', payload );
        },
        setCancelItem( { commit }, payload ) {
            commit( 'changeCancelItem', payload );
        },
        setReturnItem( { commit }, payload ) {
            commit( 'changeReturnItem', payload );
        },
        setInvoiceItem( { commit }, payload ) {
            commit( 'changeInvoiceItem', payload );
        },
        setReceiptItem( { commit }, payload ) {
            commit( 'changeReceiptItem', payload );
        },
    },
};
