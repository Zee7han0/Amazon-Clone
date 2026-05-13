import {cart} from '../../data/cart.js';
import {getDeliveryOption} from '../../data/deliveryOptions.js';
import {getProduct} from '../../data/products.js';
import {moneyFormat} from '../utils/money.js';


export function renderPaymentSummary() {

  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach(cartItem => {
    const matchingProduct = getProduct(cartItem.productId);
    productPriceCents += matchingProduct.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;

  });

  let totalBeforeTax = productPriceCents + shippingPriceCents;
  let taxCents = totalBeforeTax * 0.1;
  let totalCents = totalBeforeTax + taxCents;

  const paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (3):</div>
      <div class="payment-summary-money">$${moneyFormat(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${moneyFormat(shippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${moneyFormat(totalBeforeTax)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${moneyFormat(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${moneyFormat(totalCents)}</div>
    </div>

    <button class="place-order-button button-primary js-place-order-button">
      Place your order
    </button>`

    document.querySelector('.js-payment-summary')
      .innerHTML = paymentSummaryHTML;


    document.querySelector('.js-place-order-button')
      .addEventListener('click', () => {
        window.location.href = 'orders.html';
      })
}