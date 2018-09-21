/**
 * Created by abbeymart on 2017-09-17
 */

import { mcConstant } from '/imports/lib/locales/getConstant';
import { mcLabel } from "/imports/lib/locales/getLabel";
import { checkError } from '../utils';
import { Orders } from "/imports/collections/Mpe";
import { Products } from "/imports/collections/Asset";
import { utils } from "/imports/lib/utils/Utility";

// prepare order message by orderNumber and return message
export default function( orderNumber ) {
    // check all arguments
    try {
        check( orderNumber, String );
    } catch( error ) {
        return checkError( error );
    }

    // Get order-info: to prepare order-email message/text
    const order = Orders.findOne( { orderNumber: orderNumber } );

    // tax-name
    order.orderPayment.tradeTaxName = order.orderPayment.tradeTaxName || 'Sales Tax';

    // order-currency
    const orderCurrency = order.orderPayment.tradeCurrency;

    // order-items list, format message for order-items and concatenate with the order-message
    let orderItemsList = '';
    order.orderItems.forEach( item => {
        const product = Products.findOne( { _id: item.productId } );
        orderItemsList += `
            <tr>
                <td style="text-align: left; padding: 10px; border-bottom: 1px solid #eee;">product-image
                </td>
                <td style="text-align: left; padding: 10px; border-bottom: 1px solid #eee;">
                    <b>${item.productName || utils.productName( item.productId )}</b>
                    <br>
                    ${utils.shortString( product.productDesc, mcConstant.getShortDesc() )}
                </td>
                <td style="text-align: left; padding: 10px; border-bottom: 1px solid #eee;">${utils.productCost( item.productId )}
                </td>
                 <td style="text-align: left; padding: 10px; border-bottom: 1px solid #eee;">${item.productQty}
                 </td>
            </tr>
        `;
    } );

    // TODO: use in-line styles on the server-side
    const message = `
                <div style="width: 100%">
                    <div style="width: 25%">
                        <h4>${mcLabel.shipAddress}</h4>
                        <p>${order.orderPayment.tradeShipAddress.contactName}</p>
                        <p>${order.orderPayment.tradeShipAddress.streetNumber} ${order.orderPayment.tradeShipAddress.streetName}</p>
                        <p>
                            ${order.orderPayment.tradeShipAddress.addressCity}, ${utils.stateName( order.orderPayment.tradeShipAddress.addressState )}, ${order.orderPayment.tradeShipAddress.postalCode}</p>
                        <p>${utils.countryName( order.orderPayment.tradeShipAddress.addressCountry )}</p>
                        <p>${mcLabel.phoneNumber}}: ${order.orderPayment.tradeShipAddress.contactPhone}</p>
                    </div>
                    <div style="width: 25%">
                        <h4>${mcLabel.payAddress}</h4>
                        <p>${order.orderPayment.tradePayAddress.contactName}</p>
                        <p>${order.orderPayment.tradePayAddress.streetNumber} ${order.orderPayment.tradePayAddress.streetName}</p>
                        <p>
                            ${order.orderPayment.tradePayAddress.addressCity}, ${utils.stateName( order.orderPayment.tradePayAddress.addressState )}, ${order.orderPayment.tradePayAddress.postalCode}</p>
                        <p>${utils.countryName( order.orderPayment.tradePayAddress.addressCountry )}</p>
                    </div>
                    <div style="width: 25%">
                        <h4>${mcLabel.payDetail}</h4>
                        <h5>[${order.orderPayment.tradePay}]</h5>
                        
                    </div>
                    <div style="width: 25%">
                        <div><h4>${mcLabel.orderSummary}</h4></div>
                        <div>
                            <span style="width: 66%"><b>${mcLabel.subTotal} (${order.orderItems.length} Item(s), ${orderCurrency} ${order.orderPayment.tradeCost}):</b></span>
                            <span style="width: 34%"><b>${orderCurrency}${order.orderPayment.tradeCost}</b></span>
                            <br>
                            <span style="width: 66%">${mcLabel.shipEst}:</span>
                            <span style="width: 34%">${orderCurrency}${order.orderPayment.tradeShipCost}</span>
                            <br>
                            <span style="width: 66%">${mcLabel.shipTax}:</span>
                            <span style="width: 34%">${orderCurrency}${order.orderPayment.tradeShipCostTax}</span>
                            <br>
                            <span style="width: 66%">${mcLabel.orderItem} Tax:</span>
                            <span style="width: 34%">${orderCurrency}${order.orderPayment.tradeCostTax}</span>
                            <br>
                            <span style="width: 66%">${mcLabel.orderBeforeTax}</span>
                            <span style="width: 34%">${orderCurrency}${order.orderPayment.tradeTotalCost}</span>
                            <br>
                            <span style="width: 66%">${mcLabel.orderTax} (${order.orderPayment.tradeTaxName || 'Sales Tax'}):</span>
                            <span style="width: 34%">${orderCurrency}${order.orderPayment.tradeTotalCostTax}</span>
                            <br>
                            <span style="width: 66%"><b>${mcLabel.orderTotalTax}:</b></span>
                            <span style="width: 34%"><b>${orderCurrency}${order.orderPayment.tradeCostTotalPlusTax}</b></span>
                            <br>
                        </div>
                    </div>
                </div>
                <hr>
                <div width="100%">
                    <table>
                        <thead>
                        <tr>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #eee; border-right: 1px solid #eee;">${mcLabel.image}</th>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #eee; border-right: 1px solid #eee;">${mcLabel.product}</th>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #eee; border-right: 1px solid #eee;">${mcLabel.cost}</th>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #eee; border-right: 1px solid #eee;">${mcLabel.quantity}</th>
                        </tr>
                        </thead>
                        <tbody>
                        ${orderItemsList}
                        </tbody>
                    </table>
                </div>
    `;

    // TODO: validate message and return
    return message;
}
