/**
 * Created by abbeymart on 2017-09-17
 */

import { mcMessage } from '/imports/lib/locales/getMessage';
import { mcConstant } from '/imports/lib/locales/getConstant';
import { mcLabel } from "imports/lib/locales/getLabel";
import { Locations } from '/imports/collections/Central';
import { checkError, validateError, unAuthorized, tokenExpired, notFound, success } from '../utils';
import { Orders } from "imports/collections/Mpe";
import { Products } from "imports/collections/Asset";
import { utils } from "imports/lib/utils/Utility";

const numFormat = require( 'numeral' );

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

    // order-currency
    const orderCurrency = order.orderPayment.tradeCurrency;

    function stateName( stateCode ) {
        const state = Locations.find( { _id: stateCode } );
        return state ? state.locationName : '';
    }

    function countryName( countryCode ) {
        const country = Locations.find( { _id: countryCode } );
        return country ? country.locationName : '';
    }

    function formatNum( num ) {
        // return two decimal-place formatted numbers/currencies
        return numFormat( num ).format( '0,0.00' );
    }

    function shortDesc( desc ) {
        // set the short description for item.desc
        return utils.shortString( desc, mcConstant.getShortDesc() );
    }

    function productName( itemId ) {
        const product = Products.find( { _id: itemId } );
        return product ? product.productName : 'n/a';
    }

    function productCost( itemId ) {
        const product = Products.find( { _id: itemId } );
        return product ? formatNum( product.productCost ) : 'n/a';
    }

    // TODO: order-items list, format message for order-items and concatenate with the order-message
    let orderItemsList = '';
    order.orderItems.forEach( item => {
        const product = Products.findOne( { _id: item.productId } );
        orderItemsList += `
            <tr>
                <td>product-image</td>
                <td>
                    <b>${item.productName || productName( item.productId )}</b>
                    <br>
                    ${shortDesc( product.productDesc )}
                </td>
                <td>${productCost( item.productId )}</td>
                 <td>${item.productQty}}</td>
            </tr>
        `;
    } );

    // TODO: use table / columns  or style-in-place, instead of div, on the server-side
    const message = `
    <div>
                <div class="w3-container">
                    <div class="col-sm-3">
                        <h4>${mcLabel.shipAddress}</h4>
                        <p>${order.orderPayment.tradeShipAddress.contactName}</p>
                        <p>${order.orderPayment.tradeShipAddress.streetNumber} ${order.orderPayment.tradeShipAddress.streetName}</p>
                        <p>
                            ${order.orderPayment.tradeShipAddress.addressCity}, ${stateName( order.orderPayment.tradeShipAddress.addressState )}, ${order.orderPayment.tradeShipAddress.postalCode}</p>
                        <p>${countryName( order.orderPayment.tradeShipAddress.addressCountry )}</p>
                        <p>${mcLabel.phoneNumber}}: ${order.orderPayment.tradeShipAddress.contactPhone}</p>
                    </div>
                    <div class="col-sm-3">
                        <h4>${mcLabel.payAddress}</h4>
                        <p>${order.orderPayment.tradePayAddress.contactName}</p>
                        <p>${order.orderPayment.tradePayAddress.streetNumber} ${order.orderPayment.tradePayAddress.streetName}</p>
                        <p>
                            ${order.orderPayment.tradePayAddress.addressCity}, ${stateName( order.orderPayment.tradePayAddress.addressState )}, ${order.orderPayment.tradePayAddress.postalCode}</p>
                        <p>${countryName( order.orderPayment.tradePayAddress.addressCountry )}</p>
                    </div>
                    <div class="col-sm-3">
                        <h4>${mcLabel.payDetail}</h4>
                        <h5>[${order.orderPayment.tradePay}]</h5>
                        
                    </div>
                    <div class="col-sm-3">
                        <div><h4>${mcLabel.orderSummary}</h4></div>
                        <div>
                            <span class="col-sm-8"><b>${mcLabel.subTotal} (${order.orderItems.length} ${orderCurrency} ${order.orderPayment.tradeCost}):</b></span>
                            <span class="col-sm-4"><b>${orderCurrency}${order.orderPayment.tradeCost}</b></span>
                            <br>
                            <span class="col-sm-8">${mcLabel.shipEst}:</span>
                            <span class="col-sm-4">${orderCurrency}${order.orderPayment.tradeShipCost}</span>
                            <br>
                            <span class="col-sm-8">${mcLabel.shipTax}:</span>
                            <span class="col-sm-4">${orderCurrency}${order.orderPayment.tradeShipCostTax}</span>
                            <br>
                            <span class="col-sm-8">${mcLabel.orderItem} Tax:</span>
                            <span class="col-sm-4">${orderCurrency}${order.orderPayment.tradeCostTax}</span>
                            <br>
                            <span class="col-sm-8">Order before Tax:</span>
                            <span class="col-sm-4">${orderCurrency}${order.orderPayment.tradeTotalCost}</span>
                            <br>
                            <span class="col-sm-8">${mcLabel.orderTax} (${tradeParams.tradeTaxName}):</span>
                            <span class="col-sm-4">${orderCurrency}${order.orderPayment.tradeTotalCostTax}</span>
                            <br>
                            <span class="col-sm-8"><b>${mcLabel.orderTotalTax}:</b></span>
                            <span class="col-sm-4"><b>${orderCurrency}${order.orderPayment.tradeCostTotalPlusTax}</b></span>
                            <br>
                        </div>
                        <hr>
                        <div>
                            <button class="btn btn-primary" @click.prevent="testPayment">
                                ${mcLabel.payOrder}
                            </button>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="w3-container">
                    <div class="col-sm-2"><h4>${mcLabel.tradeItems}</h4></div>
                    <div class="col-sm-4">
                        <button class="btn btn-primary" @click.prevent="updateTrade">
                            ${mcLabel.tradeUpdate}
                        </button>
                    </div>
                </div>
                <div>
                    <table class="w3-table w3-striped w3-border w3-hoverable" id="mcOrderCartItems">
                        <thead>
                        <tr class="w3-red">
                            <th scope="col">${mcLabel.product}</th>
                            <th scope="col">${mcLabel.cost}</th>
                            <th scope="col">${mcLabel.quantity}</th>
                        </tr>
                        </thead>
                        <tbody>
                        ${orderItemsList}
                        </tbody>
                    </table>
                </div>
            </div>
    `;

    // TODO: validate message and return
    return message;
}