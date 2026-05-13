import { cart } from '../data/cart.js';
import { products } from '../data/products.js';
import { moneyFormat } from './utils/money.js';

function renderOrdersPage() {
  let ordersHTML = '';

  // Get current date using built-in JS
  const today = new Date();
  const dateOptions = { month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    let matchingProduct;

    products.forEach((product) => {
      if (product.id === productId) {
        matchingProduct = product;
      }
    });

    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${formattedDate}</div> 
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${moneyFormat(matchingProduct.priceCents * cartItem.quantity)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${matchingProduct.id}</div>
          </div>
        </div>

        <div class="order-details-grid">
          <div class="product-image-container">
            <img src="${matchingProduct.image}">
          </div>

          <div class="product-details">
            <div class="product-name">${matchingProduct.name}</div>
            <div class="product-delivery-date">
              Arriving on: August 15
            </div>
            <div class="product-quantity">
              Quantity: ${cartItem.quantity}
            </div>
            <button class="buy-again-button button-primary">
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>

          <div class="product-actions">
            <a href="tracking.html?productId=${matchingProduct.id}">
              <button class="track-package-button button-secondary">
                Track package
              </button>
            </a>
          </div>
        </div>
      </div>
    `;
  });

  document.querySelector('.js-orders-grid').innerHTML = ordersHTML;
  updateCartQuantity();
}

function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });
  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = cartQuantity;
  }
}

renderOrdersPage();