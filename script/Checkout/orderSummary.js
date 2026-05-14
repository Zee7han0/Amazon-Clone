import {cart, removeFromCart, totalCartQuantity, updateDeliveryOption} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import {moneyFormat} from '../utils/money.js';
import {renderPaymentSummary} from './paymentSummary.js';


function updateCheckoutHeader() {
  const quantity = totalCartQuantity();
  document.querySelector('.js-cart-quantity').innerHTML = `Checkout (<a class="return-to-home-link"
          href="index.html">${quantity} items</a>)`
}


export function renderOrderSummary() {

  updateCheckoutHeader();

  if (cart.length === 0) {
    document.querySelector('.js-order-summary').innerHTML = `
      <div>Your cart is empty!</div>
      <a href="index.html">Browse products</a>
    `;
    return;
  }
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);
    


    if (!deliveryOption) {
      deliveryOption = deliveryOptions[0]
    }

    const today = new Date();
    const deliveryDate = new Date(today);

    deliveryDate.setDate(today.getDate() + deliveryOption.deliveryDays);

    const dateString = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }).format(deliveryDate);


    cartSummaryHTML +=`
    <div class="cart-item-container cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${(matchingProduct.image)}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${moneyFormat(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="delete-quantity-link link-primary js-delete-from-cart" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>
        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
        ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
  `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {

    let deliveryOptionsHTML = '';

    deliveryOptions.forEach((deliveryOption) => {

      const today = new Date();
      const deliveryDate = new Date(today);

      deliveryDate.setDate(today.getDate() + deliveryOption.deliveryDays);

      const dateString = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      }).format(deliveryDate);

      const priceString = (deliveryOption.priceCents === 0) ? 
      'Free' : `$${moneyFormat(deliveryOption.priceCents)}`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      deliveryOptionsHTML += `
          <div class="delivery-option">
            <input type="radio" ${(isChecked) ? 'checked' : ''}
              class="delivery-option-input js-delivery-options"
              name="delivery-option-${matchingProduct.id}"
              data-product-id = "${matchingProduct.id}"
              data-delivery-option-id = "${deliveryOption.id}">
            <div>
              <div class="delivery-option-date">
                ${dateString}
              </div>
              <div class="delivery-option-price">
                ${priceString} Shipping
              </div>
            </div>
          </div>
      `;
    })
    return deliveryOptionsHTML;
  };

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-from-cart')
  .forEach((button) => {

    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      removeFromCart(productId);
      renderOrderSummary();
      renderPaymentSummary();

    })
  });

  document.querySelectorAll('.js-delivery-options')
  .forEach((element) => {
    element.addEventListener('click', () => {
      const {productId, deliveryOptionId} = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    })
  })
}

renderOrderSummary();
